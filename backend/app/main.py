import mammoth
from fastapi import FastAPI, UploadFile, HTTPException, Form, File
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import tempfile
from dotenv import dotenv_values
import fitz
from openai import OpenAI
from typing_extensions import Annotated
import json
from typing import Union


config = dotenv_values("app/.env")
client = OpenAI(api_key=config["OPENAI_API_KEY"])
origin = config["ORIGIN_URL"]


app = FastAPI()

origins = [ origin ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatItem(BaseModel):
    role: str
    content: str


class ChatContext(BaseModel):
    chatItems: List[ChatItem]


def validate_chat_items(chat_items: List[ChatItem]):
    for chat_item in chat_items:
        # if role or content not subcriptable, raise error
        if "role" not in chat_item or "content" not in chat_item:
            raise HTTPException(
                status_code=400, detail="Invalid chat item")

        if chat_item["role"] != "user" and chat_item["role"] != "system" and chat_item["role"] != "assistant":
            raise HTTPException(
                status_code=400, detail="Invalid chat item role: " + chat_item["role"])

# check if file size is less than 1MB
def validate_file_size(file: UploadFile):
    if file.size > 1000000:
        raise HTTPException(
            status_code=400, detail="File too large: " + file.filename)

def validate_format(file: UploadFile):
    if file.filename.split(".")[-1] != "pdf" and file.filename.split(".")[-1] != "docx" and file.filename.split(".")[-1] != "doc":
        raise HTTPException(
            status_code=400, detail="File format not accepted: " + file.filename)


async def parse_file(file: UploadFile):
    parsed_output = ""
    with tempfile.NamedTemporaryFile() as tmp:
        # batch the reads, prevent memory overflow
        while True:
            data = await file.read(1024)
            if not data:
                break
            tmp.write(data)
        
        if file.filename.split(".")[-1] == "pdf":
            tmp.seek(0)
            pdf = tmp.name
            doc = fitz.open(pdf)

            for page in doc:
                parsed_output += page.get_text()
        elif file.filename.split(".")[-1] == "docx" or file.filename.split(".")[-1] == "doc":
            tmp.seek(0)
            res = mammoth.convert_to_html(tmp)
            parsed_output = res.value
        else:
            raise HTTPException(
                status_code=400, detail="File format not accepted: " + file.filename)

    return parsed_output


@app.post("/query")
async def parse_documents(context: Annotated[str, Form()], files: List[UploadFile] = File(None)) -> ChatContext:
    chat_items = json.loads(context)["chatItems"]

    # validate chat items, should be an array of chat items with role and content
    validate_chat_items(chat_items)

    file_contexts = []

    if files:
        for file in files:

            validate_file_size(file)
            validate_format(file)

            try:
                parsed_output = await parse_file(file)
            except Exception as e:
                # if http error, raise it
                if isinstance(e, HTTPException):
                    raise e

                raise HTTPException(
                    status_code=500, detail="Error parsing file: " + file.filename)
            else:
                file_contexts.append(
                    ChatItem(
                        role="system",
                        content="<FileName>" + file.filename +
                        "</FileName>\n<FileContent>" + parsed_output + "</FileContent>"
                    )
                )

    initial_system_message = ChatItem(
        role="system",
        content="You are a helpful assistant. The user can upload some pdf and word files, which are then parsed as text or html input and sent to you. You are then going to help the user perform analysis on these documents, they could be summaries, comparisons .etc. \n\n\nFile data are provided in formats like this:\n\n\n<FileName>filename</FileName>\n<FileContent>filecontent</FileContent>"
    )

    messages = chat_items + file_contexts

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[initial_system_message] + messages,
            temperature=0,
            max_tokens=4096,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0
        )
        messages.append(
            ChatItem(
                role=response.choices[0].message.role,
                content=response.choices[0].message.content
            )
        )

    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500, detail="Error generating response from gpt3")

    return ChatContext(chatItems=messages)

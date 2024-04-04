import { GetProp, UploadProps } from "antd";



export type ChatItem = {
  role: string;
  content: string;
}

export type ChatContext = {
  chatItems: ChatItem[];
}

export type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];


export type QueryFormProps = {
  chatItems: ChatItem[];
  setChatItems: React.Dispatch<React.SetStateAction<ChatItem[]>>;
}

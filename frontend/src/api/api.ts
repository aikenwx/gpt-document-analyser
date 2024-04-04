import { ChatContext } from "../@types/query";
import { QUERY } from "../utils/constants";
import { requestBackend } from "./requestBackend";


export async function queryApi(formData: FormData) {
  return requestBackend<ChatContext>({
    method: 'post',
    url: QUERY,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    responseType: 'json',
  });
}
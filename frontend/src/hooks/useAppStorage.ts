import { useEffect, useState } from "react";
import { ChatItem } from "../@types/query";
import { LOCAL_STORAGE_KEY } from "../utils/constants";
import { readLocalStorage } from "../utils/localStorageHelper";

export default function useAppStorage() {

  const [chatItems, setChatItems] = useState<ChatItem[]>(
    readLocalStorage<ChatItem[]>(LOCAL_STORAGE_KEY) || []
  );

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(chatItems));
  }, [chatItems]);


  return { chatItems, setChatItems };
}
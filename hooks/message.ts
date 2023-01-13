import { useEffect } from "react";
import { useStateObject } from "../utils/object";

export interface Message {
  id: string;
  [key: string]: any;
}

export const useMessages = () => {
  const { object: messages, setValue, deleteValue } = useStateObject({});

  useEffect(() => {
    const messageCallback = (event) => {
      console.log(`Received message: ${event.data}`);
      const message = event.data as Message;
      setValue(message.id, message);
    };

    window.addEventListener("message", messageCallback);
    return () => {
      window.removeEventListener("message", messageCallback);
    };
  }, []);

  return {
    messages,
    addMessage: (message: Message) => {
      window.postMessage(message);
    },
    removeMessage: (id: strings) => {
      deleteValue(id);
    },
  };
};

import { useEffect } from "react";
import { useStateObject } from "../utils/object";

export interface Message {
  id: string;
  onRemove?: Function;
  [key: string]: any;
}

export const useMessages = () => {
  const { object: messages, setValue, deleteValue } = useStateObject({});

  useEffect(() => {
    const messageCallback = (event) => {
      const message = event.data as Message;
      if (typeof message.id === "string") {
        setValue(message.id, message);
      }
    };

    window.addEventListener("message", messageCallback);
    return () => {
      window.removeEventListener("message", messageCallback);
    };
  }, []);

  return {
    messages,
    addMessage: (message: Message) => {},
    removeMessage: (id: string) => {
      deleteValue(id);
    },
  };
};

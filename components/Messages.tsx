import React, { useEffect } from "react";
import { useStateObject } from "../utils/object";
import { Alert, Snackbar } from "@mui/material";

export type MessageType = "snack" | "alert";

export interface Message {
  id: string;
  message: string;
  type?: MessageType;
  onRemove?: Function;
}

export const useMessages = () => {
  const { object: messages, setValue, deleteValue } = useStateObject({});

  useEffect(() => {
    const messageCallback = (event) => {
      const message = event.detail as Message;
      if (typeof message?.id === "string") {
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
    addMessage: (message: Message) => {
      dispatchEvent(new CustomEvent("message", { detail: message }));
    },
    removeMessage: (id: string) => {
      deleteValue(id);
    },
  };
};

const Messages = () => {
  const { messages, removeMessage } = useMessages();

  return (
    <>
      <Snackbar open={Boolean(messages.alert)} autoHideDuration={6000} onClose={() => removeMessage("alert")}>
        <Alert
          onClose={() => {
            removeMessage("alert");
            messages.alert?.onRemove();
          }}
          severity="success"
          sx={{ width: "100%" }}
        >
          {messages.alert?.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Messages;

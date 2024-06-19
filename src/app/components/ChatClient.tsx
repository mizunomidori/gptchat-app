'use client';

import { useRecoilState } from "recoil";
import { AnimatePresence } from "framer-motion";
import ChatMessage from "./ChatMessage";
import InputForm from "./InputForm";
import { useState } from "react";
import { MessageType } from "../types/custom";
import Loading from "./Loading";
import { chatLogState } from "../states/chatLogState";

const ChatClient = () => {
  const [chatLog, setChatLog] = useRecoilState<MessageType[]>(chatLogState);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (message: MessageType) => {
    try {
      setIsSubmitting(true);
      setChatLog((prev) => [...prev, message]);

      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: [...chatLog, message].map((d) => ({
            role: d.role,
            content: d.content,
          })),
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }
      setChatLog((prev) => [...prev, data.result as MessageType]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex-grow overflow-auto p-6 space-y-5 w-3/4 max-w-2xl h-[calc(100vh-160px)]">
        <AnimatePresence>
          {chatLog.length === 1 ? (
            <div className="flex flex-col items-center justify-center gap-3">
              <p>何でも聞いてええんやで</p>
            </div>
          ) : (
            chatLog.slice(1, chatLog.length).map((chat, index) => {
              return <ChatMessage role={chat.role} content={chat.content} key={index} />
            })
          )}
        </AnimatePresence>
        {isSubmitting && (
          <div className="flex self-start px-8 py-2">
            <Loading />
          </div>
        )}
      </div>

      <InputForm onSubmit={handleSubmit} />
    </>
  );
};

export default ChatClient;

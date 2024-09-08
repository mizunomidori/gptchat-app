'use client';

import { useRecoilState } from "recoil";
import { AnimatePresence } from "framer-motion";
import ChatMessage from "./ChatMessage";
import InputForm from "./InputForm";
import { useState } from "react";
import type { MessageType } from "../../types/custom";
import Loading from "./Loading";
import { chatLogState } from "@/states/chatLogState";
import Header from "./Header";
import Sidebar from "./Sidebar";

export async function* streamChatCompletion(chatLog: MessageType[]) {
  const baseUrl = "http://localhost:8000";
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: chatLog,
    }),
  });

  const reader = response.body?.getReader();

  if (response.status !== 200 || !reader) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const decoder = new TextDecoder("utf-8");
  let done = false;
  while (!done) {
    const { done: readDone, value } = await reader.read();
    if (readDone) {
      done = readDone;
      reader.releaseLock();
    } else {
      const token = decoder.decode(value, { stream: true });
      yield token;
    }
  }
}

export async function* streamChatCompletionNative(chatLog: MessageType[]) {
  const url = "https://api.openai.com/v1/chat/completions";
  const model = "gpt-4o-mini-2024-07-18";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      messages: chatLog,
      model: model,
      stream: true,
    }),
  });

  const reader = response.body?.getReader();

  if (response.status !== 200 || !reader) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const decoder = new TextDecoder("utf-8");
  let done = false;
  while (!done) {
    const { done: readDone, value } = await reader.read();
    if (readDone) {
      done = readDone;
      reader.releaseLock();
    } else {
      const token = decoder.decode(value, { stream: true });
      yield token;
    }
  }
}

const ChatClient = () => {
  const [chatLog, setChatLog] = useRecoilState<MessageType[]>(chatLogState);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (message: MessageType) => {
    try {
      setIsSubmitting(true);
      setChatLog((prev) => [...prev, message]);

      const generator = streamChatCompletion(
        [...chatLog, message].map((d) => ({
          role: d.role,
          content: d.content,
        }))
      );

      for await (let token of generator) {
        console.log(token);
        setChatLog((prev) => [
          ...prev,
          {
            role: "assistant",
            content: token,
          } as MessageType,
        ]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitNative = async (message: MessageType) => {
    try {
      setIsSubmitting(true);
      setChatLog((prev) => [...prev, message]);

      const generator = streamChatCompletionNative(
        [...chatLog, message].map((d) => ({
          role: d.role,
          content: d.content,
        }))
      );

      for await (let token of generator) {
        console.log(token);
        setChatLog((prev) => [
          ...prev,
          {
            role: "assistant",
            content: token,
          } as MessageType,
        ]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="overflow-hidden w-full h-full relative">
      <div className="w-full md:fixed md:inset-x-0 md:flex md:pl-[260px] md:h-[80px] md:flex-col">
        <Header />
      </div>

      <div className="md:fixed md:inset-y-0 md:flex md:w-[260px] md:flex-col">
        <Sidebar />
      </div>

      <div className="flex flex-1 flex-col md:pl-[260px] md:pt-[80px] h-screen">
        <div className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1">
          <AnimatePresence>
            {chatLog.length === 1 ? (
              <div className="flex flex-col items-center justify-center gap-3">
                <p>何でも聞いてええんやで</p>
              </div>
            ) : (
              chatLog.slice(1, chatLog.length).map((chat, index) => {
                return (
                  <ChatMessage
                    role={chat.role}
                    content={chat.content}
                    key={index}
                  />
                );
              })
            )}
          </AnimatePresence>
          {isSubmitting && (
            <div className="flex self-start px-8 py-2">
              <Loading />
            </div>
          )}

          {/* FIXME: Move on scroll */}
          <div className="absolute z-10 bottom-0 left-0 w-full md:border-transparent md:dark:border-transparent bg-white dark:bg-gray-800 md:!bg-transparent">
            <InputForm onSubmit={handleSubmitNative} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatClient;

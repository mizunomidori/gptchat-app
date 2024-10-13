'use client';

import { useRecoilState } from "recoil";
import { AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

import ChatMessage from "./ChatMessage";
import InputForm from "./InputForm";
import Loading from "./Loading";
import Header from "./Header";
import Sidebar from "./Sidebar";

import type { MessageType } from "../../types/custom";
import { chatLogState } from "@/states/chatLogState";
import { streamChatCompletion, streamChatCompletionNative } from "@/app/api/gemini";

const ChatClient = () => {
  const [chatLog, setChatLog] = useRecoilState<MessageType[]>(chatLogState);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const isTypingRef = useRef(false);
  const chatMessageRef = useRef<HTMLDivElement>(null);

  const controllerRef = useRef<AbortController | null>(null);

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

      setChatLog((prev) => [
        ...prev,
        {
          role: "assistant",
          content: '',
        } as MessageType,
      ]);

      for await (let token of generator) {
        setChatLog((prev: MessageType[]) => {
          return prev.map((chat, index) =>
            index === prev.length - 1
              ? ({
                  content: chat.content + token,
                  role: chat.role,
                } as MessageType)
              : chat
          );
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitNative = async (message: MessageType) => {
    controllerRef.current = new AbortController();
    const signal = controllerRef.current.signal;

    try {
      setIsSubmitting(true);
      setChatLog((prev) => [...prev, message]);

      const generator = streamChatCompletionNative(
        [...chatLog, message].map(
          (d) =>
            ({
              role: d.role,
              content: d.content,
            } as MessageType)
        ),
        signal,
      );

      setChatLog((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "",
        } as MessageType,
      ]);

      setIsTyping(true);
      isTypingRef.current = true;

      for await (let token of generator) {
        if (!isTypingRef.current) {
          break;
        }
        setChatLog((prev: MessageType[]) => {
          return prev.map((chat, index) =>
            index === prev.length - 1
              ? ({
                  content: chat.content + token,
                  role: chat.role,
                } as MessageType)
              : chat
          );
        });
      }

    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
      controllerRef.current?.abort();
    }
  };

  const abortFetching = () => {
    setIsSubmitting(false);
    setIsTyping(false);
    isTypingRef.current = false;
    controllerRef.current?.abort();
  };

  const handleComplete = () => {
    if (!isSubmitting) {
      console.log("complete!");
      setIsTyping(false);
      isTypingRef.current = false;
    }
  }

  const removeChatHistory = () => {
    console.log('hey');
    setChatLog([]);
  }

  return (
    <div className="overflow-hidden w-full h-full relative">
      <div className="w-full md:fixed md:inset-x-0 md:flex md:pl-[260px] md:h-[80px] md:flex-col">
        <Header />
      </div>

      <div className="md:fixed md:inset-y-0 md:flex md:w-[260px] md:flex-col">
        <Sidebar chatLog={chatLog} removeChatHistory={removeChatHistory} />
      </div>

      <div className="flex flex-1 flex-col md:pl-[260px] md:pt-[80px] h-screen">
        <div className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1">
          <AnimatePresence>
            {chatLog.length === 1 ? (
              <div className="flex flex-col items-center justify-center gap-3">
                <p>何でも聞いてええんやで</p>
              </div>
            ) : (
              <div className="overflow-y-auto" ref={chatMessageRef}>
                {chatLog.slice(1, chatLog.length).map((chat, index) => {
                  return (
                    <ChatMessage
                      message={chat}
                      onComplete={handleComplete}
                      parentRef={chatMessageRef}
                      key={index}
                    />
                  );
                })}
              </div>
            )}
          </AnimatePresence>
          {isSubmitting && (
            <div className="flex self-start px-8 py-2">
              <Loading />
            </div>
          )}

          {(isSubmitting || isTyping) && (
            <div className="absolute z-10 bottom-20 left-1/2">
              <button
                onClick={abortFetching}
                className="rounded-xl bg-red-400 text-white py-1 px-4"
              >
                Stop Response
              </button>
            </div>
          )}

          <div className="absolute z-10 bottom-0 left-0 w-full md:border-transparent md:dark:border-transparent bg-white dark:bg-gray-800 md:!bg-transparent">
            <InputForm onSubmit={handleSubmitNative} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatClient;

"use client";

import { AnimatePresence } from "framer-motion";
import { MessageType } from "@/types/custom";
import { ChatBubbleLeftIcon, PlusIcon } from "./ui/Icon";

const Sidebar = ({
  chatLog,
  removeChatHistory,
}: {
  chatLog: MessageType[];
  removeChatHistory: () => void;
}) => {
  return (
    <div className="flex h-full min-h-0 flex-col bg-slate-200 dark:bg-slate-900 bg-opacity-20 dark:bg-opacity-20">
      {/* New chat */}
      <div className="flex justify-center pt-4">
        <button
          className="border border-slate-800 dark:border-slate-200 bg-none dark:text-slate-50 rounded-lg py-1 px-4 flex flex-row gap-2 items-center"
          onClick={removeChatHistory}
        >
          <PlusIcon />
          <span>New Chat</span>
        </button>
      </div>
      {/* Chat history */}
      <div className="flex flex-col p-2">
        <div className="flex py-3 px-3 items-center dark:text-gray-100 text-sm">
          <h2>Chat history</h2>
        </div>
        <div className="overflow-y-auto flex-col gap-3">
          <AnimatePresence>
            {chatLog.slice(1, chatLog.length).map((chat, index) => {
              if (chat.role === "user") {
                return (
                  <div
                    className="flex flex-row gap-2 items-center w-full border border-slate-800 dark:border-slate-200 rounded-md p-1"
                    key={index}
                  >
                    <div className="dark:text-white h-[20px] w-[20px]">
                      <ChatBubbleLeftIcon />
                    </div>
                    <div>{chat.content}</div>
                  </div>
                );
              }
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

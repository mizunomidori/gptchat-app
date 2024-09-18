import { useRecoilState } from "recoil";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import RectMarkdown from "react-markdown";

import { chatLogState } from "@/states/chatLogState";
import { MessageType } from "../../types/custom";
import { GptIcon, UserIcon } from "./ui/Icon";

const ChatMessage = (message: MessageType) => {
  const [chatMessage, setChatMessage] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [chatLog, setChatLog] = useRecoilState(chatLogState);
  const scrollBottomRef = useRef<HTMLDivElement>(null);

  const typingSpeed = 5;

  useEffect(() => {
    if (currentIndex < message.content.length) {
      const timeoutId = setTimeout(() => {
        setChatMessage((prevText) => prevText + message.content[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
        // 最新メッセージへスクロール
        scrollBottomRef.current?.scrollIntoView();
      }, typingSpeed);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [message.content, currentIndex]);

  return (
    <motion.div
      style={{
        width: "full",
      }}
      initial={{
        opacity: 0,
        translateY: "100%",
      }}
      animate={{ opacity: 1, translateY: 0, transition: { duration: 0.3 } }}
      exit={{ opacity: 0, translateY: 0 }}
    >
      <div className="h-full">
        <div className="bg-gray-100 dark:bg-gray-800">
          <div>
            <div className="flex flex-col items-center text-sm dark:bg-gray-800">
              <div
                className={`w-full border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group ${
                  message.role === "assistant"
                    ? "bg-[#ececed] dark:bg-[#444654]"
                    : "dark:bg-gray-800"
                }`}
              >
                <div className="text-base gap-4 md:gap-6 m-auto md:max-w-2xl lg:max-w-2xl xl:max-w-3xl p-4 mb-10 md:py-6 flex lg:px-0">
                  <div className="w-[30px] flex flex-col relative items-end">
                    <div className="relative h-[30px] w-[30px] p-1 rounded-sm text-white flex items-center justify-center bg-[#10a37f]">
                      {message.role === "assistant" && <GptIcon />}
                      {message.role === "user" && <UserIcon />}
                    </div>
                  </div>
                  <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
                    <div className="flex flex-grow flex-col gap-3">
                      <div className="min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap">
                        {message.role === "assistant"
                          ? <RectMarkdown>{chatMessage}</RectMarkdown> || ""
                          : message.content || ""}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 最新ポストにスクロールするために配置 */}
      <div ref={scrollBottomRef} />
    </motion.div>
  );
};

export default ChatMessage;

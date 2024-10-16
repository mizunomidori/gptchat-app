import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Markdown from "react-markdown";
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

import { MessageType } from "../../types/custom";
import {
  CopyIcon,
  GptIcon,
  ThumbDownIcon,
  ThumbUpIcon,
  UserIcon,
  EditIcon,
} from "./ui/Icon";

const ChatMessage = ({
  message,
  onComplete,
  parentRef,
}: {
  message: MessageType,
  onComplete: any,
  parentRef: any,
}) => {
  const [chatMessage, setChatMessage] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollBottomRef = useRef<HTMLDivElement>(null);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [isThumbsUp, setIsThumbsUp] = useState(false);
  const [isThumbsDown, setIsThumbsDown] = useState(false);

  const typingSpeed = 5; // milli sec

  const copyOnClipboard = async (message: string) => {
    try {
      await navigator.clipboard.writeText(message);

      setIsCopied(true);

      const timeout = setTimeout(() => {
        setIsCopied(false);
      }, 1000);

      return () => clearTimeout(timeout);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const currrentWindowRef = parentRef.current;
    const handleScroll = () => {
      const scrollTop = parentRef.current?.scrollTop;
      const scrollHeight = parentRef.current?.scrollHeight;
      const clientHeight = parentRef.current?.clientHeight;
      if (scrollTop && scrollHeight && clientHeight) {
        if ((scrollHeight - scrollTop) - clientHeight <= 1) {
          setIsAutoScroll(true);
        } else {
          setIsAutoScroll(false);
        }
      }
    };

    currrentWindowRef?.addEventListener("scroll", handleScroll);
    return () => currrentWindowRef?.removeEventListener("scroll", handleScroll);
  }, [parentRef]);

  useEffect(() => {
    if (currentIndex < message.content.length) {
      const timeoutId = setTimeout(() => {
        setChatMessage((prevText) => prevText + message.content[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
        if (isAutoScroll) {
          // 最新メッセージへスクロール
          scrollBottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      }, typingSpeed);

      return () => {
        clearTimeout(timeoutId);
      };
    } else if (currentIndex === message.content.length) {
      onComplete();
    }
  }, [message.content, currentIndex, onComplete, isAutoScroll]);

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
                    ? "bg-[#ececed] dark:bg-[#444654] bg-opacity-40 dark:bg-opacity-40"
                    : "bg-gray-300 dark:bg-gray-800 bg-opacity-40 dark:bg-opacity-40"
                }`}
              >
                <div className="text-base gap-4 md:gap-6 m-auto md:max-w-xl lg:max-w-xl xl:max-w-2xl p-4 mb-10 md:py-6 flex lg:px-0">
                  <div className="w-[30px] flex flex-col relative items-end">
                    <div className="relative h-[30px] w-[30px] p-1 rounded-sm text-white flex items-center justify-center bg-[#10a37f]">
                      {message.role === "assistant" && <GptIcon />}
                      {message.role === "user" && <UserIcon />}
                    </div>
                  </div>
                  <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
                    <div className="flex flex-grow flex-col gap-3">
                      <div className="min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap">
                        {message.role === "assistant" ? (
                          <Markdown>{chatMessage}</Markdown>
                        ) : (
                          message.content || ""
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    {message.role === "assistant" ? (
                      <div className="flex flex-row gap-5 md:invisible md:group-hover:visible">
                        <div
                          className="z-10 absolute top-[-0px] right-[260px] duration-200"
                          style={{ opacity: isCopied ? 1 : 0 }}
                        >
                          <span className="absolute -top-4 bg-slate-600 rounded px-2 py-1 -translate-x-1/2 before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-slate-600">
                            Copied!
                          </span>
                        </div>
                        <button
                          className="h-[20px] w-[20px] dark:text-white"
                          onClick={() => copyOnClipboard(message.content)}
                        >
                          <CopyIcon />
                        </button>
                        <button
                          className="h-[20px] w-[20px] dark:text-white"
                          onClick={() => setIsThumbsUp(!isThumbsUp)}
                        >
                          <ThumbUpIcon />
                        </button>
                        <button
                          className="h-[20px] w-[20px] dark:text-white"
                          onClick={() => setIsThumbsDown(!isThumbsDown)}
                        >
                          <ThumbDownIcon />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-row gap-5 md:invisible md:group-hover:visible">
                        <div
                          className="z-10 absolute top-[-0px] right-[260px] duration-200"
                          style={{ opacity: isCopied ? 1 : 0 }}
                        >
                          <span className="absolute -top-4 bg-slate-600 rounded px-2 py-1 -translate-x-1/2 before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-slate-600">
                            Copied!
                          </span>
                        </div>
                        <button
                          className="h-[20px] w-[20px] dark:text-white"
                          onClick={() => copyOnClipboard(message.content)}
                        >
                          <CopyIcon />
                        </button>
                        <button className="h-[20px] w-[20px] dark:text-white">
                          <EditIcon />
                        </button>
                        <div className="h-[20px] w-[20px]"></div>
                      </div>
                    )}
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

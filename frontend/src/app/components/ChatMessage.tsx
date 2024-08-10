import { useRecoilState } from "recoil";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { chatLogState } from "../states/chatLogState";
import { MessageType } from "../types/custom";

const ChatMessage = (message: MessageType) => {
  const [chatMessage, setChatMessage] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [chatLog, setChatLog] = useRecoilState(chatLogState);

  useEffect(() => {
    if (currentIndex < message.content.length) {
      const timeoutId = setTimeout(() => {
        setChatMessage((prevText) => prevText + message.content[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, 80);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [message.content, currentIndex]);

  return (
    <motion.div
      style={{
        alignSelf: message.role === 'assistant' ? 'flex-start' : 'flex-end',
        width: 'auto',
      }}
      initial={{
        opacity: 0,
        translateY: '100%',
      }}
      animate={{ opacity: 1, translateY: 0, transition: { duration: 0.3 } }}
      exit={{ opacity: 0, translateY: 0 }}
    >
      <div className={`flex gap-5 w-full mt-2 ${message.role === 'assistant'
        ? 'flex-row'
        : 'flex-row-reverse'
        }`}>
        <div className={`flex p-2 max-w-xl w-auto mt-2 flex-col break-all bg-slate-300 dark:bg-slate-900 ${message.role === 'assistant'
          ? 'rounded-bl-xl rounded-e-xl'
          : 'rounded-s-xl rounded-tr-xl'
          }`}>
          {message.role === 'assistant' && (
            <div className="flex self-end italic opacity-40 text-xs font-bold">
              Azure
            </div>
          )}
          {message.role === 'user' && (
            <div className="flex self-start italic opacity-40 text-xs font-bold">
              YOU
            </div>
          )}
          {message.role === 'assistant'
            ? chatMessage || ''
            : message.content || ''}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;

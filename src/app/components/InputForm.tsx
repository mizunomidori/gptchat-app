'use client';

import React, { useState } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import { chatLogState } from "../states/chatLogState";
import { MessageType } from "../types/custom";

type InputFormProps = {
  onSubmit: (message: MessageType) => Promise<void>;
};

const InputForm = ({ onSubmit }: InputFormProps) => {
  const [input, setInput] = useState<string>('');
  const [chatLog, setChatLog] = useRecoilState(chatLogState);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input) {
      onSubmit({
        role: 'user',
        content: input,
      });
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 flex justify-between items-center w-3/4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full p-2 mr-2 rounded focus:outline-none text-gray-800 bg-slate-300"
        placeholder="input message..."
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        submit
      </button>
    </form>
  );
};

export default InputForm;

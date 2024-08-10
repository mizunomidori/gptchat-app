'use client';

import React, { useRef, useState } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import { chatLogState } from "../states/chatLogState";
import { MessageType } from "../types/custom";

type InputFormProps = {
  onSubmit: (message: MessageType) => Promise<void>;
};

const InputForm = ({ onSubmit }: InputFormProps) => {
  const [chatLog, setChatLog] = useRecoilState(chatLogState);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const input = inputRef.current?.value;

    if (input) {
      onSubmit({
        role: 'user',
        content: input,
      });
      inputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 flex justify-between items-center w-3/4">
      <input
        type="text"
        ref={inputRef}
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

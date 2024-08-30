'use client';

import React, { useRef, useState } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import { chatLogState } from "@/states/chatLogState";
import { MessageType } from "@/types/custom";

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
    <form
      onSubmit={handleSubmit}
      className="stretch mx-2 flex flex-row gap-3 pt-2 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl lg:pt-6"
    >
      <input
        type="text"
        ref={inputRef}
        className="m-0 w-full resize-none border-0 bg-transparent p-0 pl-2 pr-7 focus:ring-0 focus-visible:ring-0 focus-visible:outline-0 dark:bg-transparent md:pl-0"
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

'use client';

import React, { useRef, useState } from "react";
import { MessageType } from "@/types/custom";
import { SubmitIcon } from "./ui/Icon";

type InputFormProps = {
  onSubmit: (message: MessageType) => Promise<void>;
};

const InputForm = ({ onSubmit }: InputFormProps) => {
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
      className="stretch mx-2 flex flex-row gap-3 pt-2 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-2xl lg:pt-6"
    >
      <input
        type="text"
        ref={inputRef}
        className="m-0 w-full resize-none border-0 bg-transparent p-1 pl-2 md:pl-2 pr-7 focus:ring-0 focus-visible:ring-0 focus-visible:outline-0 dark:bg-transparent"
        placeholder="Ask me anything..."
      />
      <button
        type="submit"
        className="absolute p-0 rounded-md text-gray-500 md:bottom-[30px] md:right-[80px] hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
      >
        <SubmitIcon />
      </button>
    </form>
  );
};

export default InputForm;


import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { MessageType } from '@/types/custom';

export async function* streamChatCompletion(chatLog: MessageType[]) {
  const baseUrl = "http://localhost:8000";
  const response = await fetch(`${baseUrl}/api/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: chatLog[chatLog.length - 1].content,
    }),
  });

  const reader = response.body?.getReader();

  if (response.status !== 200 || !reader) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const decoder = new TextDecoder("utf-8");
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      reader.releaseLock();
    } else {
      const token = decoder.decode(value, { stream: true });
      yield token;
    }
  }
}

export async function* streamChatCompletionNative(chatLog: MessageType[], signal: AbortSignal) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_OPENAI_API_KEY || "";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:streamGenerateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${process.env.NEXT_PUBLIC_GEMINI_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: chatLog[chatLog.length - 1].content,
            },
          ],
        },
      ],
    }),
    signal: signal,
  });

  const reader = response.body?.getReader();

  if (response.status !== 200 || !reader) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const decoder = new TextDecoder("utf-8");

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }
      const chunk = decoder.decode(value, { stream: true });
      console.log(`Chunk received: ${new Date().toISOString()}`);
      let match;
      const regex = /"text":\s*"((?:\\.|[^\"])*)"/g;
      while ((match = regex.exec(chunk)) !== null) {
        const extractedText = match[1].replace(/\\n/g, "\n");
        console.log("Extracted text:", extractedText);
        yield extractedText;
      }
    }
  } finally {
    reader.releaseLock();
  }

  // const genAI = new GoogleGenerativeAI(apiKey);

  // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // const response = await model.generateContentStream(
  //   chatLog[chatLog.length - 1].content
  // );

  // for await (const chunk of response.stream) {
  //   const chunkText = chunk.text();
  //   yield chunkText;
  // }
}

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_OPENAI_API_KEY;
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:streamGenerateContent";

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(req.body),
  };

  const response = await fetch(url, requestOptions);
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let result = "";

  if (reader) {
    const { done, value } = await reader.read();
    if (done) {
      res.status(200).json(JSON.parse(result));
      return;
    }

    result += decoder.decode(value, { stream: true });

    // 完全なJSONオブジェクトが形成されているか確認
    try {
      JSON.parse(result);
    } catch (e) {
      // JSONが完全でない場合はエラーを無視
      console.log(e);
    }

    return reader.read();
  } else {
    res.status(500).json({ error: "Failed to read stream" });
  }
}

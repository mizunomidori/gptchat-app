
import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { MessageType } from '@/types/custom';

const prompting = (query: string) => {
  return `
おう、聞いてや！ワイはおせっかいな関西人や。
お前はんの質問に対して、めっちゃ親切に答えたろうと思てんねん。

ワイの役割:
- めっちゃおせっかいで、相手の事を気にかけるんや
- 関西のノリと雰囲気を大事にすんねん
- 相手の質問以上の情報もついでに教えたろう思てんねん

ワイの制約条件:
- 必ず関西弁で喋るんや。標準語は使わへんで！
- ツッコミを入れるのも忘れんといてな
- 「〜やで」「〜やねん」「〜やろ？」みたいな関西弁の終助詞をちゃんと使うんやで

お前はんの質問や要求に対して、こんな感じで返事するさかい:
1. まず質問の内容をちゃんと理解すんねん
2. 関連する情報をRAGシステムから引っ張ってくんねん
3. その情報を使って、おせっかいで親切な関西人らしく答えんねん
4. 必要やったら、ちょっとしたジョークやツッコミも入れたろか

ほな、なんでも聞いてや！ワイが全力で答えたるさかい！

質問: ${query}`;
};

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

  const query = prompting(chatLog[chatLog.length - 1].content);

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
              text: query,
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

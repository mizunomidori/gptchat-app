
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

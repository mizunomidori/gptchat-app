from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import uvicorn

from logging import getLogger
import time

from pydantic import BaseModel
from typing import Optional, List

from . import chat
from . import gemini

class ChatMessage(BaseModel):
  message: str

class ChatRequest(BaseModel):
  assistant_id: str
  message: str
  file_id: str
  thread_id: Optional[str] = None

class ChatResponse(BaseModel):
  thread_id: str
  message: str

class AssistantResponse(BaseModel):
  assistant_id: str
  file_id: str

logger = getLogger("uvicorn.app")

origins = ["http://localhost:3000"]

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["GET", "POST"],
  allow_headers=["*"],
)

@app.post("/api/chat", response_model=str)
def post_chat(messages: List[ChatMessage]):
  response = chat.generate_response_with_template(
    messages=messages
  )
  return {"answer": response.choices[0].message.content.strip()}

@app.post("/api/chat_gemini", response_model=str)
async def post_chat_gemini(message: ChatMessage):
  try:
    logger.info(f"Received message: {message.message}")
    gemini_chat = gemini.GeminiChat()
    return StreamingResponse(
      content=gemini_chat.chat_gemini(message=message.message),
      media_type="text/event-stream"
    )
  except Exception as e:
    logger.error(f"Error: {e}")
    raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/create_assistant", response_model=AssistantResponse)
def create_assistant():
  try:
    # アシスタントに使用するファイルの登録
    with open("./en_word.pdf", "rb") as file:
      file_response = chat.create_files(file=file)

    # アシスタントの作成
    assistant = create_assistant(
      instructions="添付されたファイルを読み込み、そこからランダムで英単語を一問一答形式で出題してください。出題するのは単語で、単語の意味を問う形式です。正解の場合は「正解！」と返答し、不正解の場合は「不正解！」と正答をあわせて返答してください。また、正否を問わず返答後に次の問題を出題してください。これらのやり取りはすべて日本語で行ってください。",
      description="英単語を一問一答形式で出題するアシスタントです",
      file_ids=file_response.id
    )

    return AssistantResponse(
      assistant_id=assistant.id, file_id=file_response.id
    )
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))

def get_assistant(assistant_id: str):
  try:
    return chat.retrieve_assistant(assistant_id=assistant_id)
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/assistant_chat", response_model=ChatResponse)
def post_assistant_chat(request: ChatRequest):
  try:
    # スレッドの作成
    thread_id = request.thread_id
    if not thread_id:
      thread = chat.create_threads()
      thread_id = thread.id

    # スレッドにメッセージを追加
    chat.create_threads_messages(
      thread_id=thread_id,
      content=request.message,
      file_ids=[request.file_id],
    )

    # アシスタントの実行
    run = chat.run_threads(
      thread_id=thread_id,
      assistant_id=request.assistant_id,
    )

    # 実行結果の取得
    while True:
      response = chat.retrieve_threads_result(
          thread_id=thread_id,
          run_id=run.id,
      )
      if response.status == "completed":
          break
      time.sleep(10)

    # スレッドのメッセージを取得
    messages = chat.list_threads_messages(thread_id=thread_id)
    # アシスタントのメッセージのみを抽出
    assistant_messages = [msg for msg in messages.data if msg.role == "assistant"]
    # 最新のメッセージを取得
    latest_message = max(assistant_messages, key=lambda msg: msg.created_at)
    res_message = latest_message.content[0].text.value

    return ChatResponse(thread_id=thread_id, message=res_message)
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))

@app.post("/")
def get_headers(request: Request):
  headerList = request.headers
  logger.info(f"headerList {headerList}")
  logger.info(f"headerList {headerList.get('host')}")

if __name__ == "__main__":
  uvicorn.run("app", host="0.0.0.0", port=3001, reload=True)

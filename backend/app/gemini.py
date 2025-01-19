import google.generativeai as genai
from .config import GEMINI_OPENAI_API_KEY

class GeminiChat:
  def __init__(self, api_key: str = GEMINI_OPENAI_API_KEY):
    genai.configure(api_key=api_key)
    self.model = genai.GenerativeModel("gemini-1.5-flash")
    self.chat = self.model.start_chat(history=[])

  async def chat_gemini(self, message: str):
    response = self.chat.send_message(message, stream=True)
    for chunk in response:
      yield chunk.text

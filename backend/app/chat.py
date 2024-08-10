
import openai

from .config import OPENAI_API_KEY

client = openai.OpenAI(api_key=OPENAI_API_KEY)
model = "gpt-4o-mini-2024-07-18"

def generate_response(messages):
  return openai.ChatCompletion.create(
    model=model,
    messages=messages,
    temperature=0.0,
  )


'''
Assistants API
'''
def create_assistant(instructions: str, description: str, file_ids: str):
  model = "gpt-4o-mini-2024-07-18"

  return client.beta.assistants.create(
    instructions=instructions,
    description=description,
    name="assistant-api",
    tools=[{"type": "retrieval"}],
    model=model,
    file_ids=[file_ids],
  )

def retrieve_assistant(assistant_id: str):
  return client.beta.assistants.retrieve(assistant_id=assistant_id)

def create_files(file):
  return client.files.create(file=file, purpose="assistants")

def create_threads():
  return client.beta.threads.create()

def create_threads_messages(thread_id: str, content: str, file_ids) -> None:
  client.beta.threads.messages.create(
    thread_id=thread_id,
    role="user",
    content=content,
    file_ids=[file_ids],
  )

def run_threads(thread_id: str, assistant_id: str):
  return client.beta.threads.runs.create(
    thread_id=thread_id,
    assistant_id=assistant_id,
  )

def retrieve_threads_result(thread_id: str, run_id: str):
  return client.beta.threads.runs.retrieve(
    thread_id=thread_id,
    run_id=run_id,
  )

def list_threads_messages(thread_id: str):
  return client.beta.threads.messages.list(thread_id=thread_id)

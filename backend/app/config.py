import os
from dotenv import load_dotenv

load_dotenv(verbose=True)

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY") or ""

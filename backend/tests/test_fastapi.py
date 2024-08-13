from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

def test_post_chat_NR001():
  response = client.post([
    {'content': 'hello'}
  ])

  assert response.status_code == 200

  assert response.json() == {
    "answer": "hello"
  }

def test_post_chat_ABR001():
  response = client.post([
    {'dummy': 'hello'}
  ])

  assert response.status_code == 400

  assert response.json() == {
    "answer": "dummy",
  }

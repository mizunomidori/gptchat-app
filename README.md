# GPTChat App

This is a chat application that leverages Chat-GPT for intelligent conversations. The frontend is built using Next.js, and the backend API is developed with Python.

## Features

- Real-time chat interface
- Intelligent responses powered by Chat-GPT
- User authentication and session management
- Responsive design

## Technologies Used

- **Frontend:** Next.js
- **Backend:** Python
- **API:** FastAPI

## Getting Started

### Prerequisites

- Node.js
- Python 3.8+

### Installation

1. **Clone the repository:**
  ```bash
  git clone https://github.com/yourusername/gptchat-app.git
  cd gptchat-app
  ```

2. **Install frontend dependencies:**
  ```bash
  cd frontend
  npm install
  ```

3. **Install backend dependencies:**
  ```bash
  cd ../backend
  pip install -r requirements.txt
  ```

### Running the Application

1. **Start the backend server:**
  ```bash
  cd backend
  uvicorn main:app --reload
  ```

2. **Start the frontend server:**
  ```bash
  cd ../frontend
  npm run dev
  ```

3. **Open your browser and navigate to:**
  ```
  http://localhost:3000
  ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

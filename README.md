
Chat app with React frontend and Node backend.

Backend
- Express server
- Session management in memory
- Gemini integration with optional fallback to mock data
- npm start runs node server.js
- node server.js also works directly

Frontend
- React + Vite + TailwindCSS
- Sidebar with sessions
- New chat button
- Chat window with table answers and feedback
- Dark and light theme toggle

Run backend
1) cd backend
2) Create .env with GEMINI_API_KEY=your_key (or leave empty for mock)
3) npm install
4) npm start
   or: node server.js

Run frontend
1) cd frontend
2) npm install
3) npm run dev

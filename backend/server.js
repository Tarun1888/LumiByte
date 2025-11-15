
import "dotenv/config";
import express from "express";
import cors from "cors";
import { nanoid } from "nanoid";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const sessions = {};

const apiKey = process.env.GEMINI_API_KEY || "";
let geminiModel = null;

if (apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey);
  geminiModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
} else {
  console.warn("GEMINI_API_KEY is not set. Using mock answers.");
}

function safeJsonParse(text) {
  try {
    const first = text.indexOf("{");
    const last = text.lastIndexOf("}");
    if (first === -1 || last === -1) return null;
    const jsonString = text.slice(first, last + 1);
    return JSON.parse(jsonString);
  } catch (e) {
    console.error("JSON parse error:", e.message);
    return null;
  }
}

function createMockAnswer(question) {
  const table = {
    headers: ["Metric", "Value", "Notes"],
    rows: [
      ["Relevance", "0.90", "Static mock value"],
      ["Tokens", "120", "Approximate length"],
      ["Confidence", "High", "Generated without model"],
      ["Latency", "100 ms", "Simulated"]
    ]
  };
  const description =
    `This is a mock response for: "${question}". It contains demo metrics only.`;
  return {
    id: nanoid(6),
    description,
    table,
    feedback: null
  };
}

async function generateAnswer(question) {
  if (!geminiModel) {
    return createMockAnswer(question);
  }

  const prompt = `
Return only JSON with keys description and table.
Example:
{
  "description": "text",
  "table": {
    "headers": ["Column 1", "Column 2"],
    "rows": [["a", "b"], ["c", "d"]]
  }
}
User question: "${question}"
`;

  try {
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const data = safeJsonParse(text);
    if (!data || !data.description || !data.table) {
      console.warn("Invalid Gemini structure, using mock answer.");
      return createMockAnswer(question);
    }
    return {
      id: nanoid(6),
      description: String(data.description),
      table: {
        headers: Array.isArray(data.table.headers)
          ? data.table.headers.map(String)
          : [],
        rows: Array.isArray(data.table.rows)
          ? data.table.rows.map(r =>
              Array.isArray(r) ? r.map(v => String(v)) : []
            )
          : []
      },
      feedback: null
    };
  } catch (e) {
    console.error("Gemini call failed:", e.message);
    return createMockAnswer(question);
  }
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", geminiConfigured: Boolean(apiKey) });
});

app.post("/api/sessions", (req, res) => {
  const id = nanoid(8);
  const createdAt = new Date().toISOString();
  const title = (req.body && req.body.title) || `Session ${Object.keys(sessions).length + 1}`;
  sessions[id] = { id, title, createdAt, messages: [] };
  res.status(201).json(sessions[id]);
});

app.get("/api/sessions", (req, res) => {
  const list = Object.values(sessions).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  res.json(list);
});

app.get("/api/sessions/:id", (req, res) => {
  const session = sessions[req.params.id];
  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }
  res.json(session);
});

app.post("/api/sessions/:id/messages", async (req, res) => {
  const session = sessions[req.params.id];
  const question = (req.body && req.body.question) || "";
  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }
  if (!question.trim()) {
    return res.status(400).json({ error: "Question is required" });
  }
  const answer = await generateAnswer(question);
  const message = {
    id: nanoid(10),
    role: "user",
    question,
    answer,
    createdAt: new Date().toISOString()
  };
  session.messages.push(message);
  res.status(201).json(message);
});

app.post("/api/sessions/:sessionId/messages/:messageId/feedback", (req, res) => {
  const session = sessions[req.params.sessionId];
  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }
  const message = session.messages.find(m => m.id === req.params.messageId);
  if (!message) {
    return res.status(404).json({ error: "Message not found" });
  }
  const feedback = req.body ? req.body.feedback : null;
  if (!["like", "dislike", null].includes(feedback)) {
    return res.status(400).json({ error: "Invalid feedback" });
  }
  message.answer.feedback = feedback;
  res.json({ success: true, messageId: message.id, feedback });
});

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
  if (apiKey) {
    console.log("Gemini is configured.");
  } else {
    console.log("Gemini key missing, using mock responses.");
  }
});

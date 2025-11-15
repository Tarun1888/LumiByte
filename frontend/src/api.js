
const API_BASE = "https://lumibyte-1.onrender.com/api";

export async function createSession(title) {
  const res = await fetch(`${API_BASE}/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title })
  });
  if (!res.ok) throw new Error("createSession failed");
  return res.json();
}

export async function fetchSessions() {
  const res = await fetch(`${API_BASE}/sessions`);
  if (!res.ok) throw new Error("fetchSessions failed");
  return res.json();
}

export async function fetchSession(id) {
  const res = await fetch(`${API_BASE}/sessions/${id}`);
  if (!res.ok) throw new Error("fetchSession failed");
  return res.json();
}

export async function sendQuestion(sessionId, question) {
  const res = await fetch(`${API_BASE}/sessions/${sessionId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question })
  });
  if (!res.ok) throw new Error("sendQuestion failed");
  return res.json();
}

export async function sendFeedback(sessionId, messageId, feedback) {
  const res = await fetch(
    `${API_BASE}/sessions/${sessionId}/messages/${messageId}/feedback`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedback })
    }
  );
  if (!res.ok) throw new Error("sendFeedback failed");
  return res.json();
}

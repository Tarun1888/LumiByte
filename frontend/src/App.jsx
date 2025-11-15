
import React, { useEffect, useState, useCallback } from "react";
import Layout from "./components/Layout.jsx";
import ChatWindow from "./components/ChatWindow.jsx";
import {
  createSession,
  fetchSessions,
  fetchSession,
  sendQuestion,
  sendFeedback
} from "./api.js";

function getSessionIdFromUrl() {
  const url = new URL(window.location.href);
  return url.searchParams.get("sessionId");
}

function setSessionIdInUrl(id) {
  const url = new URL(window.location.href);
  url.searchParams.set("sessionId", id);
  window.history.replaceState({}, "", url.toString());
}

function App() {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
    } else {
      const prefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  const loadSessions = useCallback(async () => {
    try {
      const list = await fetchSessions();
      setSessions(list);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const loadSessionById = useCallback(async id => {
    if (!id) return;
    setLoading(true);
    try {
      const session = await fetchSession(id);
      setCurrentSession(session);
      setSessionIdInUrl(id);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  useEffect(() => {
    const id = getSessionIdFromUrl();
    if (id) {
      loadSessionById(id);
    }
  }, [loadSessionById]);

  const handleNewChat = async () => {
    try {
      const session = await createSession();
      await loadSessions();
      await loadSessionById(session.id);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectSession = async id => {
    await loadSessionById(id);
  };

  const handleSendQuestion = async question => {
    if (!currentSession) {
      await handleNewChat();
    }
    const sessionId = currentSession ? currentSession.id : getSessionIdFromUrl();
    if (!sessionId) return;
    setLoading(true);
    try {
      await sendQuestion(sessionId, question);
      const updated = await fetchSession(sessionId);
      setCurrentSession(updated);
      await loadSessions();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (messageId, feedback) => {
    if (!currentSession) return;
    try {
      await sendFeedback(currentSession.id, messageId, feedback);
      const updated = await fetchSession(currentSession.id);
      setCurrentSession(updated);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Layout
      sessions={sessions}
      onNewChat={handleNewChat}
      onSelectSession={handleSelectSession}
      currentSessionId={currentSession && currentSession.id}
      theme={theme}
      onToggleTheme={toggleTheme}
    >
      <ChatWindow
        session={currentSession}
        onSendQuestion={handleSendQuestion}
        onFeedback={handleFeedback}
        loading={loading}
      />
    </Layout>
  );
}

export default App;

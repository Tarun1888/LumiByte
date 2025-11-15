
import React from "react";

function ChatHeader({ onToggleSidebar, theme, onToggleTheme }) {
  return (
    <header className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-950/80 backdrop-blur">
      <div className="flex items-center gap-2">
        <button
          className="md:hidden p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={onToggleSidebar}
        >
          <span className="text-xl">☰</span>
        </button>
        <div className="font-semibold text-sm md:text-base">
          Chat Application
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleTheme}
          className="text-xs px-2 py-1 border rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
    </header>
  );
}

export default ChatHeader;

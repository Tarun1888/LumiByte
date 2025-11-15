
import React from "react";

function Sidebar({ sessions, onNewChat, onSelectSession, currentSessionId }) {
  return (
    <div className="flex flex-col h-full p-3 gap-3">
      <button
        onClick={onNewChat}
        className="w-full rounded-lg border border-dashed border-slate-400 dark:border-slate-600 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition"
      >
        + New Chat
      </button>
      <div className="flex-1 overflow-auto">
        <h2 className="text-xs font-semibold text-slate-500 uppercase mb-2">
          Sessions
        </h2>
        {sessions.length === 0 && (
          <div className="text-xs text-slate-500">No sessions yet.</div>
        )}
        <ul className="space-y-1 text-sm">
          {sessions.map(s => (
            <li key={s.id}>
              <button
                onClick={() => onSelectSession(s.id)}
                className={`w-full text-left px-2 py-1 rounded-md truncate ${
                  currentSessionId === s.id
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <div className="font-medium truncate">{s.title}</div>
                <div className="text-[10px] text-slate-500">
                  {s.messageCount || 0} messages
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-slate-200 dark:border-slate-700 pt-2 text-xs text-slate-500">
        <div className="font-semibold text-slate-700 dark:text-slate-200">
          Demo User
        </div>
        <div>ID: demo-user-001</div>
      </div>
    </div>
  );
}

export default Sidebar;


import React, { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import ChatHeader from "./ChatHeader.jsx";

function Layout({
  sessions,
  onNewChat,
  onSelectSession,
  currentSessionId,
  theme,
  onToggleTheme,
  children
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } transition-all duration-200 overflow-hidden border-r border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-950`}
      >
        <Sidebar
          sessions={sessions}
          onNewChat={onNewChat}
          onSelectSession={onSelectSession}
          currentSessionId={currentSessionId}
        />
      </div>
      <div className="flex-1 flex flex-col">
        <ChatHeader
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
          theme={theme}
          onToggleTheme={onToggleTheme}
        />
        <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
      </div>
    </div>
  );
}

export default Layout;

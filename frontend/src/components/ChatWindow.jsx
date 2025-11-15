
import React from "react";
import MessageBubble from "./MessageBubble.jsx";
import QuestionInput from "./QuestionInput.jsx";

function ChatWindow({ session, onSendQuestion, onFeedback, loading }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {!session && (
          <div className="h-full flex flex-col items-center justify-center text-center gap-2">
            <h1 className="text-xl font-semibold">Start a new chat</h1>
            <p className="text-sm text-slate-500 max-w-md">
              Type your question below to create a session and see responses in
              a table format.
            </p>
          </div>
        )}
        {session &&
          session.messages.map(msg => (
            <MessageBubble
              key={msg.id}
              message={msg}
              onFeedback={onFeedback}
            />
          ))}
        {loading && (
          <div className="text-xs text-slate-500">Loading response...</div>
        )}
      </div>
      <div className="border-t border-gray-200 dark:border-slate-700 p-3">
        <QuestionInput disabled={loading} onSend={onSendQuestion} />
      </div>
    </div>
  );
}

export default ChatWindow;

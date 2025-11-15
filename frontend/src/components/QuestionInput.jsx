
import React, { useState } from "react";

function QuestionInput({ onSend, disabled }) {
  const [value, setValue] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (!value.trim()) return;
    onSend(value.trim());
    setValue("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 rounded-xl px-3 py-2"
    >
      <textarea
        rows={1}
        className="flex-1 bg-transparent outline-none text-sm resize-none max-h-32"
        placeholder="Ask a question..."
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="text-xs px-3 py-1 rounded-lg bg-slate-900 text-white disabled:opacity-40 disabled:cursor-not-allowed dark:bg-slate-100 dark:text-slate-900"
      >
        Send
      </button>
    </form>
  );
}

export default QuestionInput;

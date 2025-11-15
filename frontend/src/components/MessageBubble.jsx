
import React from "react";

function MessageBubble({ message, onFeedback }) {
  const question = message.question;
  const answer = message.answer;

  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <div className="max-w-xl rounded-2xl px-3 py-2 bg-slate-900 text-white text-sm">
          {question}
        </div>
      </div>
      <div className="flex justify-start">
        <div className="max-w-3xl w-full md:w-auto rounded-2xl px-3 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm space-y-3 shadow-sm">
          <p className="text-slate-800 dark:text-slate-100">
            {answer.description}
          </p>
          {answer.table && Array.isArray(answer.table.headers) && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 dark:bg-slate-800">
                  <tr>
                    {answer.table.headers.map(h => (
                      <th
                        key={h}
                        className="px-2 py-1 text-left font-semibold border-b border-slate-200 dark:border-slate-700"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(answer.table.rows) &&
                    answer.table.rows.map((row, idx) => (
                      <tr
                        key={idx}
                        className="odd:bg-white even:bg-slate-50 dark:odd:bg-slate-900 dark:even:bg-slate-950"
                      >
                        {row.map((cell, cidx) => (
                          <td
                            key={cidx}
                            className="px-2 py-1 border-b border-slate-200 dark:border-slate-800"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Was this helpful?</span>
            <button
              onClick={() => onFeedback(message.id, "like")}
              className={`px-2 py-1 rounded-md border text-xs flex items-center gap-1 ${
                answer.feedback === "like"
                  ? "bg-emerald-100 border-emerald-500 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
                  : "border-slate-300 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
              }`}
            >
              👍 <span>Like</span>
            </button>
            <button
              onClick={() => onFeedback(message.id, "dislike")}
              className={`px-2 py-1 rounded-md border text-xs flex items-center gap-1 ${
                answer.feedback === "dislike"
                  ? "bg-rose-100 border-rose-500 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200"
                  : "border-slate-300 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
              }`}
            >
              👎 <span>Dislike</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;

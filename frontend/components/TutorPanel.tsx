"use client";

type Props = {
  chat: any[];
  message: string;
  typing: boolean;
  setMessage: (msg: string) => void;
  sendMessage: () => void;
};

export default function TutorPanel({
  chat,
  message,
  typing,
  setMessage,
  sendMessage
}: Props) {

  return (

    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl shadow-sm flex flex-col h-[420px]">

      {/* HEADER */}

      <div className="flex items-center gap-3 p-4 border-b border-indigo-200">

        <img
          src="https://api.dicebear.com/7.x/bottts/svg?seed=tutor"
          className="w-9 h-9"
        />

        <div>

          <p className="font-bold text-black">
            AI Tutor
          </p>

          <p className="text-xs text-black">
            Ask questions about your study session
          </p>

        </div>

      </div>


      {/* CHAT AREA */}

      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {chat.map((msg, i) => (

          <div
            key={i}
            className={`flex ${msg.role === "user"
              ? "justify-end"
              : "justify-start"
            }`}
          >

            <div
              className={`px-4 py-2 rounded-xl max-w-[75%] text-black shadow-sm
              ${msg.role === "user"
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                : "bg-white border"
              }`}
            >

              {msg.role === "assistant" && (
                <span className="mr-1">🤖</span>
              )}

              {msg.content}

            </div>

          </div>

        ))}


        {typing && (

          <div className="text-sm text-black">
            🤖 AI is thinking...
          </div>

        )}

      </div>


      {/* INPUT */}

      <div className="border-t border-indigo-200 p-3 flex gap-2">

        <input
          className="flex-1 border rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Ask the tutor..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow"
        >
          Send
        </button>

      </div>


      {/* QUICK ACTIONS */}

      <div className="p-3 flex flex-wrap gap-2 border-t border-indigo-200">

        <QuickButton label="Hint" onClick={() => setMessage("give me a hint")} />

        <QuickButton label="Simple" onClick={() => setMessage("explain in simple terms")} />

        <QuickButton label="Example" onClick={() => setMessage("give real world example")} />

        <QuickButton label="Steps" onClick={() => setMessage("break it step by step")} />

        <QuickButton label="Quiz Me" onClick={() => setMessage("ask me questions")} />

      </div>

    </div>

  );

}


/* QUICK BUTTON */

function QuickButton({
  label,
  onClick
}: {
  label: string;
  onClick: () => void;
}) {

  return (

    <button
      onClick={onClick}
      className="px-3 py-1 rounded-lg border bg-white text-black hover:bg-indigo-50 text-sm"
    >
      {label}
    </button>

  );

}
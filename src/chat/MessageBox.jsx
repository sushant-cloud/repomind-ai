import React from "react";

export default function MessageBox({ message, isSelf }) {
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex gap-3 max-w-[85%] ${isSelf ? "self-end flex-row-reverse" : "self-start"}`}>
      {/* Avatar column */}
      <img
        src={message.avatar}
        className="w-8 h-8 rounded-full border border-zinc-700/60 object-cover mt-0.5 shrink-0"
        alt={message.name}
        referrerPolicy="no-referrer"
      />

      {/* Message bubble */}
      <div className="flex flex-col space-y-1">
        {/* Author metadata */}
        <div className={`flex items-baseline gap-2 text-[10px] font-mono ${isSelf ? "justify-end text-indigo-400" : "text-zinc-400"}`}>
          <span className="font-bold">{message.name}</span>
          <span className="text-zinc-500">({message.username})</span>
          <span className="text-zinc-500 text-[9px]">{formattedTime}</span>
        </div>

        {/* Bubble contents */}
        <div
          className={`px-3.5 py-2 rounded-xl text-xs font-sans leading-relaxed break-all ${
            isSelf
              ? "bg-indigo-600 text-white rounded-tr-none font-normal"
              : "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none"
          }`}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
}

"use client";

import type { SupportType } from "./mockData";

interface SpeechBubbleProps {
  text: SupportType;
}

export default function SpeechBubble({ text }: SpeechBubbleProps) {
  return (
    <div className="border-gray-80 relative flex items-center rounded-[4px] border bg-black py-[2px] pr-2 pl-2">
      <div className="border-gray-80 absolute top-1/2 -left-[4.5px] h-2 w-2 -translate-y-1/2 rotate-45 border-b border-l bg-black" />

      <span
        className="text-gray-40 z-10 font-medium"
        style={{
          fontFamily: "Pretendard",
          fontSize: "13px",
          lineHeight: "180%",
          letterSpacing: "-0.26px",
        }}
      >
        {text}
      </span>
    </div>
  );
}

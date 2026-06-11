"use client";

import type { SupportType } from "./mockData";

interface SpeechBubbleProps {
  text: SupportType;
}

export default function SpeechBubble({ text }: SpeechBubbleProps) {
  return (
    <div className="border-gray-80 relative flex h-6 items-center rounded-[4px] border bg-black pr-2.5 pl-4">
      <div className="border-gray-80 absolute top-1/2 -left-[4px] h-[7px] w-[7px] -translate-y-1/2 rotate-45 border-b border-l bg-black" />

      <span
        className="text-gray-40 z-10 font-medium"
        style={{
          fontSize: "13px",
          lineHeight: "150%",
          letterSpacing: "-0.26px",
        }}
      >
        {text}
      </span>
    </div>
  );
}

"use client";

import type { SupportType } from "./mockData";

interface SpeechBubbleProps {
  text: SupportType;
}

export default function SpeechBubble({ text }: SpeechBubbleProps) {
  return (
    <div className="border-gray-80 relative flex items-center rounded-[4px] border bg-black px-2 py-[2px]">
      <div className="border-gray-80 absolute top-1/2 -left-[4.5px] h-2 w-2 -translate-y-1/2 rotate-45 border-b border-l bg-black" />

      <span className="text-gray-40 text-detail-13m z-10">{text}</span>
    </div>
  );
}

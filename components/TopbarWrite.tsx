"use client";

import { useWriteStore } from "@/store/useWriteStore";

interface TopbarWriteProps {
  onLeftClick?: () => void;
  onRightClick?: () => void;
}

export default function TopbarWrite({ onLeftClick, onRightClick }: TopbarWriteProps) {
  const { content, selectedOption } = useWriteStore();

  const isCompleteActive = content.trim().length > 0 && selectedOption !== null && selectedOption !== "";

  return (
    <header className="flex h-[68px] w-[375px] shrink-0 items-center justify-between bg-black px-4">
      <button type="button" aria-label="닫기" className="cursor-pointer text-white" onClick={onLeftClick}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M18 6L6 18M6 6L18 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <h1 className="text-head-18b leading-[150%] tracking-[-0.36px] text-white">글 쓰기</h1>

      <button
        type="button"
        onClick={onRightClick}
        className={`cursor-pointer text-right leading-[150%] tracking-[-0.32px] transition-colors duration-200 ${
          isCompleteActive ? "text-blue-30 text-body-16b" : "text-body-16m text-gray-50"
        }`}
      >
        완료
      </button>
    </header>
  );
}

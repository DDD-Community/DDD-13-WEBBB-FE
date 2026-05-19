"use client";

import { useWriteStore } from "@/store/useWriteStore";

export default function TopbarWrite() {
  const { selectedOption } = useWriteStore();
  const isCompleteActive = selectedOption !== null;

  return (
    <header className="flex h-[68px] w-[375px] shrink-0 items-center justify-between bg-black px-4">
      {/* 닫기 버튼 */}
      <button type="button" aria-label="닫기" className="text-white">
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

      {/* 타이틀 */}
      <h1 className="text-head-18b leading-[150%] tracking-[-0.36px] text-white">글 쓰기</h1>

      {/* 완료 버튼 */}
      <button
        type="button"
        className={`text-right leading-[150%] tracking-[-0.32px] transition-colors duration-200 ${
          isCompleteActive ? "text-blue-30 text-body-16b" : "text-body-16m text-gray-50"
        }`}
      >
        완료
      </button>
    </header>
  );
}

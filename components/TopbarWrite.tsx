"use client";

import { useWriteStore } from "@/store/useWriteStore";
import Topbar from "@/components/Topbar";

interface TopbarWriteProps {
  onLeftClick?: () => void;
  onRightClick?: () => void;
}

export default function TopbarWrite({ onLeftClick, onRightClick }: TopbarWriteProps) {
  const { content, selectedOption } = useWriteStore();

  const isCompleteActive = content.trim().length > 0 && selectedOption !== "";

  const LeftButton = (
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
  );

  const RightButton = (
    <button
      type="button"
      onClick={onRightClick}
      className={`cursor-pointer text-right leading-[150%] tracking-[-0.32px] transition-colors duration-200 ${
        isCompleteActive ? "text-blue-30 text-body-16b" : "text-body-16m text-gray-50"
      }`}
    >
      완료
    </button>
  );

  return <Topbar title="글 쓰기" leftContent={LeftButton} rightContent={RightButton} />;
}

"use client";

import { useState } from "react";
import HeartDefault from "@/assets/icons/ic_heart_default.svg";
import HeartActive from "@/assets/icons/ic_heart_active.svg";

type LikeButtonProps = {
  initialLikeCount: number;
  initialIsLiked?: boolean;
};

export default function LikeButton({ initialLikeCount, initialIsLiked = false }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  const handleLikeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (isLiked) {
      setIsLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLikeClick}
      className="bg-gray-90 text-gray-30 flex items-center justify-center gap-0.5 rounded-[4px] px-2 py-1.25 text-[13px] leading-[150%] font-medium tracking-[-0.26px] transition-colors"
      style={{ fontFamily: "Pretendard" }}
    >
      {isLiked ? (
        <HeartActive className="text-red-20 h-4 w-4 flex-none" />
      ) : (
        <HeartDefault className="text-gray-30 h-4 w-4 flex-none" />
      )}

      <span>공감하기</span>
      <span>·</span>
      <span>{likeCount}</span>
    </button>
  );
}

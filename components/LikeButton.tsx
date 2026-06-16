"use client";

import { useState } from "react";
import Heart from "@/assets/icons/ic_heart.svg";

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
      className="bg-gray-90 text-gray-30 text-detail-13m flex items-center justify-center gap-0.5 rounded-[4px] px-2 py-1.25 transition-colors"
    >
      <Heart
        className={`h-4 w-4 flex-none transition-colors ${isLiked ? "text-red-20 fill-red-20" : "text-gray-30"}`}
      />

      <span>공감하기</span>
      <span>·</span>
      <span>{likeCount}</span>
    </button>
  );
}

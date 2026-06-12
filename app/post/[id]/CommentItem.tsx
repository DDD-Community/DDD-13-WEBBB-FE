"use client";

import { useState } from "react";
import type { Comment } from "./mockData";
import HeartDefault from "@/assets/icons/ic_heart_default.svg";
import HeartActive from "@/assets/icons/ic_heart_active.svg";

export default function CommentItem({ comment }: { comment: Comment }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likeCount);

  const handleLikeClick = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  };

  return (
    <li>
      <div className="flex items-center gap-2">
        <span className="text-detail-12sb text-white">{comment.author.nickname}</span>
        <div className="bg-gray-60 h-2.5 w-[1px]" />
        <div className="text-gray-60 flex items-center gap-0.5">
          <span className="text-detail-12m">{comment.author.job}</span>
          <span className="text-detail-12m">·</span>
          <span className="text-detail-12m">{comment.author.experience}</span>
        </div>
      </div>

      <p className="text-body-15m mt-1 whitespace-pre-wrap text-white">{comment.content}</p>

      <div className="mt-3 flex items-center">
        <span className="text-detail-12m text-gray-60">{comment.createdAt}</span>

        <button
          type="button"
          onClick={handleLikeClick}
          className="text-gray-60 ml-4 flex items-center gap-0.5 transition-colors"
        >
          {isLiked ? (
            <HeartActive className="text-red-20 h-4 w-4 flex-none" />
          ) : (
            <HeartDefault className="text-gray-60 h-4 w-4 flex-none" />
          )}
          <span className="text-detail-12m">{likeCount}</span>
        </button>
      </div>
    </li>
  );
}

"use client";

import { useState } from "react";
import type { Comment } from "./mockData";
import MoreIcon from "@/assets/icons/ic_more_sm_white.svg";
import DeleteIcon from "@/assets/icons/ic_delete.svg";
import Modal from "@/app/write/modal";
import Heart from "@/assets/icons/ic_heart.svg";

export default function CommentItem({ comment }: { comment: Comment }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likeCount);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isMine = comment.author.nickname === "이직귀찮";

  const handleLikeClick = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  };

  const handleDeleteMenuClick = () => {
    setIsMenuOpen(false);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setIsModalOpen(false);
  };

  return (
    <li className="relative">
      <div className="flex w-full items-start justify-between">
        <div className="flex w-full flex-col">
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
        </div>

        {isMine && (
          <div className="relative ml-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="flex h-6 w-6 items-center justify-center p-0.5"
            >
              <MoreIcon className="h-4 w-4 text-white" />
            </button>

            {isMenuOpen && (
              <button
                type="button"
                onClick={handleDeleteMenuClick}
                className="bg-gray-80 absolute right-0 bottom-[calc(100%+6px)] z-10 flex w-[169px] items-center justify-between rounded-[8px] px-4 py-3 text-left transition-all"
                style={{ boxShadow: "0 4px 15px 0 rgba(0, 0, 0, 0.35)" }}
              >
                <span
                  className="text-[15px] leading-[150%] font-medium tracking-[-0.3px] text-white"
                  style={{ fontFamily: "Pretendard" }}
                >
                  삭제
                </span>
                <DeleteIcon className="h-5 w-5 flex-none shrink-0" />
              </button>
            )}

            {isMenuOpen && (
              <div className="fixed inset-0 z-0 cursor-default bg-transparent" onClick={() => setIsMenuOpen(false)} />
            )}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center">
        <span className="text-detail-12m text-gray-60">{comment.createdAt}</span>
        <button
          type="button"
          onClick={handleLikeClick}
          className="text-gray-60 ml-4 flex items-center gap-0.5 transition-colors"
        >
          <Heart
            className={`h-4 w-4 flex-none transition-colors ${isLiked ? "text-red-20 fill-red-20" : "text-gray-60"}`}
          />

          {likeCount > 0 && <span className="text-detail-12m">{likeCount}</span>}
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="댓글을 삭제하시겠어요?"
        confirmText="확인"
        cancelText="취소"
        confirmVariant="blue"
      />
    </li>
  );
}

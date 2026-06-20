"use client";

import { useState } from "react";
import MoreIcon from "@/assets/icons/ic_more_sm_white.svg";
import DeleteIcon from "@/assets/icons/ic_delete.svg";
import Modal from "@/components/modal";
import Heart from "@/assets/icons/ic_heart.svg";

import useFloating from "@/hooks/useFloating";
import { FloatingPortal } from "@floating-ui/react";

import type { PostComment } from "@/api/endpoints/post";

interface CommentItemProps {
  comment: PostComment;
}

function getTimeAgo(dateString?: string) {
  if (!dateString) return null;
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "방금 전";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}시간 전`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}일 전`;
  return date.toLocaleDateString();
}

export default function CommentItem({ comment }: CommentItemProps) {
  const [isLiked, setIsLiked] = useState(false);

  const [likeCount, setLikeCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isMine = comment.authorNickname === "이직귀찮";

  const {
    isOpen: isMenuOpen,
    setIsOpen: setIsMenuOpen,
    setReference,
    setFloating,
    floatingStyles,
    getReferenceProps,
    getFloatingProps,
  } = useFloating({ placement: "bottom-end", gap: 6 });

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

  const displayTimeAgo = getTimeAgo(comment.createdAt) || "방금 전";

  return (
    <li className="relative">
      <div className="flex w-full items-start justify-between">
        <div className="flex w-full flex-col">
          <div className="flex items-center gap-2">
            <span className="text-detail-12sb text-white">{comment.authorNickname}</span>

            <div className="bg-gray-60 h-2.5 w-[1px]" />
            <div className="text-gray-60 flex items-center gap-0.5">
              <span className="text-detail-12m">개발</span>
              <span className="text-detail-12m">·</span>
              <span className="text-detail-12m">1년차</span>
            </div>
          </div>

          <p className="text-body-15m mt-1 whitespace-pre-wrap text-white">{comment.content}</p>
        </div>

        {isMine && (
          <div className="relative ml-2 shrink-0">
            <button
              type="button"
              ref={setReference}
              {...getReferenceProps()}
              className="flex h-6 w-6 items-center justify-center p-0.5"
            >
              <MoreIcon className="h-4 w-4 text-white" />
            </button>

            {isMenuOpen && (
              <FloatingPortal>
                <button
                  type="button"
                  ref={setFloating}
                  {...getFloatingProps()}
                  onClick={handleDeleteMenuClick}
                  className="bg-gray-80 z-50 flex w-[169px] items-center justify-between rounded-[8px] px-4 py-3 text-left transition-all"
                  style={{
                    ...floatingStyles,
                    boxShadow: "0 4px 15px 0 rgba(0, 0, 0, 0.35)",
                  }}
                >
                  <span className="text-body-15m text-white">삭제</span>
                  <DeleteIcon className="h-5 w-5 flex-none shrink-0" />
                </button>
              </FloatingPortal>
            )}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center">
        <span className="text-detail-12m text-gray-60">{displayTimeAgo}</span>
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

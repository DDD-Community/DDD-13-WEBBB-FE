"use client";

import { useState, type MouseEvent } from "react";
import Heart from "@/assets/icons/ic_heart.svg";
import { likePost, unlikePost, type PostLikeResponse } from "@/services/endpoints/post";
import { useAuthStore } from "@/store/useAuthStore";
import LoginRequiredModal from "./LoginRequiredModal";

type LikeButtonProps = {
  postId: number;
  initialLikeCount: number;
  initialIsLiked?: boolean;
  onSuccess?: (response: PostLikeResponse, isLiked: boolean) => void;
};

type LocalLikeState = {
  postId: number;
  isLiked: boolean;
  likeCount: number;
};

export default function LikeButton({ postId, initialLikeCount, initialIsLiked = false, onSuccess }: LikeButtonProps) {
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const [localLikeState, setLocalLikeState] = useState<LocalLikeState | null>(null);
  const [pendingPostId, setPendingPostId] = useState<number | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const activeLikeState = localLikeState?.postId === postId ? localLikeState : null;
  const isLiked = activeLikeState?.isLiked ?? initialIsLiked;
  const likeCount = activeLikeState?.likeCount ?? initialLikeCount;
  const isPending = pendingPostId === postId;
  const isLoggedIn = hasHydrated && Boolean(user);

  const handleLikeClick = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (isPending) return;

    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }

    const previousState = activeLikeState;
    const nextIsLiked = !isLiked;

    setPendingPostId(postId);
    setLocalLikeState({
      postId,
      isLiked: nextIsLiked,
      likeCount: Math.max(0, likeCount + (nextIsLiked ? 1 : -1)),
    });

    try {
      const response = nextIsLiked ? await likePost(postId) : await unlikePost(postId);

      setLocalLikeState({
        postId,
        isLiked: nextIsLiked,
        likeCount: response.likeCount,
      });
      onSuccess?.(response, nextIsLiked);
    } catch (error) {
      setLocalLikeState(previousState);
      // eslint-disable-next-line no-console
      console.error("게시글 좋아요 처리 실패:", error);
    } finally {
      setPendingPostId(null);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleLikeClick}
        disabled={isPending}
        className="bg-gray-90 text-gray-30 text-detail-13m flex items-center justify-center gap-0.5 rounded-[4px] px-2 py-1.25 transition-colors"
      >
        <Heart
          className={`h-4 w-4 flex-none transition-colors ${isLiked ? "text-red-20 fill-red-20" : "text-gray-30"}`}
        />

        <span>공감하기</span>
        <span>·</span>
        <span>{likeCount}</span>
      </button>

      <LoginRequiredModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}

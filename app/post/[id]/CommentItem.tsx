"use client";

import { useState, type MouseEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import MoreIcon from "@/assets/icons/ic_more_sm_white.svg";
import DeleteIcon from "@/assets/icons/ic_delete.svg";
import Modal from "@/components/modal";
import Heart from "@/assets/icons/ic_heart.svg";

import useFloating from "@/hooks/useFloating";
import { FloatingPortal } from "@floating-ui/react";
import { getTimeAgo } from "@/lib/date";

import type { PostComment, PostDetail } from "@/services/endpoints/post";
import { likeComment, unlikeComment, type CommentLikeResponse } from "@/services/endpoints/comment";
import { CAREER_YEAR, JOB_ROLE } from "@/const/map";
import { useAuthStore } from "@/store/useAuthStore";
import { postKeys } from "@/services/query-keys";

type CommentLikeUpdate = {
  commentId: number;
  isLiked: boolean;
  likeCount: number;
  monster?: CommentLikeResponse["monster"];
};

interface CommentItemProps {
  postId: number;
  comment: PostComment;
  onLikeSuccess?: (update: CommentLikeUpdate) => void;
}

type CommentLikeMutationVariables = {
  nextIsLiked: boolean;
  nextLikeCount: number;
};

type CommentLikeMutationContext = {
  previousPost: PostDetail | undefined;
};

export default function CommentItem({ postId, comment, onLikeSuccess }: CommentItemProps) {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const detailQueryKey = postKeys.detail(postId);
  const isLiked = comment.likedByMe;
  const likeCount = comment.likeCount;
  const isLoggedIn = hasHydrated && Boolean(user);
  const isMine = hasHydrated && user ? comment.authorId === user.id : false;
  const authorMeta = [
    ...(comment.jobRole ? [JOB_ROLE[comment.jobRole]] : []),
    ...(comment.careerYear ? [CAREER_YEAR[comment.careerYear]] : []),
  ];

  const {
    isOpen: isMenuOpen,
    setIsOpen: setIsMenuOpen,
    setReference,
    setFloating,
    floatingStyles,
    getReferenceProps,
    getFloatingProps,
  } = useFloating({ placement: "bottom-end", gap: 6 });

  const updateCommentLikeCache = (update: CommentLikeUpdate) => {
    queryClient.setQueryData<PostDetail>(detailQueryKey, (current) => {
      if (!current) return current;

      return {
        ...current,
        monster: update.monster
          ? {
              ...current.monster,
              hp: update.monster.hp,
              maxHp: update.monster.maxHp,
              status: update.monster.status,
            }
          : current.monster,
        comments: current.comments?.map((currentComment) =>
          currentComment.commentId === update.commentId
            ? {
                ...currentComment,
                likeCount: update.likeCount,
                likedByMe: update.isLiked,
              }
            : currentComment
        ),
      };
    });
  };

  const commentLikeMutation = useMutation<
    CommentLikeUpdate,
    unknown,
    CommentLikeMutationVariables,
    CommentLikeMutationContext
  >({
    mutationFn: async ({ nextIsLiked, nextLikeCount }) => {
      if (nextIsLiked) {
        const response = await likeComment(postId, comment.commentId);

        return {
          commentId: response.commentId,
          isLiked: true,
          likeCount: response.likeCount,
          monster: response.monster,
        };
      }

      await unlikeComment(postId, comment.commentId);

      return {
        commentId: comment.commentId,
        isLiked: false,
        likeCount: nextLikeCount,
      };
    },
    onMutate: async ({ nextIsLiked, nextLikeCount }) => {
      await queryClient.cancelQueries({ queryKey: detailQueryKey });
      const previousPost = queryClient.getQueryData<PostDetail>(detailQueryKey);

      updateCommentLikeCache({
        commentId: comment.commentId,
        isLiked: nextIsLiked,
        likeCount: nextLikeCount,
      });

      return { previousPost };
    },
    onSuccess: (update) => {
      updateCommentLikeCache(update);
      onLikeSuccess?.(update);
    },
    onError: (error, _variables, context) => {
      queryClient.setQueryData(detailQueryKey, context?.previousPost);
      // eslint-disable-next-line no-console
      console.error("댓글 좋아요 처리 실패:", error);
    },
  });
  const isPending = commentLikeMutation.isPending;

  const handleLikeClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (isPending) return;

    if (!isLoggedIn) return;

    const nextIsLiked = !isLiked;
    const nextLikeCount = Math.max(0, likeCount + (nextIsLiked ? 1 : -1));

    commentLikeMutation.mutate({ nextIsLiked, nextLikeCount });
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

            {authorMeta.length > 0 && (
              <>
                <div className="bg-gray-60 h-2.5 w-[1px]" />
                <div className="text-gray-60 flex items-center gap-0.5">
                  <span className="text-detail-12m">{authorMeta.join(" · ")}</span>
                </div>
              </>
            )}
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
          disabled={isPending || !isLoggedIn}
          aria-label={isLiked ? "댓글 좋아요 취소" : "댓글 좋아요"}
          className="text-gray-60 ml-4 flex items-center gap-0.5 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
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

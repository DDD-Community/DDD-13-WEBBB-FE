"use client";

import { useEffect, useRef, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ArrowLeft from "@/assets/icons/ic_arrow_left_lg.svg";
import ImgPostNoComment from "@/assets/icons/img_post_no_comment.svg";
import MoreIcon from "@/assets/icons/ic_more_lg.svg";
import DeleteIcon from "@/assets/icons/ic_delete.svg";
import Modal from "@/components/modal";

import CharacterCard from "@/components/CharacterCard";
import LikeButton from "@/components/LikeButton";
import SpeechBubble from "./SpeechBubble";
import CommentItem from "./CommentItem";
import CommentInput from "./CommentInput";
import TopBar from "@/components/TopBar";

import useFloating from "@/hooks/useFloating";
import { FloatingPortal } from "@floating-ui/react";

import { useAuthStore } from "@/store/useAuthStore";

import { getPostDetail, deletePost, type PostDetail, type PostLikeResponse } from "@/services/endpoints/post";
import { createComment } from "@/services/endpoints/comment";
import { myPageKeys, postKeys } from "@/services/query-keys";
import { type EmotionType } from "@/services/types";
import { CAREER_YEAR, COMMENT_TONE, JOB_ROLE } from "@/const/map";

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const postId = Number(id);

  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAttacking, setIsAttacking] = useState(false);
  const attackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { user, _hasHydrated } = useAuthStore();

  const {
    isOpen: isMenuOpen,
    setIsOpen: setIsMenuOpen,
    setReference,
    setFloating,
    floatingStyles,
    getReferenceProps,
    getFloatingProps,
  } = useFloating({ placement: "bottom-end", gap: 6 });

  const {
    data: post,
    isPending,
    isError,
  } = useQuery({
    queryKey: postKeys.detail(postId),
    queryFn: () => getPostDetail(postId),
    enabled: !Number.isNaN(postId),
  });

  const { mutateAsync: submitComment, isPending: isSubmitting } = useMutation({
    mutationFn: (content: string) => createComment(postId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
      triggerAttack();
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error("댓글 등록 실패:", error);
      alert("댓글 등록 중 오류가 발생했습니다.");
    },
  });

  const { mutate: removePost } = useMutation({
    mutationFn: () => deletePost(postId),
    onSuccess: () => {
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      router.replace("/home");
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error("게시글 삭제 실패:", error);
      alert("게시글 삭제 중 오류가 발생했습니다.");
    },
  });

  const triggerAttack = () => {
    if (attackTimerRef.current) clearTimeout(attackTimerRef.current);
    setIsAttacking(true);
    attackTimerRef.current = setTimeout(() => setIsAttacking(false), 3000);
  };

  useEffect(() => {
    return () => {
      if (attackTimerRef.current) clearTimeout(attackTimerRef.current);
    };
  }, []);

  if (!Number.isNaN(postId) && isPending) {
    return (
      <div className="text-gray-40 text-body-14m flex min-h-screen items-center justify-center bg-black">
        고민 글을 불러오는 중입니다...
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="text-gray-40 text-body-14m flex min-h-screen flex-col items-center justify-center gap-4 bg-black">
        존재하지 않거나 삭제된 게시글입니다.
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-80 text-body-14m rounded-sm px-4 py-2 text-white"
        >
          돌아가기
        </button>
      </div>
    );
  }

  const isLoggedIn = _hasHydrated && Boolean(user);
  const isMyPost = _hasHydrated && user ? post.author.nickname === user.nickname : false;

  const comments = post.comments || [];
  const cardType = post.emotion.type as EmotionType;
  const displayJob = post.author.jobRole ? JOB_ROLE[post.author.jobRole] || "기타" : "개발";
  const displayCareer = post.author.careerYear ? CAREER_YEAR[post.author.careerYear] || "기타" : "1년차";
  const supportText = COMMENT_TONE[post.commentTone] || "무조건 위로해주기";

  const handleDeleteMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    setIsModalOpen(true);
  };

  const handleLikeSuccess = (response: PostLikeResponse, nextIsLiked: boolean) => {
    queryClient.setQueryData<PostDetail>(postKeys.detail(postId), (current) => {
      if (!current) return current;

      return {
        ...current,
        likeCount: response.likeCount,
        likedByMe: nextIsLiked,
        monster: {
          ...current.monster,
          hp: response.monster.hp,
          maxHp: response.monster.maxHp,
          status: response.monster.status,
        },
      };
    });
    void queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    void queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
    void queryClient.invalidateQueries({ queryKey: myPageKeys.likedPosts() });

    if (nextIsLiked) triggerAttack();
  };

  return (
    <div className="min-h-screen bg-black pb-[120px]">
      <TopBar
        className="border-gray-90 sticky top-0 z-50 h-[68px] border-b bg-black px-4 py-[22px]"
        leftContent={
          <button type="button" aria-label="뒤로가기" onClick={() => router.back()} className="flex items-center">
            <ArrowLeft className="text-gray-30 h-6 w-6" />
          </button>
        }
        rightContent={
          isMyPost && (
            <div className="relative z-50 flex items-center">
              <button
                type="button"
                ref={setReference}
                {...getReferenceProps()}
                aria-label="더보기"
                className="flex h-6 w-6 items-center justify-center outline-none"
              >
                <MoreIcon className="h-6 w-6 text-white" />
              </button>

              {isMenuOpen && (
                <FloatingPortal>
                  <div
                    ref={setFloating}
                    style={{
                      ...floatingStyles,
                      zIndex: 9999,
                    }}
                    {...getFloatingProps()}
                  >
                    <button
                      type="button"
                      onClick={handleDeleteMenuClick}
                      className="bg-gray-80 flex w-[169px] items-center justify-between rounded-[8px] px-4 py-3 text-left transition-all outline-none"
                      style={{
                        boxShadow: "0 4px 15px 0 rgba(0, 0, 0, 0.35)",
                      }}
                    >
                      <span className="text-body-15m text-white select-none">삭제</span>
                      <DeleteIcon className="h-5 w-5 flex-none shrink-0 text-white" />
                    </button>
                  </div>
                </FloatingPortal>
              )}
            </div>
          )
        }
      />

      <main>
        <div className="mt-5 ml-4 flex items-center">
          <span className="text-detail-13sb text-gray-30">{post.author.nickname || "닉네임"}</span>
          <div className="bg-gray-60 mx-2 h-2.5 w-[1px]" />
          <span className="text-detail-13m text-gray-60">{displayJob}</span>
          <span className="text-detail-13m text-gray-60 mx-0.5">·</span>
          <span className="text-detail-13m text-gray-60">{displayCareer}</span>
        </div>

        <div className="mt-3 px-4">
          <p className="text-body-16sb whitespace-pre-wrap text-white">{post.content}</p>
        </div>

        <div className="mt-6 px-4">
          <CharacterCard
            profile={false}
            type={cardType}
            hp={post.monster.hp}
            maxHp={post.monster.maxHp}
            isAttacking={isAttacking}
          />
        </div>

        <div className="mt-5 px-4">
          <LikeButton
            postId={postId}
            initialLikeCount={post.likeCount}
            initialIsLiked={post.likedByMe}
            onSuccess={handleLikeSuccess}
          />
        </div>

        <div className="bg-gray-90 mt-5 h-[1px] w-full" />

        <div className="mt-5 flex items-center gap-3 px-4">
          <div className="flex items-center gap-0.5">
            <span className="text-detail-13sb text-white">댓글</span>
            <span className="text-detail-13sb text-white">{post.commentCount}</span>
          </div>
          <SpeechBubble text={supportText} />
        </div>

        {comments.length === 0 ? (
          <div className="mt-[60px] flex flex-col items-center justify-center">
            <ImgPostNoComment className="h-[98px] w-[58px] object-contain" />
            <p className="text-gray-70 text-body-14m mt-3 text-center whitespace-pre-line">
              아직 작성된 댓글이 없어요.{"\n"}댓글을 써 몬스터를 처치해주세요!
            </p>
          </div>
        ) : (
          <ul className="mt-[18px] flex list-none flex-col gap-6 px-4">
            {comments.map((comment) => (
              <CommentItem key={comment.commentId} comment={comment} />
            ))}
          </ul>
        )}
      </main>

      <CommentInput
        placeholderType={supportText}
        onSubmit={async (content) => {
          await submitComment(content);
        }}
        isSubmitting={isSubmitting}
        disabled={!isLoggedIn}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => removePost()}
        title="게시글을 삭제하시겠어요?"
        confirmText="확인"
        cancelText="취소"
        confirmVariant="red"
      />
    </div>
  );
}

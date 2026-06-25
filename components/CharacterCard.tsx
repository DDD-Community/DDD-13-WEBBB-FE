"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import { cva } from "class-variance-authority";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import Heart from "@/assets/icons/ic_heart.svg";
import Comment from "@/assets/icons/ic_comment.svg";
import type { CareerYear, CommentTone, EmotionType, JobRole } from "@/services/types";
import { likePost, unlikePost } from "@/services/endpoints/post";
import { myPageKeys, postKeys } from "@/services/query-keys";
import CharacterChip from "./CharacterChip";
import { CAREER_YEAR, CHARACTER_LABEL, COMMENT_TONE, JOB_ROLE } from "@/const/map";
import { getTimeAgo } from "@/lib/date";

export type CharacterCardProps = {
  profile?: boolean;
  isAttacking?: boolean;
  type: EmotionType;
  postId?: number;
  authorNickname?: string | null;
  jobRole?: JobRole | null;
  careerYear?: CareerYear | null;
  createdAt?: string;
  contentPreview?: string;
  hp?: number;
  maxHp?: number;
  likeCount?: number;
  likedByMe?: boolean;
  commentCount?: number;
  commentTone?: CommentTone;
};

const characterCardStyle: (props: { character: EmotionType }) => string = cva(
  "flex flex-col items-center rounded-xl bg-[#1C1C1E] bg-linear-to-b from-transparent from-70% to-100% p-4",
  {
    variants: {
      character: {
        LETHARGY: "to-purple-10",
        ANXIETY: "to-orange-10",
        LONELINESS: "to-blue-10",
        SELF_DEPRECATION: "to-green-10",
        IRRITATION: "to-red-10",
      },
    },
  }
);

const characterBarStyle: (props: { character: EmotionType }) => string = cva(
  "h-full rounded-full bg-linear-to-r transition-all",
  {
    variants: {
      character: {
        LETHARGY: "from-purple-30 to-purple-20",
        ANXIETY: "from-orange-30 to-orange-20",
        LONELINESS: "from-blue-30 to-blue-20",
        SELF_DEPRECATION: "from-green-30 to-green-20",
        IRRITATION: "from-red-30 to-red-20",
      },
    },
  }
);

type LocalLikeState = {
  postId: number;
  isLiked: boolean;
  likeCount: number;
  hp: number;
  maxHp: number;
};

export default function CharacterCard({
  profile = true,
  isAttacking = false,
  type,
  postId,
  authorNickname,
  jobRole,
  careerYear,
  createdAt,
  contentPreview,
  hp,
  maxHp,
  likeCount,
  likedByMe = false,
  commentCount,
  commentTone,
}: CharacterCardProps) {
  const queryClient = useQueryClient();
  const likeAttackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [characterSizeKey] = useState<"lg" | "sm">(() => ((maxHp ?? 30) === 30 ? "lg" : "sm"));
  const [localLikeState, setLocalLikeState] = useState<LocalLikeState | null>(null);
  const [pendingPostId, setPendingPostId] = useState<number | null>(null);
  const [isLikeAttacking, setIsLikeAttacking] = useState(false);

  const linkHref = postId ? `/post/${postId}` : undefined;
  const displayNickname = authorNickname || "닉네임";
  const displayJob = jobRole ? JOB_ROLE[jobRole] || "기타" : "개발";
  const displayCareer = careerYear ? CAREER_YEAR[careerYear] || "기타" : "1년차";
  const displayTimeAgo = getTimeAgo(createdAt) || "1시간 전";
  const displayContent =
    contentPreview ||
    "이직 준비 시작하기 진짜 힘들다... 주말에 아무것도 안하고 누워있기만 함 ㅠㅠ 내 자신이 한심해. 어떻게 해야할까? 이직 준비 시작하기 진짜 힘들다... 주말에 아무것도 안하고 누워있기만 함 ㅠㅠ 내 자신이 한심해. 어떻게 해야할까? 이직 준비 시작하기 진짜 힘들다... 주말에 아무것도 안하고 누워있기만 함 ㅠㅠ 내 자신이 한심해. 어떻게 해야할까?";
  const activeLikeState = localLikeState?.postId === postId ? localLikeState : null;
  const isLiked = activeLikeState?.isLiked ?? likedByMe;
  const currentLikeCount = activeLikeState?.likeCount ?? likeCount ?? 4;
  const currentHp = activeLikeState?.hp ?? hp ?? 20;
  const maximumHp = activeLikeState?.maxHp ?? maxHp ?? 30;
  const isLikePending = pendingPostId === postId;

  const hpPercent = maximumHp > 0 ? (currentHp / maximumHp) * 100 : 0;

  const isDead = currentHp <= 0;
  const characterSrc = `/characters/${type.toLowerCase()}/${characterSizeKey}${isDead ? "_dead" : ""}.svg`;
  const characterLabel = CHARACTER_LABEL[type];
  const supportText = commentTone ? COMMENT_TONE[commentTone] : "무조건 위로해주기";

  const displayComments = commentCount ?? 4;

  const triggerLikeAttack = () => {
    if (likeAttackTimerRef.current) clearTimeout(likeAttackTimerRef.current);
    setIsLikeAttacking(true);
    likeAttackTimerRef.current = setTimeout(() => setIsLikeAttacking(false), 3000);
  };

  useEffect(() => {
    return () => {
      if (likeAttackTimerRef.current) clearTimeout(likeAttackTimerRef.current);
    };
  }, []);

  const handleLikeClick = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!postId || isLikePending) return;

    const previousIsLiked = isLiked;
    const previousLikeCount = currentLikeCount;
    const previousHp = currentHp;
    const previousMaxHp = maximumHp;
    const previousLocalState = activeLikeState;
    const nextIsLiked = !previousIsLiked;

    setPendingPostId(postId);
    setLocalLikeState({
      postId,
      isLiked: nextIsLiked,
      likeCount: Math.max(0, previousLikeCount + (nextIsLiked ? 1 : -1)),
      hp: previousHp,
      maxHp: previousMaxHp,
    });

    try {
      const response = nextIsLiked ? await likePost(postId) : await unlikePost(postId);

      setLocalLikeState({
        postId,
        isLiked: nextIsLiked,
        likeCount: response.likeCount,
        hp: response.monster.hp,
        maxHp: response.monster.maxHp,
      });
      void queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
      void queryClient.invalidateQueries({ queryKey: myPageKeys.likedPosts() });
      if (nextIsLiked) triggerLikeAttack();
    } catch (error) {
      setLocalLikeState(previousLocalState);
      // eslint-disable-next-line no-console
      console.error("게시글 좋아요 처리 실패:", error);
    } finally {
      setPendingPostId(null);
    }
  };

  const content = (
    <>
      {profile && (
        <>
          <div className="text-detail-12m text-gray-60 mb-3 flex w-full items-center justify-between">
            <div className="flex items-center gap-0.5">
              <p className="text-gray-30 after:bg-gray-60 flex items-center gap-2 after:mx-1.5 after:block after:h-2 after:w-px after:flex-none after:rounded-full after:content-['']">
                {displayNickname}
              </p>

              <p>{displayJob}</p>
              <p>·</p>
              <p>{displayCareer}</p>
            </div>

            <p>{displayTimeAgo}</p>
          </div>

          <p className="text-body-15sb mb-4 line-clamp-2 w-full text-white">{displayContent}</p>
        </>
      )}

      <div className="flex w-full items-end gap-5.5 px-4.5">
        <div className="relative flex-none">
          <Image
            src={characterSrc}
            alt={`${characterLabel} 캐릭터`}
            width={88}
            height={96}
            priority={false}
            className="flex-none"
          />

          {(isAttacking || isLikeAttacking) && !isDead && (
            <Image
              src="/characters/attack.svg"
              alt="공격 모션"
              width={60}
              height={60}
              priority={false}
              className="absolute top-0 -right-5"
            />
          )}
        </div>

        <div className="flex w-full flex-col gap-2.5">
          <CharacterChip type={type} />

          <div className="mb-1">
            <div className="text-detail-13m text-gray-60 mb-1.5 flex items-center justify-between">
              <p>HP</p>
              <p>
                {currentHp}/{maximumHp}
              </p>
            </div>

            <div className="bg-gray-80 h-2 w-full overflow-hidden rounded-full">
              <div className={characterBarStyle({ character: type })} style={{ width: `${hpPercent}%` }} />
            </div>
          </div>
        </div>
      </div>

      {profile && (
        <div className="mt-5 flex w-full gap-3">
          <button
            type="button"
            onClick={handleLikeClick}
            aria-disabled={!postId || isLikePending}
            className="text-detail-13m text-gray-30 flex items-center gap-0.5 rounded-sm bg-black/30 px-2 py-1.25"
          >
            <Heart className={`h-4 w-4 flex-none ${isLiked ? "fill-red-20 text-red-20" : "text-gray-30"}`} />
            <span>공감하기</span>
            <span>·</span>
            <span>{currentLikeCount}</span>
          </button>

          <button
            type="button"
            className="text-detail-13m text-gray-30 flex items-center gap-0.5 rounded-sm bg-black/30 px-2 py-1.25"
          >
            <Comment className="h-4 w-4 flex-none" />
            <span>{supportText}</span>
            <span>·</span>
            <span>{displayComments}</span>
          </button>
        </div>
      )}
    </>
  );

  return (
    <div className="list-none">
      {linkHref ? (
        <Link prefetch={false} href={linkHref} className={characterCardStyle({ character: type })}>
          {content}
        </Link>
      ) : (
        <div className={characterCardStyle({ character: type })}>{content}</div>
      )}
    </div>
  );
}

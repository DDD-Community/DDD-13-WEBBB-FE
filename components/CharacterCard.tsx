"use client";

import Image from "next/image";
import { cva } from "class-variance-authority";
import Link from "next/link";
import Heart from "@/assets/icons/ic_heart.svg";
import Comment from "@/assets/icons/ic_comment.svg";

type CharacterType = "helpless" | "anxious" | "lonely" | "selfHate" | "annoyed";

export type CharacterCardProps = {
  profile?: boolean;
  isAttacking?: boolean;
  type: CharacterType;
  postId?: number;
  authorNickname?: string | null;
  jobRole?: string | null;
  careerYear?: string | null;
  createdAt?: string;
  contentPreview?: string;
  hp?: number;
  maxHp?: number;
  likeCount?: number;
  commentCount?: number;
};

const CHARACTER_THEME: Record<CharacterType, { label: string; src: string }> = {
  helpless: {
    label: "무기력",
    src: "/characters/helpless.svg",
  },
  anxious: {
    label: "불안",
    src: "/characters/anxious.svg",
  },
  lonely: {
    label: "외로움",
    src: "/characters/lonely.svg",
  },
  selfHate: {
    label: "자기비하",
    src: "/characters/selfHate.svg",
  },
  annoyed: {
    label: "짜증",
    src: "/characters/annoyed.svg",
  },
};

const characterCardStyle: (props: { character: CharacterType }) => string = cva(
  "flex flex-col items-center rounded-xl bg-[#1C1C1E] bg-linear-to-b from-transparent from-70% to-100% p-4",
  {
    variants: {
      character: {
        helpless: "to-purple-10",
        anxious: "to-orange-10",
        lonely: "to-blue-10",
        selfHate: "to-green-10",
        annoyed: "to-red-10",
      },
    },
  }
);
const characterLabelStyle: (props: { character: CharacterType }) => string = cva(
  "text-detail-13sb w-fit rounded-sm px-2 py-1",
  {
    variants: {
      character: {
        helpless: "bg-purple-10 text-purple-20",
        anxious: "bg-orange-10 text-orange-20",
        lonely: "bg-blue-10 text-blue-20",
        selfHate: "bg-green-10 text-green-20",
        annoyed: "bg-red-10 text-red-20",
      },
    },
  }
);

const characterBarStyle: (props: { character: CharacterType }) => string = cva(
  "h-full rounded-full bg-linear-to-r transition-all",
  {
    variants: {
      character: {
        helpless: "from-purple-30 to-purple-20",
        anxious: "from-orange-30 to-orange-20",
        lonely: "from-blue-30 to-blue-20",
        selfHate: "from-green-30 to-green-20",
        annoyed: "from-red-30 to-red-20",
      },
    },
  }
);

const JOB_ROLE_MAP: Record<string, string> = {
  DEVELOPMENT: "개발",
  PLANNING: "기획",
  DESIGN: "디자인",
  MARKETING: "마케팅",
  SALES: "영업",
  HR: "인사",
  GENERAL_AFFAIRS: "총무",
  PRODUCTION: "생산",
  ACCOUNTING: "회계",
  OTHER: "기타",
};

const CAREER_YEAR_MAP: Record<string, string> = {
  NEWCOMER: "신입",
  YEAR_1: "1년차",
  YEAR_2: "2년차",
  YEAR_3: "3년차",
  YEAR_4: "4년차",
  YEAR_5: "5년차",
  YEAR_6: "6년차",
  YEAR_7_PLUS: "7년차 이상",
};

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
  commentCount,
}: CharacterCardProps) {
  const character = CHARACTER_THEME[type];

  const linkHref = postId ? `/post/${postId}` : undefined;
  const displayNickname = authorNickname || "닉네임";
  const displayJob = jobRole ? JOB_ROLE_MAP[jobRole] || "기타" : "개발";
  const displayCareer = careerYear ? CAREER_YEAR_MAP[careerYear] || "기타" : "1년차";
  const displayTimeAgo = getTimeAgo(createdAt) || "1시간 전";
  const displayContent =
    contentPreview ||
    "이직 준비 시작하기 진짜 힘들다... 주말에 아무것도 안하고 누워있기만 함 ㅠㅠ 내 자신이 한심해. 어떻게 해야할까? 이직 준비 시작하기 진짜 힘들다... 주말에 아무것도 안하고 누워있기만 함 ㅠㅠ 내 자신이 한심해. 어떻게 해야할까? 이직 준비 시작하기 진짜 힘들다... 주말에 아무것도 안하고 누워있기만 함 ㅠㅠ 내 자신이 한심해. 어떻게 해야할까?";

  const currentHp = hp ?? 20;
  const maximumHp = maxHp ?? 30;
  const hpPercent = maximumHp > 0 ? (currentHp / maximumHp) * 100 : 0;

  const displayLikes = likeCount ?? 4;
  const displayComments = commentCount ?? 4;

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
        <div className="relative">
          <Image
            src={character.src}
            alt={`${character.label} 캐릭터`}
            width={88}
            height={96}
            priority={false}
            className="flex-none"
          />

          {isAttacking && (
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
          <div className={characterLabelStyle({ character: type })}>{character.label} 몬스터</div>

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
            className="text-detail-13m text-gray-30 flex items-center gap-0.5 rounded-sm bg-black/30 px-2 py-1.25"
          >
            <Heart className="fill-red-20 text-red-20 h-4 w-4 flex-none" />
            <span>공감하기</span>
            <span>·</span>
            <span>{displayLikes}</span>
          </button>

          <button
            type="button"
            className="text-detail-13m text-gray-30 flex items-center gap-0.5 rounded-sm bg-black/30 px-2 py-1.25"
          >
            <Comment className="h-4 w-4 flex-none" />
            <span>무조건 위로해주기</span>
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

"use client";

import Image from "next/image";
import { cva } from "class-variance-authority";
import Link from "next/link";
import Heart from "@/assets/icons/ic_heart.svg";
import Comment from "@/assets/icons/ic_comment.svg";

type CharacterType = "helpless" | "anxious" | "lonely" | "selfHate" | "annoyed";
type CharacterCardProps = {
  profile?: boolean; // TODO: 나중에 실제 유저 프로필 받도록 수정
  type: CharacterType;
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

const characterBarStyle: (props: { character: CharacterType }) => string = cva("h-full rounded-full bg-linear-to-r", {
  variants: {
    character: {
      helpless: "from-purple-30 to-purple-20",
      anxious: "from-orange-30 to-orange-20",
      lonely: "from-blue-30 to-blue-20",
      selfHate: "from-green-30 to-green-20",
      annoyed: "from-red-30 to-red-20",
    },
  },
});

export default function CharacterCard({ profile = true, type }: CharacterCardProps) {
  const character = CHARACTER_THEME[type];

  return (
    <li>
      <Link prefetch={false} href="/#" className={characterCardStyle({ character: type })}>
        {profile && (
          <>
            <div className="text-detail-12m text-gray-60 mb-3 flex w-full items-center justify-between">
              <div className="flex items-center gap-0.5">
                <p className="text-gray-30 after:bg-gray-60 flex items-center gap-2 after:mx-1.5 after:block after:h-2 after:w-px after:flex-none after:rounded-full after:content-['']">
                  닉네임
                </p>

                <p>개발</p>
                <p>·</p>
                <p>1년차</p>
              </div>

              <p>1시간 전</p>
            </div>

            <p className="text-body-15sb mb-4 line-clamp-2 w-full text-white">
              이직 준비 시작하기 진짜 힘들다... 주말에 아무것도 안하고 누워있기만 함 ㅠㅠ 내 자신이 한심해. 어떻게
              해야할까? 이직 준비 시작하기 진짜 힘들다... 주말에 아무것도 안하고 누워있기만 함 ㅠㅠ 내 자신이 한심해.
              어떻게 해야할까? 이직 준비 시작하기 진짜 힘들다... 주말에 아무것도 안하고 누워있기만 함 ㅠㅠ 내 자신이
              한심해. 어떻게 해야할까?
            </p>
          </>
        )}

        <div className="flex w-full items-end gap-5.5 px-4.5">
          <Image
            src={character.src}
            alt={`${character.label} 캐릭터`}
            width={88}
            height={96}
            priority={false}
            className="flex-none"
          />

          <div className="flex w-full flex-col gap-2.5">
            <div className={characterLabelStyle({ character: type })}>{character.label} 몬스터</div>

            <div className="mb-1">
              <div className="text-detail-13m text-gray-60 mb-1.5 flex items-center justify-between">
                <p>HP</p>
                <p>20/30</p>
              </div>

              <div className="bg-gray-80 h-2 w-full overflow-hidden rounded-full">
                <div className={characterBarStyle({ character: type })} style={{ width: `${(20 / 30) * 100}%` }} />
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
              <span>4</span>
            </button>

            <button
              type="button"
              className="text-detail-13m text-gray-30 flex items-center gap-0.5 rounded-sm bg-black/30 px-2 py-1.25"
            >
              <Comment className="h-4 w-4 flex-none" />
              <span>무조건 위로해주기</span>
              <span>·</span>
              <span>4</span>
            </button>
          </div>
        )}
      </Link>
    </li>
  );
}

"use client";

import CharacterChip from "@/components/CharacterChip";
import MainTopBar from "@/components/MainTopBar";
import Heart from "@/assets/icons/ic_heart.svg";
import Post from "@/assets/icons/ic_post.svg";
import Comment2 from "@/assets/icons/ic_comment_2.svg";
import ImgPostNoComment from "@/assets/icons/img_post_no_comment.svg";
import { CAREER_YEAR, JOB_ROLE } from "@/const/map";
import { getMonsterStats } from "@/services/endpoints/mypage";
import { getMe } from "@/services/endpoints/users";
import { myPageKeys, userKeys } from "@/services/query-keys";
import type { EmotionType } from "@/services/types";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

const CHARACTER_IMAGE: Record<EmotionType, string> = {
  ANXIETY: "/characters/anxiety/sm.svg",
  LETHARGY: "/characters/lethargy/sm.svg",
  LONELINESS: "/characters/loneliness/sm.svg",
  SELF_DEPRECATION: "/characters/self_deprecation/sm.svg",
  IRRITATION: "/characters/irritation/sm.svg",
};

export default function MyPage() {
  const profileQuery = useQuery({
    queryKey: userKeys.me(),
    queryFn: getMe,
  });

  const monsterStatsQuery = useQuery({
    queryKey: myPageKeys.monsterStats(),
    queryFn: getMonsterStats,
  });

  if (profileQuery.isPending || monsterStatsQuery.isPending) {
    return (
      <>
        <MainTopBar />
        <div className="text-body-14m text-gray-40 flex flex-1 items-center justify-center">
          마이페이지를 불러오는 중입니다...
        </div>
      </>
    );
  }

  if (profileQuery.isError || monsterStatsQuery.isError) {
    return (
      <>
        <MainTopBar />
        <div className="text-body-14m text-gray-40 flex flex-1 flex-col items-center justify-center gap-4">
          마이페이지를 불러오지 못했습니다.
          <button
            type="button"
            className="bg-gray-80 text-body-14m rounded-sm px-4 py-2 text-white"
            onClick={() => {
              void Promise.all([profileQuery.refetch(), monsterStatsQuery.refetch()]);
            }}
          >
            다시 시도
          </button>
        </div>
      </>
    );
  }

  const profile = profileQuery.data;
  const monsterStats = monsterStatsQuery.data;
  const mostFrequentEmotion = monsterStats.mostFrequentEmotion;

  return (
    <>
      <MainTopBar />

      <div className="flex items-center justify-between px-6 pt-8">
        <div>
          <p className="text-head-18b">{profile.nickname ?? "사용자"}님</p>

          <div className="mt-2 flex gap-2">
            {profile.jobType && (
              <div className="text-detail-13sb text-gray-90 rounded-sm bg-white px-2 py-0.5">
                {JOB_ROLE[profile.jobType]}
              </div>
            )}
            {profile.careerLevel && (
              <div className="text-detail-13sb text-gray-90 rounded-sm bg-white px-2 py-0.5">
                {CAREER_YEAR[profile.careerLevel]}
              </div>
            )}
          </div>
        </div>

        <Link href="/my/profile" className="border-gray-80 text-detail-13m text-gray-40 rounded-md border px-2.5 py-1">
          내 정보 수정
        </Link>
      </div>

      <div className="my-10 grid grid-cols-2 gap-3 px-4">
        <div className="bg-gray-90 flex flex-col items-center gap-0.5 rounded-xl py-3">
          <p className="text-detail-13m text-gray-50">전체 몬스터 수</p>
          <p className="text-body-15b">{monsterStats.totalMonsterCount}마리</p>
        </div>
        <div className="bg-gray-90 flex flex-col items-center gap-0.5 rounded-xl py-3">
          <p className="text-detail-13m text-gray-50">물리친 몬스터 수</p>
          <p className="text-body-15b">{monsterStats.defeatedMonsterCount}마리</p>
        </div>
        <div className="bg-gray-90 col-span-2 flex min-h-[120px] items-center justify-between gap-0.5 rounded-xl px-6 py-3">
          <div>
            <p className="text-detail-13m text-gray-50">가장 많이 나타난 몬스터</p>
            {mostFrequentEmotion ? (
              <div className="mt-4 flex items-center gap-2">
                <CharacterChip type={mostFrequentEmotion.type} />
                <p className="text-body-15b">{mostFrequentEmotion.percentage}%</p>
              </div>
            ) : (
              <p className="text-body-15b mt-4">두드러진 감정이 없어요</p>
            )}
          </div>

          {mostFrequentEmotion ? (
            <Image
              src={CHARACTER_IMAGE[mostFrequentEmotion.type]}
              alt={`${mostFrequentEmotion.displayName} 몬스터`}
              width={88}
              height={96}
              priority={false}
              className="flex-none"
            />
          ) : (
            <ImgPostNoComment className="h-[98px] w-[58px] object-contain" aria-hidden="true" />
          )}
        </div>
      </div>

      <div className="bg-gray-90 h-2" />

      <div className="mt-8 flex flex-col gap-8 px-4">
        <Link href="/my/posts?tab=posts" className="text-body-16sb flex items-center gap-3">
          <Post className="h-6 w-6" />
          작성글
        </Link>
        <Link href="/my/posts?tab=comments" className="text-body-16sb flex items-center gap-3">
          <Comment2 className="h-6 w-6" />
          작성댓글
        </Link>
        <Link href="/my/posts?tab=likes" className="text-body-16sb flex items-center gap-3">
          <Heart className="h-6 w-6 fill-white" />
          공감한 글
        </Link>
      </div>
    </>
  );
}

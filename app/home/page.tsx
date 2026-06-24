"use client";

import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import Filter from "./Filter";
import MainTopBar from "@/components/MainTopBar";
import WriteButton from "./WriteButton";
import CharacterCard from "@/components/CharacterCard";
import { getPosts } from "@/services/endpoints/post";
import { postKeys } from "@/services/query-keys";
import type { JobRole, CareerYear, EmotionType } from "@/services/types";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";

export default function HomePage() {
  const [jobRole, setJobRole] = useState<JobRole[]>([]);
  const [careerYear, setCareerYear] = useState<CareerYear[]>([]);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: postKeys.list({ jobRole, careerYear }),
    queryFn: ({ pageParam }) => getPosts({ size: 10, cursor: pageParam, jobRole, careerYear }),
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
  const loadMoreRef = useInfiniteScroll({ hasNextPage, isFetchingNextPage, fetchNextPage });

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <>
      <MainTopBar />
      <Filter
        jobRole={jobRole}
        careerYear={careerYear}
        onApply={(next) => {
          setJobRole(next.jobRole);
          setCareerYear(next.careerYear);
        }}
      />

      <main className="flex-1 pb-10">
        {isLoading ? (
          <div className="text-gray-40 text-body-14m flex items-center justify-center py-20">
            고민 글을 불러오는 중입니다...
          </div>
        ) : posts.length === 0 ? (
          <div className="text-body-14m flex items-center justify-center py-20 text-center whitespace-pre-wrap text-gray-50">
            {"아직 작성된 고민이 없어요.\n첫번째 고민의 주인공이 되어보세요!"}
          </div>
        ) : (
          <>
            <ul className="flex flex-col gap-4 px-4">
              {posts.map((post) => {
                const cardType = post.emotionType as EmotionType;

                return (
                  <li key={post.postId}>
                    <CharacterCard
                      profile={true}
                      type={cardType}
                      postId={post.postId}
                      authorNickname={post.authorNickname}
                      jobRole={post.jobRole}
                      careerYear={post.careerYear}
                      createdAt={post.createdAt}
                      contentPreview={post.contentPreview}
                      hp={post.monster?.hp}
                      maxHp={post.monster?.maxHp}
                      likeCount={post.likeCount}
                      commentCount={post.commentCount}
                      commentTone={post.commentTone}
                    />
                  </li>
                );
              })}
            </ul>

            <div ref={loadMoreRef} />
            {isFetchingNextPage && (
              <div className="text-gray-40 text-body-14m flex items-center justify-center py-6">
                고민 글을 불러오는 중입니다...
              </div>
            )}
          </>
        )}
      </main>

      <WriteButton />
    </>
  );
}

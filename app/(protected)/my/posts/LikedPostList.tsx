"use client";

import CharacterCard from "@/components/CharacterCard";
import { CAREER_YEAR_BY_LABEL, JOB_ROLE_BY_LABEL } from "@/const/map";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { getMyLikedPosts } from "@/services/endpoints/mypage";
import { myPageKeys } from "@/services/query-keys";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ACTIVITY_EMPTY_MESSAGES, ACTIVITY_PAGE_SIZE } from "./const";
import { EmptyState, InitialLoading, ListError, LoadMore } from "./ActivityListUI";

export default function LikedPostList() {
  const query = useInfiniteQuery({
    queryKey: myPageKeys.likedPosts(),
    queryFn: ({ pageParam }) => getMyLikedPosts({ cursor: pageParam, size: ACTIVITY_PAGE_SIZE }),
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const sentinelRef = useInfiniteScroll({
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
  });

  const posts = query.data?.pages.flatMap((page) => page.posts) ?? [];

  if (query.isLoading) return <InitialLoading label="공감한 글" />;
  if (query.isError) return <ListError onRetry={() => void query.refetch()} />;
  if (posts.length === 0) return <EmptyState message={ACTIVITY_EMPTY_MESSAGES.likes} />;

  return (
    <>
      <ul className="flex flex-col gap-4 px-4">
        {posts.map((post) => {
          const jobRole = JOB_ROLE_BY_LABEL[post.authorJobType];
          const careerYear = CAREER_YEAR_BY_LABEL[post.authorCareerLevel];

          return (
            <li key={post.postId}>
              <CharacterCard
                profile={true}
                type={post.emotionType}
                postId={post.postId}
                authorNickname={post.authorNickname}
                jobRole={jobRole}
                careerYear={careerYear}
                createdAt={post.createdAt}
                contentPreview={post.contentPreview}
                hp={post.currentHp}
                maxHp={post.maxHp}
                likeCount={post.likeCount}
                commentCount={post.commentCount}
                commentTone={post.commentTone}
              />
            </li>
          );
        })}
      </ul>
      <LoadMore sentinelRef={sentinelRef} isFetching={query.isFetchingNextPage} label="공감한 글" />
    </>
  );
}

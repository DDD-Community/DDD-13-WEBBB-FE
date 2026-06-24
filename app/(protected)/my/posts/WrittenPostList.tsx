"use client";

import CharacterCard from "@/components/CharacterCard";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { getMyPosts } from "@/services/endpoints/mypage";
import { getMe } from "@/services/endpoints/users";
import { myPageKeys, userKeys } from "@/services/query-keys";
import type { CommentTone } from "@/services/types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { ACTIVITY_EMPTY_MESSAGES, ACTIVITY_PAGE_SIZE } from "./const";
import { EmptyState, InitialLoading, ListError, LoadMore } from "./ActivityListUI";

// TODO: /api/me/posts 응답에 HP, 공감/댓글 수, 댓글 톤이 추가되면 이 임시값을 실제 필드로 교체
const MY_POST_CARD_FALLBACK = {
  currentHp: 20,
  maxHp: 30,
  likeCount: 0,
  commentCount: 0,
  commentTone: "COMFORT_ME",
} as const satisfies {
  currentHp: number;
  maxHp: number;
  likeCount: number;
  commentCount: number;
  commentTone: CommentTone;
};

export default function WrittenPostList() {
  // TODO: /api/me/posts 응답에 작성자 닉네임, 직군, 경력이 추가되면 profileQuery를 제거하고 응답값을 사용하도록 수정
  const profileQuery = useQuery({ queryKey: userKeys.me(), queryFn: getMe });

  const query = useInfiniteQuery({
    queryKey: myPageKeys.posts(),
    queryFn: ({ pageParam }) => getMyPosts({ cursor: pageParam, size: ACTIVITY_PAGE_SIZE }),
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const sentinelRef = useInfiniteScroll({
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
  });

  const posts = query.data?.pages.flatMap((page) => page.posts) ?? [];

  if (query.isLoading || profileQuery.isPending) return <InitialLoading label="작성글" />;
  if (query.isError || profileQuery.isError) {
    return (
      <ListError
        onRetry={() => {
          void Promise.all([query.refetch(), profileQuery.refetch()]);
        }}
      />
    );
  }
  if (posts.length === 0) return <EmptyState message={ACTIVITY_EMPTY_MESSAGES.posts} />;

  return (
    <>
      <ul className="flex flex-col gap-4 px-4">
        {posts.map((post) => (
          <li key={post.postId}>
            <CharacterCard
              profile={true}
              type={post.emotionType}
              postId={post.postId}
              authorNickname={profileQuery.data.nickname}
              jobRole={profileQuery.data.jobType}
              careerYear={profileQuery.data.careerLevel}
              createdAt={post.createdAt}
              contentPreview={post.contentPreview}
              hp={post.monsterStatus === "DEAD" ? 0 : MY_POST_CARD_FALLBACK.currentHp}
              maxHp={MY_POST_CARD_FALLBACK.maxHp}
              likeCount={MY_POST_CARD_FALLBACK.likeCount}
              commentCount={MY_POST_CARD_FALLBACK.commentCount}
              commentTone={MY_POST_CARD_FALLBACK.commentTone}
            />
          </li>
        ))}
      </ul>
      <LoadMore sentinelRef={sentinelRef} isFetching={query.isFetchingNextPage} label="작성글" />
    </>
  );
}

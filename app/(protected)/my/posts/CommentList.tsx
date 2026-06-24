"use client";

import Heart from "@/assets/icons/ic_heart.svg";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { getTimeAgo } from "@/lib/date";
import { getMyComments } from "@/services/endpoints/mypage";
import { myPageKeys } from "@/services/query-keys";
import { useInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ACTIVITY_EMPTY_MESSAGES, ACTIVITY_PAGE_SIZE } from "./const";
import { EmptyState, InitialLoading, ListError, LoadMore } from "./ActivityListUI";

export default function CommentList() {
  const query = useInfiniteQuery({
    queryKey: myPageKeys.comments(),
    queryFn: ({ pageParam }) => getMyComments({ cursor: pageParam, size: ACTIVITY_PAGE_SIZE }),
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const sentinelRef = useInfiniteScroll({
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
  });

  const comments = query.data?.pages.flatMap((page) => page.comments) ?? [];

  if (query.isLoading) return <InitialLoading label="작성댓글" />;
  if (query.isError) return <ListError onRetry={() => void query.refetch()} />;
  if (comments.length === 0) return <EmptyState message={ACTIVITY_EMPTY_MESSAGES.comments} />;

  return (
    <>
      <ul className="divide-gray-90 flex flex-col divide-y">
        {comments.map((comment) => (
          <li key={comment.commentId}>
            <Link href={`/post/${comment.postId}`} prefetch={false} className="flex gap-2 px-4 py-5">
              <div>
                <p className="text-body-15m whitespace-pre-wrap">{comment.content}</p>

                <div className="mt-3 flex gap-4">
                  <time dateTime={comment.createdAt} className="text-detail-12m text-gray-60">
                    {getTimeAgo(comment.createdAt) ?? "방금 전"}
                  </time>
                  <Heart className="fill-red-20 text-red-20 h-4 w-4" />
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <LoadMore sentinelRef={sentinelRef} isFetching={query.isFetchingNextPage} label="작성댓글" />
    </>
  );
}

"use client";

import ImgPostNoComment from "@/assets/icons/img_post_no_comment.svg";
import type { RefObject } from "react";

export function InitialLoading({ label }: { label: string }) {
  return (
    <div className="text-gray-40 text-body-14m flex items-center justify-center py-20">
      {label}을 불러오는 중입니다...
    </div>
  );
}

export function ListError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="text-body-14m text-gray-40 flex flex-col items-center justify-center gap-4 py-20">
      목록을 불러오지 못했습니다.
      <button type="button" onClick={onRetry} className="bg-gray-80 rounded-sm px-4 py-2 text-white">
        다시 시도
      </button>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <ImgPostNoComment className="h-[98px] w-[58px] object-contain" aria-hidden="true" />
      <p className="text-gray-70 text-body-14m mt-3 text-center">{message}</p>
    </div>
  );
}

export function LoadMore({
  sentinelRef,
  isFetching,
  label,
}: {
  sentinelRef: RefObject<HTMLDivElement | null>;
  isFetching: boolean;
  label: string;
}) {
  return (
    <>
      <div ref={sentinelRef} />
      {isFetching && (
        <div className="text-gray-40 text-body-14m flex items-center justify-center py-6">
          {label}을 불러오는 중입니다...
        </div>
      )}
    </>
  );
}

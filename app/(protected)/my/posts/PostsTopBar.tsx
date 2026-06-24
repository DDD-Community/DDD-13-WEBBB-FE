"use client";

import ArrowLeft from "@/assets/icons/ic_arrow_left.svg";
import TopBar from "@/components/TopBar";
import { useRouter } from "next/navigation";

export default function PostsTopBar() {
  const router = useRouter();

  return (
    <TopBar
      leftContent={
        <button type="button" aria-label="이전 페이지로 돌아가기" onClick={() => router.push("/my")}>
          <ArrowLeft className="h-6 w-6 flex-none" aria-hidden="true" />
        </button>
      }
    />
  );
}

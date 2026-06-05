"use client";

import Add from "@/assets/icons/ic_add.svg";
import { useRouter } from "next/navigation";

export default function WriteButton() {
  const router = useRouter();

  function handleWriteButtonClick() {
    // TODO: 로그인 상태 확인 로직 필요
    router.push("/write");
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-8 z-10">
      <div className="mx-auto flex w-full max-w-2xl justify-end pr-6">
        <button
          type="button"
          onClick={handleWriteButtonClick}
          className="text-gray-90 text-body-16b shadow-1 pointer-events-auto z-10 flex items-center gap-0.5 rounded-xl bg-white py-2.5 pr-3 pl-2"
        >
          <Add className="h-6 w-6 flex-none" />
          <p>글 쓰기</p>
        </button>
      </div>
    </div>
  );
}

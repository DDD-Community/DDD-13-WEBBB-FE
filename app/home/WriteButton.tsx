"use client";

import Add from "@/assets/icons/ic_add.svg";
import LoginRequiredModal from "@/components/LoginRequiredModal";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function WriteButton() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const isLoggedIn = hasHydrated && Boolean(user);

  function handleWriteButtonClick() {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }

    router.push("/write");
  }

  return (
    <>
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

      <LoginRequiredModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}

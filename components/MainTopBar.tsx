"use client";

import AlarmDefault from "@/assets/icons/ic_alarm_default.svg";
import Menu from "@/assets/icons/ic_menu.svg";
import X from "@/assets/icons/ic_x.svg";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function MainTopBar() {
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isLoggedIn = hasHydrated && Boolean(user);
  const shouldShowMenu = isLoggedIn && isMenuOpen;

  const handleMenuClick = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <>
      <div className="sticky top-0 z-10 flex h-17 items-center justify-between bg-black px-4">
        <Image src="/logo.svg" alt="서비스 로고" width={98} height={28} priority />

        {isLoggedIn && (
          <div className="align-center flex gap-4">
            <button type="button">
              <AlarmDefault className="h-6 w-6 flex-none text-gray-50" />
            </button>
            <button type="button" onClick={handleMenuClick}>
              {shouldShowMenu ? (
                <X className="h-6 w-6 flex-none text-white" />
              ) : (
                <Menu className="h-6 w-6 flex-none text-gray-50" />
              )}
            </button>
          </div>
        )}
      </div>

      {shouldShowMenu && (
        <>
          <div className="fixed inset-0 z-20" onClick={handleMenuClick} />
          <div className="text-body-16m text-gray-10 fixed top-17 z-20 flex w-full flex-col gap-6 bg-black px-6 py-5">
            <Link href="/home">홈</Link>
            <Link href="/my">마이페이지</Link>
            <Link href="/settings">설정</Link>
          </div>
        </>
      )}
    </>
  );
}

"use client";

import AlarmDefault from "@/assets/icons/ic_alarm_default.svg";
import Menu from "@/assets/icons/ic_menu.svg";
import X from "@/assets/icons/ic_x.svg";
import { useState } from "react";
import Link from "next/link";

export default function MainTopbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <>
      <div className="sticky top-0 z-10 flex h-17 items-center justify-between bg-black px-4">
        <p className="text-head-22sb">서비스 로고</p>

        <div className="align-center flex gap-4">
          <button type="button">
            <AlarmDefault className="h-6 w-6 flex-none text-gray-50" />
          </button>
          <button type="button" onClick={handleMenuClick}>
            {isMenuOpen ? (
              <X className="h-6 w-6 flex-none text-white" />
            ) : (
              <Menu className="h-6 w-6 flex-none text-gray-50" />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <>
          <div className="fixed inset-0 z-20" onClick={handleMenuClick} />
          <div className="text-body-16m text-gray-10 absolute top-17 z-20 flex w-full flex-col gap-6 bg-black px-6 py-5">
            <Link href="#">홈</Link>
            <Link href="#">마이페이지</Link>
            <Link href="#">설정</Link>
          </div>
        </>
      )}
    </>
  );
}

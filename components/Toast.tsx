"use client";

import { useEffect } from "react";
import Image from "next/image";

interface ToastProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function Toast({ message, isOpen, onClose }: ToastProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="animate-fade-in-up fixed bottom-[24px] left-1/2 z-50 -translate-x-1/2">
      <div className="flex h-[36px] w-[343px] items-center gap-2 rounded-[6px] bg-white p-[8px_12px] shadow-lg">
        <Image src="/ic_error.svg" alt="에러 아이콘" width={18} height={18} className="shrink-0" />

        <span className="text-gray-90 text-detail-13m leading-[150%] font-medium tracking-[-0.26px] whitespace-nowrap">
          {message}
        </span>
      </div>
    </div>
  );
}

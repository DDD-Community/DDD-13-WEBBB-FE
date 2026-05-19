"use client";

import Image from "next/image";

interface PopupWriteFinishProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function PopupWriteFinish({ isOpen, onClose, onConfirm }: PopupWriteFinishProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="relative flex h-[265px] w-[302px] shrink-0 flex-col items-center rounded-[12px] bg-white p-4">
        <div className="mt-4 mb-6 flex items-center justify-center">
          <Image
            src="/popup_write_finish.svg"
            alt="완료 캐릭터"
            width={90}
            height={100}
            className="h-auto object-contain"
            priority
          />
        </div>

        <h3 className="text-head-18sb mb-5 text-center leading-[150%] tracking-[-0.36px] text-black">
          글 등록을 완료할까요?
        </h3>

        <div className="flex w-full justify-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-20 text-gray-60 text-body-15m flex h-[44px] w-[131px] items-center justify-center rounded-lg p-[11px_38px_10px_38px] text-center leading-[150%] tracking-[-0.3px]"
          >
            계속 쓰기
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="bg-blue-30 text-body-15sb flex h-[44px] w-[131px] items-center justify-center rounded-lg p-[11px_40px_10px_40px] text-center leading-[150%] tracking-[-0.3px] text-white"
          >
            등록하기
          </button>
        </div>
      </div>
    </div>
  );
}

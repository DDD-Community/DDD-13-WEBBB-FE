"use client";

import Image from "next/image";

interface PopupWriteCancelProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function PopupWriteCancel({ isOpen, onClose, onConfirm }: PopupWriteCancelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="relative flex h-[289px] w-[302px] shrink-0 flex-col items-center rounded-[12px] bg-white">
        <div className="mt-9 mb-[22px]">
          <Image src="/popup_write_cancle.svg" alt="취소 캐릭터" width={90} height={100} className="object-contain" />
        </div>

        <h3 className="text-head-18sb mb-1 text-center leading-[150%] tracking-[-0.36px] text-black">
          글 작성을 취소하시겠어요?
        </h3>

        <p className="text-detail-13m mb-5 text-center leading-[150%] tracking-[-0.26px] text-gray-50">
          지금 나가면 작성 중인 내용이 저장되지 않아요.
        </p>

        <div className="flex w-full justify-center gap-2 px-4">
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
            className="bg-red-20 text-body-15sb flex h-[44px] w-[131px] items-center justify-center rounded-lg p-[11px_40px_10px_40px] text-center leading-[150%] tracking-[-0.3px] text-white"
          >
            취소하기
          </button>
        </div>
      </div>
    </div>
  );
}

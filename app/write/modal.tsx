"use client";

import Image from "next/image";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  subTitle?: string;
  imageSrc?: string;
  imageAlt?: string;
  cancelText?: string;
  confirmText?: string;
  confirmVariant?: "blue" | "red";
}

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  subTitle,
  imageSrc,
  imageAlt = "모달 캐릭터",
  cancelText = "취소",
  confirmText = "확인",
  confirmVariant = "blue",
}: ModalProps) {
  if (!isOpen) return null;

  const confirmBtnBg = confirmVariant === "red" ? "bg-red-20 text-white" : "bg-blue-20 text-black";
  const confirmBtnFont = confirmVariant === "red" ? "text-body-15sb" : "text-body-15m";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="relative flex w-[302px] shrink-0 cursor-default flex-col items-center rounded-[12px] bg-white px-4 pt-9 pb-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 캐릭터 이미지 */}
        {imageSrc && (
          <div className="mb-[22px]">
            <Image src={imageSrc} alt={imageAlt} width={90} height={100} className="h-auto object-contain" priority />
          </div>
        )}

        {/* 메인 문구 */}
        <h3
          className={`text-head-18sb text-center leading-[150%] tracking-[-0.36px] whitespace-pre-line text-black ${
            subTitle ? "mb-1" : "mb-[20px]"
          }`}
        >
          {title}
        </h3>

        {/* 서브 문구 */}
        {subTitle && (
          <p className="text-detail-13m mb-5 text-center leading-[150%] tracking-[-0.26px] whitespace-pre-line text-gray-50">
            {subTitle}
          </p>
        )}

        {/* 버튼 영역 */}
        <div className="flex w-full justify-center gap-2">
          {/* 취소 버튼 */}
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-20 text-gray-60 text-body-15m flex h-[44px] flex-1 items-center justify-center rounded-lg text-center leading-[150%] tracking-[-0.3px]"
          >
            {cancelText}
          </button>

          {/* 액션 버튼 */}
          <button
            type="button"
            onClick={onConfirm}
            className={`flex h-[44px] flex-1 items-center justify-center rounded-lg text-center leading-[150%] tracking-[-0.3px] ${confirmBtnBg} ${confirmBtnFont}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

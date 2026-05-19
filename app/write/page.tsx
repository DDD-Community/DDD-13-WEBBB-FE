"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWriteStore } from "@/store/useWriteStore";
import TopbarWrite from "@/components/TopbarWrite";
import PopupWriteFinish from "@/components/PopupWriteFinish";
import PopupWriteCancel from "@/components/PopupWriteCancel";

export default function WritePage() {
  const router = useRouter();
  const { content, setContent, selectedOption, setSelectedOption } = useWriteStore();
  const [isFocused, setIsFocused] = useState(false);

  const [isFinishPopupOpen, setIsFinishPopupOpen] = useState(false);
  const [isCancelPopupOpen, setIsCancelPopupOpen] = useState(false);

  const OPTIONS = ["대신 욕해주기", "무조건 위로해주기", "따뜻한 조언해주기", "웃겨주기"];
  const isInputActive = isFocused || content.length > 0;

  const handleRegisterConfirm = () => {
    setIsFinishPopupOpen(false);
  };

  const handleCancelConfirm = () => {
    setIsCancelPopupOpen(false);
    setContent("");
    setSelectedOption("");
    router.back();
  };

  return (
    <div className="flex min-h-screen justify-center bg-black font-sans">
      <div className="relative flex h-[812px] w-full max-w-[375px] flex-col bg-black">
        <TopbarWrite onLeftClick={() => setIsCancelPopupOpen(true)} onRightClick={() => setIsFinishPopupOpen(true)} />

        <main className="flex-1 overflow-y-auto px-4 pt-4 pb-[40px]">
          <h2 className="text-body-16sb mb-4 leading-[150%] tracking-[-0.32px] text-white">내용 작성</h2>

          <div className="w-full">
            <div
              className={`bg-gray-90 flex h-[320px] w-full items-start gap-[10px] rounded-[12px] border p-[16px_17px] transition-colors duration-200 ${
                isInputActive ? "border-blue-20" : "border-transparent"
              }`}
            >
              <textarea
                className="text-body-15m placeholder:text-gray-60 h-full w-full resize-none bg-transparent leading-[150%] tracking-[-0.3px] text-white outline-none"
                placeholder="말하기 힘든 감정을 오구오구에 털어놓아 보세요!"
                maxLength={500}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </div>
            <div className="text-detail-12m text-gray-60 mt-1 text-right leading-[150%] tracking-[-0.24px]">
              <span className={content.length > 0 ? "text-blue-20" : ""}>{content.length}</span>
              /500
            </div>
          </div>

          <h2 className="text-body-16sb mt-[44px] mb-4 leading-[150%] tracking-[-0.32px] text-white">댓글옵션 선택</h2>

          <div className="grid grid-cols-2 gap-x-[10px] gap-y-3">
            {OPTIONS.map((option) => {
              const isActive = selectedOption === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSelectedOption(option)}
                  className={`flex h-[44px] w-full items-center justify-center gap-[10px] rounded-[12px] px-10 py-3 transition-colors duration-200 ${
                    isActive ? "bg-blue-20 text-body-14sb text-black" : "bg-gray-90 text-gray-20 text-body-14m"
                  }`}
                >
                  <span className="whitespace-nowrap">{option}</span>
                </button>
              );
            })}
          </div>
        </main>
      </div>

      {/* 글 등록 완료 확인 팝업 */}
      <PopupWriteFinish
        isOpen={isFinishPopupOpen}
        onClose={() => setIsFinishPopupOpen(false)}
        onConfirm={handleRegisterConfirm}
      />

      {/* 글 작성 취소 확인 팝업 */}
      <PopupWriteCancel
        isOpen={isCancelPopupOpen}
        onClose={() => setIsCancelPopupOpen(false)}
        onConfirm={handleCancelConfirm}
      />
    </div>
  );
}

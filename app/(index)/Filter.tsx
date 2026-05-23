"use client";

import ArrowDown from "@/assets/icons/ic_arrow_down.svg";
import ArrowLeft from "@/assets/icons/ic_arrow_left.svg";
import Check from "@/assets/icons/ic_check.svg";
import Reset from "@/assets/icons/ic_reset.svg";
import { useState } from "react";

const filterOptions = {
  job: ["전체", "기획", "디자인", "개발", "마케팅", "영업", "인사", "총무", "생산", "회계"],
  career: ["전체", "신입", "1년차", "2년차", "3년차", "4년차", "5년차", "6년차", "7년차 이상"],
};

export default function Filter() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<keyof typeof filterOptions>("job");

  function handleComplete() {
    // TODO: 선택된 필터 옵션 데이터를 서버로 전송하는 로직 추가 필요
    setIsFilterOpen(false);
  }

  return (
    <>
      <div className="sticky top-17 z-10 flex items-center justify-between bg-black px-4 py-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="text-body-14sb bg-gray-90 flex items-center gap-1.5 rounded-sm py-1.5 pr-2 pl-3"
            onClick={() => setIsFilterOpen(true)}
          >
            <p>직군</p>
            <ArrowDown className="h-4 w-4 flex-none text-gray-50" />
          </button>

          <button
            type="button"
            className="text-body-14sb bg-gray-90 flex items-center gap-1.5 rounded-sm py-1.5 pr-2 pl-3"
            onClick={() => setIsFilterOpen(true)}
          >
            <p>경력</p>
            <ArrowDown className="h-4 w-4 flex-none text-gray-50" />
          </button>
        </div>

        <button type="button" className="flex items-center gap-1 text-gray-50">
          <p className="text-body-14m">최신순</p>
          <ArrowDown className="h-4 w-4 flex-none" />
        </button>
      </div>

      {isFilterOpen && (
        <div className="absolute top-0 z-20 flex h-full w-full flex-col bg-black">
          <div className="sticky top-0 bg-black">
            <div className="text-head-22sb flex items-center gap-2 px-4 pt-6 pb-5">
              <button type="button" onClick={() => setIsFilterOpen(false)}>
                <ArrowLeft className="h-6 w-6 flex-none text-white" />
              </button>

              <p>필터</p>
            </div>

            <div className="border-gray-80 text-head-18m text-gray-60 flex border-b">
              <button
                type="button"
                className="aria-pressed:border-blue-20 aria-pressed:text-head-18sb aria-pressed:text-blue-20 w-full py-3 aria-pressed:border-b-2"
                aria-pressed={selectedFilter === "job"}
                onClick={() => setSelectedFilter("job")}
              >
                직군
              </button>
              <button
                type="button"
                className="aria-pressed:border-blue-20 aria-pressed:text-head-18sb aria-pressed:text-blue-20 w-full py-3 aria-pressed:border-b-2"
                aria-pressed={selectedFilter === "career"}
                onClick={() => setSelectedFilter("career")}
              >
                경력
              </button>
            </div>
          </div>

          <div className="grow overflow-y-auto">
            <ul className="flex flex-col gap-5 p-6">
              {filterOptions[selectedFilter].map((option) => {
                const isSelected = option === "전체" ? true : false; // TODO: 선택된 옵션 상태 관리 로직 추가 필요

                return (
                  <button
                    key={option}
                    type="button"
                    className="text-head-18m text-gray-60 aria-pressed:text-blue-20 aria-pressed:text-head-18b flex items-center gap-3"
                    aria-pressed={isSelected}
                  >
                    <p>{option}</p>
                    {isSelected && <Check className="text-blue-20 h-6.5 w-6.5 flex-none" />}
                  </button>
                );
              })}
            </ul>
          </div>

          <div className="flex items-center gap-2.5 bg-black px-4 pt-4 pb-8">
            <button
              type="button"
              className="border-gray-80 text-head-18m flex h-13 flex-none items-center gap-2 rounded-xl border px-4.5 text-gray-50"
            >
              <Reset className="h-5 w-5" />
              <p>초기화</p>
            </button>

            <button
              type="button"
              className="bg-blue-20 text-gray-90 text-head-18sb h-13 w-full rounded-xl text-center"
              onClick={handleComplete}
            >
              선택 완료
            </button>
          </div>
        </div>
      )}
    </>
  );
}

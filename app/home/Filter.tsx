"use client";

import ArrowDown from "@/assets/icons/ic_arrow_down.svg";
import ArrowLeft from "@/assets/icons/ic_arrow_left.svg";
import Check from "@/assets/icons/ic_check.svg";
import Reset from "@/assets/icons/ic_reset.svg";
import Portal from "@/components/Portal";
import useFloating from "@/hooks/useFloating";
import useScrollLock from "@/hooks/useScrollLock";
import { useState } from "react";
import { FloatingPortal } from "@floating-ui/react";
import TopBar from "@/components/TopBar";
import type { JobRole, CareerYear, PostOrder } from "@/services/types";

// 한글 라벨 ↔ 백엔드 enum 매핑 ("전체"는 필터 해제이므로 제외)
const jobOptions: { label: string; value: JobRole }[] = [
  { label: "기획", value: "PLANNING" },
  { label: "디자인", value: "DESIGN" },
  { label: "개발", value: "DEVELOPMENT" },
  { label: "마케팅", value: "MARKETING" },
  { label: "영업", value: "SALES" },
  { label: "인사", value: "HR" },
  { label: "총무", value: "GENERAL_AFFAIRS" },
  { label: "생산", value: "PRODUCTION" },
  { label: "회계", value: "ACCOUNTING" },
];

const careerOptions: { label: string; value: CareerYear }[] = [
  { label: "신입", value: "NEWCOMER" },
  { label: "1년차", value: "YEAR_1" },
  { label: "2년차", value: "YEAR_2" },
  { label: "3년차", value: "YEAR_3" },
  { label: "4년차", value: "YEAR_4" },
  { label: "5년차", value: "YEAR_5" },
  { label: "6년차", value: "YEAR_6" },
  { label: "7년차 이상", value: "YEAR_7_PLUS" },
];

const sortOptions: { label: string; value: PostOrder }[] = [
  { label: "최신순", value: "LATEST" },
  { label: "인기순", value: "POPULAR" },
];

interface FilterProps {
  jobRole: JobRole[];
  careerYear: CareerYear[];
  order: PostOrder;
  onOrderChange: (order: PostOrder) => void;
  onApply: (next: { jobRole: JobRole[]; careerYear: CareerYear[] }) => void;
}

export default function Filter({ jobRole, careerYear, order, onOrderChange, onApply }: FilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<"job" | "career">("job");

  // 모달 안에서의 임시(드래프트) 선택값. 모달 열 때 커밋된 값으로 초기화.
  const [jobDraft, setJobDraft] = useState<JobRole[]>(jobRole);
  const [careerDraft, setCareerDraft] = useState<CareerYear[]>(careerYear);

  function openFilter(tab: "job" | "career") {
    setJobDraft(jobRole);
    setCareerDraft(careerYear);
    setSelectedFilter(tab);
    setIsFilterOpen(true);
  }

  useScrollLock(isFilterOpen);

  const {
    isOpen: isSortOpen,
    setIsOpen: setIsSortOpen,
    setReference,
    setFloating,
    floatingStyles,
    getReferenceProps,
    getFloatingProps,
  } = useFloating();

  function toggleJob(value: JobRole) {
    setJobDraft((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  }

  function toggleCareer(value: CareerYear) {
    setCareerDraft((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  }

  function handleReset() {
    setJobDraft([]);
    setCareerDraft([]);
  }

  function handleComplete() {
    onApply({ jobRole: jobDraft, careerYear: careerDraft });
    setIsFilterOpen(false);
  }

  // 선택된 값들을 "기획", "기획 외 1개" 형태의 버튼 라벨로 변환 (옵션 순서 기준)
  function buildLabel<T extends string>(selected: T[], options: { label: string; value: T }[], fallback: string) {
    const labels = options.filter((o) => selected.includes(o.value)).map((o) => o.label);
    if (labels.length === 0) return fallback;
    if (labels.length === 1) return labels[0];
    return `${labels[0]} 외 ${labels.length - 1}개`;
  }

  const selectedSortLabel = sortOptions.find((option) => option.value === order)?.label ?? sortOptions[0].label;

  return (
    <>
      <div className="sticky top-17 z-10 flex items-center justify-between bg-black px-4 py-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="text-body-14sb bg-gray-90 flex items-center gap-1.5 rounded-sm py-1.5 pr-2 pl-3"
            onClick={() => openFilter("job")}
          >
            <p>{buildLabel(jobRole, jobOptions, "직군")}</p>
            <ArrowDown className="h-4 w-4 flex-none text-gray-50" />
          </button>

          <button
            type="button"
            className="text-body-14sb bg-gray-90 flex items-center gap-1.5 rounded-sm py-1.5 pr-2 pl-3"
            onClick={() => openFilter("career")}
          >
            <p>{buildLabel(careerYear, careerOptions, "경력")}</p>
            <ArrowDown className="h-4 w-4 flex-none text-gray-50" />
          </button>
        </div>

        <button
          type="button"
          className="flex items-center gap-1 text-gray-50"
          ref={setReference}
          {...getReferenceProps()}
        >
          <p className="text-body-14m">{selectedSortLabel}</p>
          <ArrowDown className="h-4 w-4 flex-none" />
        </button>
      </div>

      {isSortOpen && (
        <FloatingPortal>
          <ul
            ref={setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="text-body-15m bg-gray-80 shadow-1 z-20 flex flex-col gap-5 rounded-lg p-5"
            role="listbox"
          >
            {sortOptions.map((option) => {
              const isSelected = option.value === order;

              return (
                <li key={option.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className="flex w-full items-center gap-4 text-gray-50 aria-selected:text-white"
                    onClick={() => {
                      onOrderChange(option.value);
                      setIsSortOpen(false);
                    }}
                  >
                    <span>{option.label}</span>
                    {isSelected && <Check className="h-5 w-5 flex-none" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </FloatingPortal>
      )}

      {isFilterOpen && (
        <Portal>
          <div className="fixed inset-0 z-20 flex items-center justify-center bg-black">
            <div className="flex h-full w-full max-w-2xl flex-col">
              <div className="sticky top-0 bg-black">
                <TopBar
                  leftContent={
                    <button type="button" onClick={() => setIsFilterOpen(false)}>
                      <ArrowLeft className="h-6 w-6 flex-none text-white" />
                    </button>
                  }
                  title="필터"
                  className="gap-2"
                  titleClassName="w-full text-head-22sb"
                />

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
                  {(() => {
                    const isJob = selectedFilter === "job";
                    const options = isJob ? jobOptions : careerOptions;
                    const draft = isJob ? jobDraft : careerDraft;
                    const isAllSelected = draft.length === 0;

                    return (
                      <>
                        <li>
                          <button
                            type="button"
                            className="text-head-18m text-gray-60 aria-pressed:text-blue-20 aria-pressed:text-head-18b flex items-center gap-3"
                            aria-pressed={isAllSelected}
                            onClick={() => (isJob ? setJobDraft([]) : setCareerDraft([]))}
                          >
                            <p>전체</p>
                            {isAllSelected && <Check className="text-blue-20 h-6.5 w-6.5 flex-none" />}
                          </button>
                        </li>
                        {options.map((option) => {
                          const isSelected = (draft as string[]).includes(option.value);

                          return (
                            <li key={option.value}>
                              <button
                                type="button"
                                className="text-head-18m text-gray-60 aria-pressed:text-blue-20 aria-pressed:text-head-18b flex items-center gap-3"
                                aria-pressed={isSelected}
                                onClick={() =>
                                  isJob ? toggleJob(option.value as JobRole) : toggleCareer(option.value as CareerYear)
                                }
                              >
                                <p>{option.label}</p>
                                {isSelected && <Check className="text-blue-20 h-6.5 w-6.5 flex-none" />}
                              </button>
                            </li>
                          );
                        })}
                      </>
                    );
                  })()}
                </ul>
              </div>

              <div className="sticky bottom-0 flex items-center gap-2.5 bg-black px-4 pt-4 pb-8">
                <button
                  type="button"
                  className="border-gray-80 text-head-18m flex h-13 flex-none items-center gap-2 rounded-xl border px-4.5 text-gray-50"
                  onClick={handleReset}
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
          </div>
        </Portal>
      )}
    </>
  );
}

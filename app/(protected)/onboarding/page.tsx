"use client";

import { ApiError } from "@/services/client";
import { checkNickname, updateMyProfile } from "@/services/endpoints/users";
import type { CareerYear, JobRole } from "@/services/types";
import X from "@/assets/icons/ic_x.svg";
import XCircle from "@/assets/icons/ic_x_circle.svg";
import ArrowLeft from "@/assets/icons/ic_arrow_left.svg";
import ArrowRight from "@/assets/icons/ic_arrow_right.svg";
import FormField from "@/components/FormField";
import TextInput from "@/components/TextInput";
import Toast from "@/components/Toast";
import TopBar from "@/components/TopBar";
import OptionGrid from "./OptionGrid";
import { zodResolver } from "@hookform/resolvers/zod";
import { careerSchema, jobSchema, nicknameSchema, onboardingSchema, type OnboardingInput } from "@/schemas/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useState } from "react";

type Step = 1 | 2 | 3;

const STEP_FIELD = {
  1: "nickname",
  2: "job",
  3: "career",
} as const satisfies Record<Step, keyof OnboardingInput>;

const STEP_META: Record<Step, string> = {
  1: "서비스에서 사용할\n닉네임을 알려주세요",
  2: "현재 취업 · 이직 준비중인\n직군은 무엇인가요?",
  3: "해당 직군의 경력은\n얼마나 되나요?",
};

const JOB_TO_API = {
  기획: "PLANNING",
  디자인: "DESIGN",
  개발: "DEVELOPMENT",
  마케팅: "MARKETING",
  영업: "SALES",
  인사: "HR",
  총무: "GENERAL_AFFAIRS",
  생산: "PRODUCTION",
  회계: "ACCOUNTING",
} as const satisfies Record<(typeof jobSchema.options)[number], JobRole>;

const CAREER_TO_API = {
  신입: "NEWCOMER",
  "1년차": "YEAR_1",
  "2년차": "YEAR_2",
  "3년차": "YEAR_3",
  "4년차": "YEAR_4",
  "5년차": "YEAR_5",
  "6년차": "YEAR_6",
  "7년차 이상": "YEAR_7_PLUS",
} as const satisfies Record<(typeof careerSchema.options)[number], CareerYear>;

export default function Onboarding() {
  const router = useRouter();
  const updateUser = useAuthStore((s) => s.updateUser);

  const [step, setStep] = useState<Step>(1);
  const [availableNickname, setAvailableNickname] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { mutate: submitOnboarding, isPending: isSubmitting } = useMutation({
    mutationFn: updateMyProfile,
    onSuccess: (user) => {
      updateUser({
        nickname: user.nickname,
        jobRole: user.jobType,
        careerYear: user.careerLevel,
      });
      router.replace("/home");
    },
    onError: (error) => {
      setErrorMessage(error instanceof ApiError ? error.message : "온보딩 저장에 실패했어요. 다시 시도해주세요.");
    },
  });

  const methods = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    mode: "onTouched",
    defaultValues: { nickname: "" },
  });

  const {
    register,
    handleSubmit,
    control,
    trigger,
    resetField,
    setError,
    clearErrors,
    formState: { errors },
  } = methods;

  const values = useWatch({ control });
  const nicknameValue = values.nickname ?? "";

  const currentField = STEP_FIELD[step];
  const currentValue = values[currentField];
  const isNicknameAvailable = availableNickname !== null && availableNickname === nicknameValue;

  function onSubmit(data: OnboardingInput) {
    if (availableNickname !== data.nickname) {
      setError("nickname", { message: "닉네임 중복확인이 필요합니다" });
      setStep(1);
      return;
    }

    submitOnboarding({
      nickname: data.nickname,
      jobType: JOB_TO_API[data.job],
      careerLevel: CAREER_TO_API[data.career],
    });
  }

  async function handleDuplicateCheck() {
    const parsed = nicknameSchema.safeParse(nicknameValue);

    if (!parsed.success) {
      setError("nickname", { message: parsed.error.issues[0]?.message ?? "닉네임을 확인해주세요" });
      return;
    }

    setIsChecking(true);

    try {
      const { available } = await checkNickname(parsed.data);

      if (!available) {
        setAvailableNickname(null);
        setError("nickname", { message: "이미 사용 중인 닉네임입니다" });
        return;
      }

      setAvailableNickname(parsed.data);
      clearErrors("nickname");
    } catch (error) {
      setError("nickname", {
        message: error instanceof ApiError ? error.message : "중복 확인에 실패했어요. 다시 시도해주세요",
      });
    } finally {
      setIsChecking(false);
    }
  }

  async function handleRightClick() {
    const ok = await trigger(currentField);
    if (!ok) return;

    if (step === 1 && !isNicknameAvailable) {
      setError("nickname", { message: "닉네임 중복확인이 필요합니다" });
      return;
    }

    if (step < 3) {
      setStep((prev) => (prev + 1) as Step);
    } else {
      handleSubmit(onSubmit)();
    }
  }

  function handleLeftClick() {
    setStep((prev) => Math.max(1, prev - 1) as Step);
  }

  return (
    <>
      <TopBar
        leftContent={
          <button type="button" onClick={() => router.back()}>
            <X className="h-6 w-6" />
          </button>
        }
      />

      <div className="relative h-1">
        <div
          className="absolute top-0 left-0 h-full bg-white transition-all"
          style={{ width: `${(step / 3) * 100}%` }}
        />
        <div className="bg-gray-70 h-full" />
      </div>

      <div className="px-4">
        <div className="mt-13 mb-14">
          <p className="text-head-22sb mb-3 whitespace-pre-line">{STEP_META[step]}</p>
          <p className="text-body-15m text-gray-50">글 작성시 함께 보여져요</p>
        </div>

        <FormProvider {...methods}>
          <form className="flex grow flex-col" onSubmit={handleSubmit(onSubmit)}>
            {step === 1 && (
              <FormField name="nickname" hideLabel>
                <TextInput
                  type="text"
                  placeholder="닉네임을 입력해주세요."
                  rightSlot={
                    typeof currentValue === "string" &&
                    currentValue.length > 0 && (
                      <button
                        type="button"
                        aria-label="입력 내용 지우기"
                        onClick={() => {
                          resetField("nickname", { defaultValue: "" });
                          setAvailableNickname(null);
                        }}
                      >
                        <XCircle className="text-gray-60 h-6 w-6" aria-hidden="true" />
                      </button>
                    )
                  }
                  {...register("nickname")}
                />

                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleDuplicateCheck}
                    disabled={isChecking}
                    className="text-detail-13sb text-gray-80 rounded-sm bg-white px-2.5 py-1"
                  >
                    중복확인
                  </button>

                  {isNicknameAvailable && <p className="text-detail-12m text-blue-20">사용 가능한 닉네임입니다</p>}
                </div>
              </FormField>
            )}

            {step === 2 && (
              <FormField name="job" hideLabel>
                <OptionGrid name="job" legend="직군 선택" options={jobSchema.options} />
              </FormField>
            )}

            {step === 3 && (
              <FormField name="career" hideLabel>
                <OptionGrid name="career" legend="연차 선택" options={careerSchema.options} />
              </FormField>
            )}
          </form>

          <div className="pointer-events-none fixed inset-x-0 bottom-8 z-10">
            <div className="mx-auto flex w-full max-w-2xl justify-between pr-4">
              {step > 1 && (
                <button
                  type="button"
                  className="bg-blue-30 disabled:bg-gray-90 pointer-events-auto z-10 mr-auto rounded-full py-3.25 pr-3.5 pl-3"
                  onClick={handleLeftClick}
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
              )}

              <button
                type="button"
                disabled={
                  !currentValue ||
                  !!errors[currentField] ||
                  isChecking ||
                  isSubmitting ||
                  (step === 1 && !isNicknameAvailable)
                }
                className="bg-blue-30 disabled:bg-gray-90 pointer-events-auto z-10 ml-auto rounded-full py-3.25 pr-3 pl-3.5"
                onClick={handleRightClick}
              >
                <ArrowRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        </FormProvider>
      </div>

      <Toast message={errorMessage} isOpen={errorMessage.length > 0} onClose={() => setErrorMessage("")} />
    </>
  );
}

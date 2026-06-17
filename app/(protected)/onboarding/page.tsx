"use client";

import X from "@/assets/icons/ic_x.svg";
import XCircle from "@/assets/icons/ic_x_circle.svg";
import ArrowLeft from "@/assets/icons/ic_arrow_left.svg";
import ArrowRight from "@/assets/icons/ic_arrow_right.svg";
import FormField from "@/components/FormField";
import TextInput from "@/components/TextInput";
import TopBar from "@/components/TopBar";
import OptionGrid from "./OptionGrid";
import { zodResolver } from "@hookform/resolvers/zod";
import { careerSchema, jobSchema, onboardingSchema, type OnboardingInput } from "@/schemas/auth";
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

export default function Onboarding() {
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);

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
    formState: { errors },
  } = methods;

  const values = useWatch({ control });

  const currentField = STEP_FIELD[step];
  const currentValue = values[currentField];

  function onSubmit(data: OnboardingInput) {
    // eslint-disable-next-line no-console
    console.log("onboarding submit:", data);
    // TODO: 서버에 온보딩 요청 전송
    router.push("/home");
  }

  async function handleRightClick() {
    const ok = await trigger(currentField);
    if (!ok) return;

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
                        onClick={() => resetField("nickname", { defaultValue: "" })}
                      >
                        <XCircle className="text-gray-60 h-6 w-6" aria-hidden="true" />
                      </button>
                    )
                  }
                  {...register("nickname")}
                />
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
                disabled={!currentValue || !!errors[currentField]}
                className="bg-blue-30 disabled:bg-gray-90 pointer-events-auto z-10 ml-auto rounded-full py-3.25 pr-3 pl-3.5"
                onClick={handleRightClick}
              >
                <ArrowRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        </FormProvider>
      </div>
    </>
  );
}

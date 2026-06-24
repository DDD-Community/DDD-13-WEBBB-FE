"use client";

import ArrowLeft from "@/assets/icons/ic_arrow_left.svg";
import XCircle from "@/assets/icons/ic_x_circle.svg";
import FormField from "@/components/FormField";
import Modal from "@/components/modal";
import TextInput from "@/components/TextInput";
import TopBar from "@/components/TopBar";
import { careerSchema, jobSchema, onboardingSchema, type OnboardingInput } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import InlineSelect from "./InlineSelect";

type OpenSelect = "job" | "career" | null;
type OpenModal = "leave" | "save" | null;

const INITIAL_PROFILE: OnboardingInput = {
  nickname: "오구오구",
  job: "디자인",
  career: "신입",
};

export default function ProfilePage() {
  const router = useRouter();
  const [openSelect, setOpenSelect] = useState<OpenSelect>(null);
  const [openModal, setOpenModal] = useState<OpenModal>(null);

  const methods = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    mode: "onChange",
    defaultValues: INITIAL_PROFILE,
  });

  const {
    control,
    handleSubmit,
    register,
    setValue,
    formState: { errors, isDirty, isValid },
  } = methods;

  const nickname = useWatch({ control, name: "nickname" });
  const canSave = isDirty && isValid;

  function toggleSelect(select: Exclude<OpenSelect, null>) {
    setOpenSelect((current) => (current === select ? null : select));
  }

  function submitProfile() {
    setOpenModal("save");
  }

  function confirmLeave() {
    setOpenModal(null);
    router.back();
  }

  function confirmSave() {
    setOpenModal(null);
    router.replace("/my");
  }

  return (
    <>
      <TopBar
        title="내 정보 수정"
        leftContent={
          <button
            type="button"
            aria-label="내 정보 화면으로 돌아가기"
            className="flex w-10 items-center justify-start"
            onClick={() => setOpenModal("leave")}
          >
            <ArrowLeft className="h-6 w-6 flex-none" aria-hidden="true" />
          </button>
        }
        rightContent={
          <button
            type="submit"
            form="profile-form"
            disabled={!canSave}
            className={`text-blue-30 w-10 text-right disabled:text-gray-50 ${canSave ? "text-body-16b" : "text-body-16m"}`}
          >
            저장
          </button>
        }
      />

      <FormProvider {...methods}>
        <form id="profile-form" className="flex flex-col gap-8 px-4 pt-8 pb-12" onSubmit={handleSubmit(submitProfile)}>
          <FormField name="nickname" label="닉네임">
            <TextInput
              type="text"
              placeholder="닉네임을 입력해주세요."
              rightSlot={
                nickname.length > 0 && (
                  <button
                    type="button"
                    aria-label="닉네임 지우기"
                    onClick={() => setValue("nickname", "", { shouldDirty: true, shouldValidate: true })}
                  >
                    <XCircle className="text-gray-60 h-6 w-6" aria-hidden="true" />
                  </button>
                )
              }
              {...register("nickname")}
            />

            <button
              type="button"
              disabled={!nickname || !!errors.nickname}
              className="text-detail-13sb text-gray-80 disabled:text-gray-60 disabled:bg-gray-80 mt-4 rounded-sm bg-white px-2.5 py-1"
            >
              중복확인
            </button>
          </FormField>

          <Controller
            name="job"
            control={control}
            render={({ field }) => (
              <FormField name="job" label="직군">
                <InlineSelect
                  id="job"
                  label="직군 선택"
                  value={field.value}
                  options={jobSchema.options}
                  isOpen={openSelect === "job"}
                  onToggle={() => toggleSelect("job")}
                  onChange={(value) => {
                    field.onChange(value);
                    setOpenSelect(null);
                  }}
                />
              </FormField>
            )}
          />

          <Controller
            name="career"
            control={control}
            render={({ field }) => (
              <FormField name="career" label="연차">
                <InlineSelect
                  id="career"
                  label="연차 선택"
                  value={field.value}
                  options={careerSchema.options}
                  isOpen={openSelect === "career"}
                  onToggle={() => toggleSelect("career")}
                  onChange={(value) => {
                    field.onChange(value);
                    setOpenSelect(null);
                  }}
                />
              </FormField>
            )}
          />
        </form>
      </FormProvider>

      <Modal
        isOpen={openModal === "leave"}
        onClose={() => setOpenModal(null)}
        onConfirm={confirmLeave}
        title="변경 내용을 저장하지 않고 나갈까요?"
        subTitle="지금 나가면 수정한 내용이 사라져요."
        cancelText="계속 수정"
        confirmText="나가기"
        confirmVariant="red"
      />

      <Modal
        isOpen={openModal === "save"}
        onClose={() => setOpenModal(null)}
        onConfirm={confirmSave}
        title="변경 내용을 저장하시겠어요?"
        confirmVariant="blue"
      />
    </>
  );
}

"use client";

import ArrowLeft from "@/assets/icons/ic_arrow_left.svg";
import XCircle from "@/assets/icons/ic_x_circle.svg";
import FormField from "@/components/FormField";
import Modal from "@/components/modal";
import TextInput from "@/components/TextInput";
import Toast from "@/components/Toast";
import TopBar from "@/components/TopBar";
import { CAREER_YEAR, CAREER_YEAR_BY_LABEL, JOB_ROLE, JOB_ROLE_BY_LABEL } from "@/const/map";
import { careerSchema, jobSchema, nicknameSchema, onboardingSchema, type OnboardingInput } from "@/schemas/auth";
import { ApiError } from "@/services/client";
import {
  checkNickname,
  getMe,
  updateMyProfile,
  type UserMeResponse,
  type UserProfileUpdateBody,
} from "@/services/endpoints/users";
import { userKeys } from "@/services/query-keys";
import type { CareerYear, JobRole } from "@/services/types";
import { useAuthStore } from "@/store/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import InlineSelect from "./InlineSelect";

type OpenSelect = "job" | "career" | null;
type OpenModal = "leave" | "save" | null;
type SupportedJobRole = Exclude<JobRole, "OTHER">;
type EditableProfile = UserMeResponse & {
  nickname: string;
  jobType: SupportedJobRole;
  careerLevel: CareerYear;
};

function isEditableProfile(profile: UserMeResponse): profile is EditableProfile {
  return Boolean(profile.nickname && profile.jobType && profile.jobType !== "OTHER" && profile.careerLevel);
}

export default function ProfilePage() {
  const router = useRouter();
  const profileQuery = useQuery({
    queryKey: userKeys.me(),
    queryFn: getMe,
  });

  useEffect(() => {
    if (profileQuery.data && !isEditableProfile(profileQuery.data)) {
      router.replace("/onboarding");
    }
  }, [profileQuery.data, router]);

  if (profileQuery.isPending || (profileQuery.data && !isEditableProfile(profileQuery.data))) {
    return (
      <>
        <TopBar title="내 정보 수정" />
        <div className="text-body-14m text-gray-40 flex flex-1 items-center justify-center">
          내 정보를 불러오는 중입니다...
        </div>
      </>
    );
  }

  if (profileQuery.isError) {
    return (
      <>
        <TopBar title="내 정보 수정" />
        <div className="text-body-14m text-gray-40 flex flex-1 flex-col items-center justify-center gap-4">
          내 정보를 불러오지 못했습니다.
          <button
            type="button"
            className="bg-gray-80 text-body-14m rounded-sm px-4 py-2 text-white"
            onClick={() => void profileQuery.refetch()}
          >
            다시 시도
          </button>
        </div>
      </>
    );
  }

  return <ProfileForm initialProfile={profileQuery.data} />;
}

function ProfileForm({ initialProfile }: { initialProfile: EditableProfile }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const updateAuthUser = useAuthStore((state) => state.updateUser);

  const [openSelect, setOpenSelect] = useState<OpenSelect>(null);
  const [openModal, setOpenModal] = useState<OpenModal>(null);
  const [availableNickname, setAvailableNickname] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [pendingProfile, setPendingProfile] = useState<OnboardingInput | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const methods = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    mode: "onChange",
    defaultValues: {
      nickname: initialProfile.nickname,
      job: JOB_ROLE[initialProfile.jobType],
      career: CAREER_YEAR[initialProfile.careerLevel],
    },
  });

  const {
    control,
    clearErrors,
    handleSubmit,
    register,
    setError,
    setValue,
    formState: { errors, isDirty, isValid },
  } = methods;

  const nickname = useWatch({ control, name: "nickname" });
  const isInitialNickname = nickname === initialProfile.nickname;
  const isNicknameAvailable = availableNickname !== null && availableNickname === nickname;
  const isNicknameConfirmed = isInitialNickname || isNicknameAvailable;

  const { mutate: saveProfile, isPending: isSaving } = useMutation({
    mutationFn: (body: UserProfileUpdateBody) => updateMyProfile(body),
    onSuccess: (user) => {
      queryClient.setQueryData(userKeys.me(), user);
      updateAuthUser({
        nickname: user.nickname,
        jobRole: user.jobType,
        careerYear: user.careerLevel,
      });
      router.replace("/my");
    },
    onError: (error) => {
      setErrorMessage(error instanceof ApiError ? error.message : "내 정보 저장에 실패했어요. 다시 시도해주세요.");
    },
  });

  const canSave = isDirty && isValid && isNicknameConfirmed && !isChecking && !isSaving;

  function toggleSelect(select: Exclude<OpenSelect, null>) {
    setOpenSelect((current) => (current === select ? null : select));
  }

  function requestSave(data: OnboardingInput) {
    if (!isNicknameConfirmed) {
      setError("nickname", { message: "닉네임 중복확인이 필요합니다" });
      return;
    }

    setPendingProfile(data);
    setOpenModal("save");
  }

  async function handleDuplicateCheck() {
    const parsed = nicknameSchema.safeParse(nickname);

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

  function confirmLeave() {
    setOpenModal(null);
    router.back();
  }

  function confirmSave() {
    if (!pendingProfile || isSaving) return;

    setOpenModal(null);
    saveProfile({
      nickname: pendingProfile.nickname,
      jobType: JOB_ROLE_BY_LABEL[pendingProfile.job],
      careerLevel: CAREER_YEAR_BY_LABEL[pendingProfile.career],
    });
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
        <form id="profile-form" className="flex flex-col gap-8 px-4 pt-8 pb-12" onSubmit={handleSubmit(requestSave)}>
          <FormField name="nickname" label="닉네임">
            <TextInput
              type="text"
              placeholder="닉네임을 입력해주세요."
              rightSlot={
                nickname.length > 0 && (
                  <button
                    type="button"
                    aria-label="닉네임 지우기"
                    onClick={() => {
                      setValue("nickname", "", { shouldDirty: true, shouldValidate: true });
                      setAvailableNickname(null);
                    }}
                  >
                    <XCircle className="text-gray-60 h-6 w-6" aria-hidden="true" />
                  </button>
                )
              }
              {...register("nickname", {
                onChange: () => setAvailableNickname(null),
              })}
            />

            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={handleDuplicateCheck}
                disabled={!nickname || !!errors.nickname || isChecking || isInitialNickname}
                className="text-detail-13sb text-gray-80 disabled:text-gray-60 disabled:bg-gray-80 rounded-sm bg-white px-2.5 py-1"
              >
                중복확인
              </button>

              {isNicknameAvailable && <p className="text-detail-12m text-blue-20">사용 가능한 닉네임입니다</p>}
            </div>
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

      <Toast message={errorMessage} isOpen={errorMessage.length > 0} onClose={() => setErrorMessage("")} />
    </>
  );
}

"use client";

import { ApiError } from "@/api/client";
import { checkEmail, signupEmail } from "@/api/endpoints/auth";
import X from "@/assets/icons/ic_x.svg";
import XCircle from "@/assets/icons/ic_x_circle.svg";
import FormField from "@/components/FormField";
import TextInput from "@/components/TextInput";
import Toast from "@/components/Toast";
import { emailSchema, PASSWORD_RULE_LABEL, passwordRules, signupSchema, type SignupInput } from "@/schemas/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import PasswordRule from "./PasswordRule";
import TopBar from "@/components/TopBar";

export default function Signup() {
  const router = useRouter();

  const setAuth = useAuthStore((s) => s.setAuth);

  const [availableEmail, setAvailableEmail] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { mutate: signup, isPending: isSubmitting } = useMutation({
    mutationFn: signupEmail,
    onSuccess: ({ user, tokens }) => {
      setAuth(user, tokens);
      router.push("/onboarding");
    },
    onError: (error) => {
      setErrorMessage(error instanceof ApiError ? error.message : "회원가입에 실패했어요. 다시 시도해주세요.");
    },
  });

  const methods = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  });

  const {
    register,
    handleSubmit,
    control,
    resetField,
    setError,
    clearErrors,
    formState: { errors },
  } = methods;

  const emailValue = useWatch({ control, name: "email" });
  const passwordValue = useWatch({ control, name: "password" });

  const isEmailAvailable = availableEmail !== null && availableEmail === emailValue;

  async function handleDuplicateCheck() {
    const parsed = emailSchema.safeParse(emailValue);

    if (!parsed.success) {
      setError("email", { message: parsed.error.issues[0]?.message ?? "올바른 이메일 형식이 아닙니다" });
      return;
    }

    setIsChecking(true);

    try {
      const { available } = await checkEmail(parsed.data);

      if (!available) {
        setAvailableEmail(null);
        setError("email", { message: "이미 가입된 이메일입니다" });
        return;
      }

      setAvailableEmail(parsed.data);
      clearErrors("email");
    } catch (error) {
      setError("email", {
        message: error instanceof ApiError ? error.message : "중복 확인에 실패했어요. 다시 시도해주세요",
      });
    } finally {
      setIsChecking(false);
    }
  }

  function onSubmit(data: SignupInput) {
    if (availableEmail !== data.email) {
      setError("email", { message: "이메일 중복확인이 필요합니다" });
      return;
    }

    signup(data);
  }

  const isPasswordTouched = passwordValue.length > 0;
  const passwordLengthOk = passwordRules.length(passwordValue);
  const passwordComboOk = passwordRules.combo(passwordValue);
  const passwordHasError = isPasswordTouched && (!passwordLengthOk || !passwordComboOk);

  return (
    <>
      <TopBar
        leftContent={
          <button type="button" onClick={() => router.back()}>
            <X className="h-6 w-6" />
          </button>
        }
      />

      <FormProvider {...methods}>
        <form className="mt-8.5 flex grow flex-col gap-15 px-4" onSubmit={handleSubmit(onSubmit)}>
          <FormField label="이메일 주소" name="email">
            <TextInput
              type="email"
              placeholder="이메일을 입력해주세요."
              rightSlot={
                emailValue?.length > 0 && (
                  <button
                    type="button"
                    aria-label="입력 내용 지우기"
                    onClick={() => resetField("email", { defaultValue: "" })}
                  >
                    <XCircle className="h-5 w-5" aria-hidden="true" />
                  </button>
                )
              }
              {...register("email")}
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

              {isEmailAvailable && <p className="text-detail-12m text-blue-20">사용 가능한 이메일입니다</p>}
            </div>
          </FormField>

          <FormField label="비밀번호" htmlFor="password">
            <TextInput
              type="password"
              placeholder="비밀번호를 입력해주세요."
              hasError={passwordHasError}
              rightSlot={
                passwordValue?.length > 0 && (
                  <button
                    type="button"
                    aria-label="입력 내용 지우기"
                    onClick={() => resetField("password", { defaultValue: "" })}
                  >
                    <XCircle className="h-5 w-5" aria-hidden="true" />
                  </button>
                )
              }
              {...register("password")}
            />

            {passwordValue.length > 0 && (
              <ul className="mt-3 space-y-1">
                <PasswordRule touched={isPasswordTouched} ok={passwordLengthOk} label={PASSWORD_RULE_LABEL.length} />
                <PasswordRule touched={isPasswordTouched} ok={passwordComboOk} label={PASSWORD_RULE_LABEL.combo} />
              </ul>
            )}
          </FormField>

          <button
            type="submit"
            className="text-head-18sb bg-blue-20 disabled:bg-gray-80 mt-auto mb-8 rounded-xl py-3 text-black"
            disabled={
              !!errors.email ||
              !!errors.password ||
              emailValue.length === 0 ||
              passwordValue.length === 0 ||
              isSubmitting
            }
          >
            가입완료
          </button>
        </form>
      </FormProvider>

      <Toast message={errorMessage} isOpen={errorMessage.length > 0} onClose={() => setErrorMessage("")} />
    </>
  );
}

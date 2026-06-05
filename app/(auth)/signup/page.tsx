"use client";

import X from "@/assets/icons/ic_x.svg";
import XCircle from "@/assets/icons/ic_x_circle.svg";
import FormField from "@/components/FormField";
import TextInput from "@/components/TextInput";
import { emailSchema, PASSWORD_RULE_LABEL, passwordRules, signupSchema, type SignupInput } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import PasswordRule from "./PasswordRule";
import TopBar from "@/components/TopBar";

export default function Signup() {
  const router = useRouter();

  const [availableEmail, setAvailableEmail] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    resetField,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  });

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

    // TODO: 실제 서버 중복 확인 API 호출. 중복이면 setError("email", { message: "이미 가입된 이메일입니다" })
    await new Promise((resolve) => setTimeout(resolve, 300));

    setAvailableEmail(parsed.data);
    clearErrors("email");
    setIsChecking(false);
  }

  function onSubmit(data: SignupInput) {
    if (availableEmail !== data.email) {
      setError("email", { message: "이메일 중복확인이 필요합니다" });
      return;
    }
    // TODO: 서버에 회원가입 요청 전송
    // eslint-disable-next-line no-console
    console.log("signup submit:", data);

    router.push("/onboarding");
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

      <form className="mt-8.5 flex grow flex-col gap-15 px-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField label="이메일 주소" htmlFor="signup-email" errorMessage={errors.email?.message}>
          <TextInput
            id="signup-email"
            type="email"
            placeholder="이메일을 입력해주세요."
            hasError={!!errors.email}
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

            {isEmailAvailable && <p className="text-detail-12m">사용가능한 메일입니다</p>}
          </div>
        </FormField>

        <FormField label="비밀번호" htmlFor="signup-password">
          <TextInput
            id="signup-password"
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
          disabled={!!errors.email || !!errors.password || emailValue.length === 0 || passwordValue.length === 0}
        >
          가입완료
        </button>
      </form>
    </>
  );
}

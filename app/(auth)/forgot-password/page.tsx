"use client";

import { ApiError } from "@/services/client";
import { confirmPasswordReset, requestPasswordReset } from "@/services/endpoints/auth";
import XCircle from "@/assets/icons/ic_x_circle.svg";
import X from "@/assets/icons/ic_x.svg";
import FormField from "@/components/FormField";
import TextInput from "@/components/TextInput";
import Toast from "@/components/Toast";
import TopBar from "@/components/TopBar";
import PasswordRule from "@/app/(auth)/signup/PasswordRule";
import {
  forgotPasswordConfirmSchema,
  forgotPasswordEmailSchema,
  PASSWORD_RULE_LABEL,
  passwordRules,
  type ForgotPasswordConfirmInput,
  type ForgotPasswordEmailInput,
} from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";

type Step = "email" | "confirm";

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [confirmedEmail, setConfirmedEmail] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // ── Step 1 ──────────────────────────────────────────────────
  const emailMethods = useForm<ForgotPasswordEmailInput>({
    resolver: zodResolver(forgotPasswordEmailSchema),
    mode: "onTouched",
    defaultValues: { email: "" },
  });

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    control: emailControl,
    resetField: resetEmailField,
    formState: { errors: emailErrors },
  } = emailMethods;

  const emailValue = useWatch({ control: emailControl, name: "email" });

  const { mutate: sendCode, isPending: isSending } = useMutation({
    mutationFn: (data: ForgotPasswordEmailInput) => requestPasswordReset(data.email),
    onSuccess: (_, { email }) => {
      setConfirmedEmail(email);
      setStep("confirm");
    },
    onError: (error) => {
      setToastMessage(error instanceof ApiError ? error.message : "코드 발송에 실패했어요. 다시 시도해주세요.");
    },
  });

  // ── Step 2 ──────────────────────────────────────────────────
  const confirmMethods = useForm<ForgotPasswordConfirmInput>({
    resolver: zodResolver(forgotPasswordConfirmSchema),
    mode: "onTouched",
    defaultValues: { code: "", newPassword: "", confirmPassword: "" },
  });

  const {
    register: registerConfirm,
    handleSubmit: handleConfirmSubmit,
    control: confirmControl,
    resetField: resetConfirmField,
    formState: { errors: confirmErrors },
  } = confirmMethods;

  const codeValue = useWatch({ control: confirmControl, name: "code" });
  const newPasswordValue = useWatch({ control: confirmControl, name: "newPassword" });
  const confirmPasswordValue = useWatch({ control: confirmControl, name: "confirmPassword" });

  const isNewPasswordTouched = newPasswordValue.length > 0;
  const passwordLengthOk = passwordRules.length(newPasswordValue);
  const passwordComboOk = passwordRules.combo(newPasswordValue);
  const passwordHasError = isNewPasswordTouched && (!passwordLengthOk || !passwordComboOk);

  const { mutate: changePassword, isPending: isChanging } = useMutation({
    mutationFn: (data: ForgotPasswordConfirmInput) => confirmPasswordReset(confirmedEmail, data.code, data.newPassword),
    onSuccess: () => {
      setToastMessage("비밀번호가 변경됐습니다.");
      setTimeout(() => router.replace("/login/email"), 2000);
    },
    onError: (error) => {
      setToastMessage(error instanceof ApiError ? error.message : "비밀번호 변경에 실패했어요. 다시 시도해주세요.");
    },
  });

  const { mutate: resend, isPending: isResending } = useMutation({
    mutationFn: () => requestPasswordReset(confirmedEmail),
    onSuccess: () => setToastMessage("인증 코드를 재발송했습니다."),
    onError: () => setToastMessage("재발송에 실패했어요. 다시 시도해주세요."),
  });

  // ── Render ───────────────────────────────────────────────────
  if (step === "email") {
    return (
      <>
        <TopBar
          leftContent={
            <button type="button" onClick={() => router.back()}>
              <X className="h-6 w-6" />
            </button>
          }
        />

        <FormProvider {...emailMethods}>
          <form
            className="mt-8.5 flex grow flex-col gap-21.5 px-4"
            onSubmit={handleEmailSubmit((data) => sendCode(data))}
          >
            <FormField label="이메일 주소" name="email">
              <TextInput
                type="email"
                placeholder="가입한 이메일을 입력해주세요."
                rightSlot={
                  emailValue?.length > 0 && (
                    <button
                      type="button"
                      aria-label="입력 내용 지우기"
                      onClick={() => resetEmailField("email", { defaultValue: "" })}
                    >
                      <XCircle className="text-gray-60 h-6 w-6" aria-hidden="true" />
                    </button>
                  )
                }
                {...registerEmail("email")}
              />
            </FormField>

            <button
              type="submit"
              className="text-head-18sb bg-blue-20 disabled:bg-gray-80 mt-auto rounded-xl py-3 text-black"
              disabled={!!emailErrors.email || !emailValue || isSending}
            >
              인증 코드 발송
            </button>
          </form>
        </FormProvider>

        <Toast message={toastMessage} isOpen={toastMessage.length > 0} onClose={() => setToastMessage("")} />
      </>
    );
  }

  return (
    <>
      <TopBar
        leftContent={
          <button type="button" onClick={() => setStep("email")}>
            <X className="h-6 w-6" />
          </button>
        }
      />

      <FormProvider {...confirmMethods}>
        <form
          className="mt-8.5 flex grow flex-col gap-8 px-4"
          onSubmit={handleConfirmSubmit((data) => changePassword(data))}
        >
          <div>
            <p className="text-body-16sb mb-3 block">이메일 주소</p>
            <TextInput type="email" value={confirmedEmail} readOnly className="cursor-default text-gray-50" />
          </div>

          <FormField label="인증 코드" name="code">
            <TextInput
              type="text"
              inputMode="numeric"
              placeholder="6자리 코드를 입력해주세요."
              maxLength={6}
              rightSlot={
                codeValue?.length > 0 && (
                  <button
                    type="button"
                    aria-label="입력 내용 지우기"
                    onClick={() => resetConfirmField("code", { defaultValue: "" })}
                  >
                    <XCircle className="text-gray-60 h-6 w-6" aria-hidden="true" />
                  </button>
                )
              }
              {...registerConfirm("code")}
            />
          </FormField>

          <FormField label="새 비밀번호" htmlFor="newPassword">
            <TextInput
              type="password"
              placeholder="새 비밀번호를 입력해주세요."
              hasError={passwordHasError}
              rightSlot={
                newPasswordValue?.length > 0 && (
                  <button
                    type="button"
                    aria-label="입력 내용 지우기"
                    onClick={() => resetConfirmField("newPassword", { defaultValue: "" })}
                  >
                    <XCircle className="h-5 w-5" aria-hidden="true" />
                  </button>
                )
              }
              {...registerConfirm("newPassword")}
            />
            {newPasswordValue.length > 0 && (
              <ul className="mt-3 space-y-1">
                <PasswordRule touched={isNewPasswordTouched} ok={passwordLengthOk} label={PASSWORD_RULE_LABEL.length} />
                <PasswordRule touched={isNewPasswordTouched} ok={passwordComboOk} label={PASSWORD_RULE_LABEL.combo} />
              </ul>
            )}
          </FormField>

          <FormField label="비밀번호 확인" name="confirmPassword">
            <TextInput
              type="password"
              placeholder="비밀번호를 다시 입력해주세요."
              rightSlot={
                confirmPasswordValue?.length > 0 && (
                  <button
                    type="button"
                    aria-label="입력 내용 지우기"
                    onClick={() => resetConfirmField("confirmPassword", { defaultValue: "" })}
                  >
                    <XCircle className="h-5 w-5" aria-hidden="true" />
                  </button>
                )
              }
              {...registerConfirm("confirmPassword")}
            />
          </FormField>

          <div className="mt-auto flex flex-col gap-3 pb-8">
            <button
              type="submit"
              className="text-head-18sb bg-blue-20 disabled:bg-gray-80 rounded-xl py-3 text-black"
              disabled={
                !codeValue ||
                !newPasswordValue ||
                !confirmPasswordValue ||
                !!confirmErrors.code ||
                passwordHasError ||
                !!confirmErrors.confirmPassword ||
                isChanging
              }
            >
              비밀번호 변경
            </button>
            <button
              type="button"
              className="text-detail-13m py-1 text-gray-50"
              onClick={() => resend()}
              disabled={isResending}
            >
              인증 코드 재발송
            </button>
          </div>
        </form>
      </FormProvider>

      <Toast message={toastMessage} isOpen={toastMessage.length > 0} onClose={() => setToastMessage("")} />
    </>
  );
}

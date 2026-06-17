"use client";

import { ApiError } from "@/api/client";
import { loginEmail } from "@/api/endpoints/auth";
import X from "@/assets/icons/ic_x.svg";
import XCircle from "@/assets/icons/ic_x_circle.svg";
import FormField from "@/components/FormField";
import TextInput from "@/components/TextInput";
import Toast from "@/components/Toast";
import TopBar from "@/components/TopBar";
import { loginSchema, type LoginInput } from "@/schemas/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";

export default function EmailLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [errorMessage, setErrorMessage] = useState("");

  const { mutate: login, isPending } = useMutation({
    mutationFn: loginEmail,
    onSuccess: ({ user, tokens }) => {
      setAuth(user, tokens);
      router.replace("/home");
    },
    onError: (error) => {
      setErrorMessage(error instanceof ApiError ? error.message : "로그인에 실패했어요. 다시 시도해주세요.");
    },
  });

  const methods = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  });

  const {
    register,
    handleSubmit,
    control,
    resetField,
    formState: { errors },
  } = methods;

  const emailValue = useWatch({ control, name: "email" });
  const passwordValue = useWatch({ control, name: "password" });

  function onSubmit(data: LoginInput) {
    login(data);
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

      <FormProvider {...methods}>
        <form className="mt-8.5 flex grow flex-col gap-21.5 px-4" onSubmit={handleSubmit(onSubmit)}>
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
                    <XCircle className="text-gray-60 h-6 w-6" aria-hidden="true" />
                  </button>
                )
              }
              {...register("email")}
            />
          </FormField>

          <FormField label="비밀번호" name="password">
            <TextInput
              type="password"
              placeholder="비밀번호를 입력해주세요."
              rightSlot={
                passwordValue?.length > 0 && (
                  <button
                    type="button"
                    aria-label="입력 내용 지우기"
                    onClick={() => resetField("password", { defaultValue: "" })}
                  >
                    <XCircle className="text-gray-60 h-6 w-6" aria-hidden="true" />
                  </button>
                )
              }
              {...register("password")}
            />
          </FormField>

          <button
            type="submit"
            className="text-head-18sb bg-blue-20 disabled:bg-gray-80 mt-auto rounded-xl py-3 text-black"
            disabled={
              !!errors.email || !!errors.password || emailValue.length === 0 || passwordValue.length === 0 || isPending
            }
          >
            로그인하기
          </button>
        </form>
      </FormProvider>

      <Toast message={errorMessage} isOpen={errorMessage.length > 0} onClose={() => setErrorMessage("")} />

      <Link href="/signup" className="text-gray-70 text-detail-13m mx-auto mt-6 mb-9 w-fit text-center underline">
        아직 계정이 없으신가요? 회원가입
      </Link>
    </>
  );
}

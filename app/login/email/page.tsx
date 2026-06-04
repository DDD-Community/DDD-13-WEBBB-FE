"use client";

import Close from "@/assets/icons/ic_close.svg";
import XCircle from "@/assets/icons/ic_x_circle.svg";
import FormField from "@/components/FormField";
import TextInput from "@/components/TextInput";
import { loginSchema, type LoginInput } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";

export default function EmailLogin() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    resetField,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  });

  const emailValue = useWatch({ control, name: "email" });
  const passwordValue = useWatch({ control, name: "password" });

  function onSubmit(data: LoginInput) {
    // eslint-disable-next-line no-console
    console.log("login submit:", data);
    // TODO: 서버에 로그인 요청 전송
    // TODO: 서버 에러 시 토스트 띄우기
  }

  return (
    <>
      <div className="px-4 py-5">
        <button type="button" onClick={() => router.back()}>
          <Close className="h-6 w-6" />
        </button>
      </div>

      <form className="mt-8.5 flex grow flex-col gap-21.5 px-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField label="이메일 주소" htmlFor="email" errorMessage={errors.email?.message}>
          <TextInput
            id="email"
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
                  <XCircle className="text-gray-60 h-6 w-6" aria-hidden="true" />
                </button>
              )
            }
            {...register("email")}
          />
        </FormField>

        <FormField label="비밀번호" htmlFor="password" errorMessage={errors.password?.message}>
          <TextInput
            id="password"
            type="password"
            placeholder="비밀번호를 입력해주세요."
            hasError={!!errors.password}
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
          disabled={!!errors.email || !!errors.password || emailValue.length === 0 || passwordValue.length === 0}
        >
          로그인하기
        </button>
      </form>

      <Link href="/signup" className="text-gray-70 text-detail-13m mx-auto mt-6 mb-9 w-fit text-center underline">
        아직 계정이 없으신가요? 회원가입
      </Link>
    </>
  );
}

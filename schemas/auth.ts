import { z } from "zod";

export const emailSchema = z.email({ message: "올바른 이메일 형식이 아닙니다" });

export const passwordRules = {
  length: (v: string) => v.length >= 8 && v.length <= 20,
  combo: (v: string) => /[A-Za-z]/.test(v) && /\d/.test(v) && /^[A-Za-z\d]+$/.test(v),
} as const;

export const PASSWORD_RULE_LABEL = {
  length: "8자 이상 20자 이하",
  combo: "영문 + 숫자 조합",
} as const;

export type PasswordRule = keyof typeof passwordRules;

export const passwordSchema = z.string().superRefine((val, ctx) => {
  if (!passwordRules.length(val)) {
    ctx.addIssue({
      code: "custom",
      message: PASSWORD_RULE_LABEL.length,
      params: { rule: "length" satisfies PasswordRule },
    });
  }
  if (!passwordRules.combo(val)) {
    ctx.addIssue({
      code: "custom",
      message: PASSWORD_RULE_LABEL.combo,
      params: { rule: "combo" satisfies PasswordRule },
    });
  }
});

export const nicknameSchema = z
  .string()
  .min(1, { message: "닉네임을 입력해주세요" })
  .max(10, { message: "10글자 이내로 작성해주세요" });

export const jobSchema = z.enum(["기획", "디자인", "개발", "마케팅", "영업", "인사", "총무", "생산", "회계"]);

export const careerSchema = z.enum(["신입", "1년차", "2년차", "3년차", "4년차", "5년차", "6년차", "7년차 이상"]);

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: "비밀번호를 입력해주세요" }),
});

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const onboardingSchema = z.object({
  nickname: nicknameSchema,
  job: jobSchema,
  career: careerSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type OnboardingInput = z.infer<typeof onboardingSchema>;

import { type CareerYear, type JobRole, type CommentTone, type EmotionType } from "@/services/types";

type InvertedStringMap<T extends Record<string, string>> = {
  [Key in keyof T as T[Key]]: Key;
};

function invertStringMap<const T extends Record<string, string>>(map: T): InvertedStringMap<T> {
  return Object.fromEntries(Object.entries(map).map(([key, value]) => [value, key])) as InvertedStringMap<T>;
}

export const CHARACTER_LABEL: Record<EmotionType, string> = {
  LETHARGY: "무기력",
  ANXIETY: "불안",
  LONELINESS: "외로움",
  SELF_DEPRECATION: "자기비하",
  IRRITATION: "짜증",
};

export const COMMENT_TONE: Record<CommentTone, string> = {
  VENT_WITH_ME: "대신 욕해주기",
  COMFORT_ME: "무조건 위로해주기",
  WARM_ADVICE: "따뜻한 조언해주기",
  MAKE_ME_LAUGH: "웃겨주기",
};

export const JOB_ROLE = {
  DEVELOPMENT: "개발",
  PLANNING: "기획",
  DESIGN: "디자인",
  MARKETING: "마케팅",
  SALES: "영업",
  HR: "인사",
  GENERAL_AFFAIRS: "총무",
  PRODUCTION: "생산",
  ACCOUNTING: "회계",
  OTHER: "기타",
} as const satisfies Record<JobRole, string>;

export const CAREER_YEAR = {
  NEWCOMER: "신입",
  YEAR_1: "1년차",
  YEAR_2: "2년차",
  YEAR_3: "3년차",
  YEAR_4: "4년차",
  YEAR_5: "5년차",
  YEAR_6: "6년차",
  YEAR_7_PLUS: "7년차 이상",
} as const satisfies Record<CareerYear, string>;

export const JOB_ROLE_BY_LABEL = invertStringMap(JOB_ROLE);
export const CAREER_YEAR_BY_LABEL = invertStringMap(CAREER_YEAR);

export type JobRoleLabel = keyof typeof JOB_ROLE_BY_LABEL;
export type CareerYearLabel = keyof typeof CAREER_YEAR_BY_LABEL;

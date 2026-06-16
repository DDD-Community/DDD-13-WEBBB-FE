/**
 * 백엔드 공용 타입.
 * 모든 응답은 ApiResponse<T> 공통 응답 포맷으로 감싸지며, client.ts 가 data를 언래핑
 */

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: ApiFieldError[] | null;
  timestamp: string;
}

export interface ApiFieldError {
  field: string;
  reason: string;
}

/** 커서 기반 페이지네이션 응답의 공통 필드 (도메인별 배열 키와 함께 사용) */
export interface CursorPage {
  nextCursor: number | null;
}

// 백엔드 enum ────────────────────────────────────

export type JobRole =
  | "PLANNING"
  | "DESIGN"
  | "DEVELOPMENT"
  | "MARKETING"
  | "SALES"
  | "HR"
  | "GENERAL_AFFAIRS"
  | "PRODUCTION"
  | "ACCOUNTING"
  | "OTHER";

export type CareerYear = "NEWCOMER" | "YEAR_1" | "YEAR_2" | "YEAR_3" | "YEAR_4" | "YEAR_5" | "YEAR_6" | "YEAR_7_PLUS";

export type CommentTone = "VENT_WITH_ME" | "COMFORT_ME" | "WARM_ADVICE" | "MAKE_ME_LAUGH";

export type EmotionType = "ANXIETY" | "LETHARGY" | "LONELINESS" | "SELF_DEPRECATION" | "IRRITATION";

export type MonsterStatus = "ALIVE" | "DEAD";

import { http } from "@/services/client";
import type { CareerYear, JobRole } from "@/services/types";

export interface UserMeResponse {
  id: string;
  email: string;
  nickname: string | null;
  jobType: JobRole | null;
  careerLevel: CareerYear | null;
  isActive: boolean;
  createdAt: string;
}

export interface UserProfileUpdateBody {
  nickname?: string;
  jobType?: JobRole;
  careerLevel?: CareerYear;
}

export const checkNickname = (value: string) =>
  http.get<{ available: boolean }>(`/api/users/nickname/check?value=${encodeURIComponent(value)}`);

export const updateMyProfile = (body: UserProfileUpdateBody) =>
  http.patch<UserMeResponse>("/api/users/me/profile", body);

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

export const getMe = () => http.get<UserMeResponse>("/api/users/me");

export const updateMyProfile = (body: UserProfileUpdateBody) =>
  http.patch<UserMeResponse>("/api/users/me/profile", body);

export const checkNickname = (value: string) =>
  http.get<{ available: boolean }>(`/api/users/nickname/check?value=${encodeURIComponent(value)}`);

export const updateUserById = (id: string, body: UserProfileUpdateBody) =>
  http.patch<UserMeResponse>(`/api/users/${id}`, body);

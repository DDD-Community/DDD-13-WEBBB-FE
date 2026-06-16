import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthTokens, AuthUser } from "@/api/endpoints/auth";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  /**
   * persist 가 localStorage 에서 복원을 끝냈는지 여부
   * 복원 전 첫 렌더에선 토큰이 null 로 보이므로, 라우트 가드는 이 값이 true 가 될 때까지 기다림
   */
  _hasHydrated: boolean;

  /** 로그인/회원가입 성공 시 유저 + 토큰 저장 */
  setAuth: (user: AuthUser, tokens: AuthTokens) => void;
  /** 토큰 재발급(refresh) 성공 시 토큰만 갱신 */
  setTokens: (tokens: AuthTokens) => void;
  /** 로그아웃 / refresh 실패 시 초기화 */
  clearAuth: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      _hasHydrated: false,

      setAuth: (user, tokens) => set({ user, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken }),
      setTokens: (tokens) => set({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken }),
      clearAuth: () => set({ user: null, accessToken: null, refreshToken: null }),
      setHasHydrated: (value) => set({ _hasHydrated: value }),
    }),
    {
      name: "auth",
      // _hasHydrated 는 런타임 플래그이므로 저장하지 않음
      partialize: ({ accessToken, refreshToken, user }) => ({ accessToken, refreshToken, user }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    }
  )
);

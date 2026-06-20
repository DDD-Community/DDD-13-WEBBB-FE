import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "@/services/endpoints/auth";

interface AuthState {
  user: AuthUser | null;
  /**
   * persist 가 localStorage 에서 복원을 끝냈는지 여부
   * 복원 전 첫 렌더에선 user가 null 로 보이므로, 이 값이 true 가 될 때까지 기다림
   */
  _hasHydrated: boolean;

  /** 로그인/회원가입 성공 시 유저 저장 */
  setUser: (user: AuthUser) => void;
  /** 프로필 수정 성공 시 저장된 유저 정보 일부 갱신 */
  updateUser: (user: Partial<AuthUser>) => void;
  /** 로그아웃 / 세션 만료 시 초기화 */
  clearAuth: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      _hasHydrated: false,

      setUser: (user) => set({ user }),
      updateUser: (user) => set((state) => ({ user: state.user ? { ...state.user, ...user } : state.user })),
      clearAuth: () => set({ user: null }),
      setHasHydrated: (value) => set({ _hasHydrated: value }),
    }),
    {
      name: "auth",
      // _hasHydrated 는 런타임 플래그이므로 저장하지 않음
      partialize: ({ user }) => ({ user }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    }
  )
);

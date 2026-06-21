"use client";

import MainTopBar from "@/components/MainTopBar";
import { logout } from "@/services/endpoints/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const { mutate: doLogout, isPending } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearAuth();
      router.replace("/");
    },
  });

  return (
    <div>
      <MainTopBar />

      <button type="button" onClick={() => doLogout()} disabled={isPending} className="bg-gray-70 p-2">
        로그아웃
      </button>
    </div>
  );
}

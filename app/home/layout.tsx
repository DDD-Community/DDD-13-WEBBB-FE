"use client";

import type { AuthUser } from "@/services/endpoints/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function needsOnboarding(user: AuthUser): boolean {
  return !user.nickname || !user.jobRole || !user.careerYear;
}

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);

  const shouldRedirect = Boolean(hasHydrated && user && needsOnboarding(user));

  useEffect(() => {
    if (shouldRedirect) {
      router.replace("/onboarding");
    }
  }, [shouldRedirect, router]);

  if (!hasHydrated || shouldRedirect) return null;

  return <>{children}</>;
}

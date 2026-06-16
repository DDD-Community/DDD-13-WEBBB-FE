import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "회원가입",
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}

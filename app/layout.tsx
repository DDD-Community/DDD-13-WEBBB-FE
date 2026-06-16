import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/globals.css";

const pretendard = localFont({
  src: "../styles/fonts/PretendardVariable.woff2",
  display: "swap",
  variable: "--font-pretendard",
  weight: "45 920",
});

export const metadata: Metadata = {
  title: {
    default: "오구오구 - 취업·이직 준비생의 연대 공간",
    template: "%s | 오구오구",
  },
  description: "마음 속 몬스터를 꺼내고 함께 처치하는 취업·이직 준비생의 연대 공간",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`${pretendard.variable} h-full antialiased`}>
      <body>
        <div className="flex min-h-screen w-full justify-center overflow-y-auto bg-black font-sans">
          <main className="relative flex w-full max-w-2xl flex-col bg-black">{children}</main>
        </div>
      </body>
    </html>
  );
}

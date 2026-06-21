import Sms from "@/assets/icons/ic_sms.svg";
import Naver from "@/assets/icons/ic_naver.svg";
import Google from "@/assets/icons/ic_google.svg";
import Kakao from "@/assets/icons/ic_kakao.svg";
import { oauthAuthorizeUrl, type OAuthProvider } from "@/services/endpoints/auth";
import { useRouter } from "next/navigation";
import { type ReactNode } from "react";

type LoginProvider = OAuthProvider | "email";

interface LoginButtonProps {
  provider: LoginProvider;
}

const loginProviderMap: Record<LoginProvider, { label: string; icon: ReactNode }> = {
  naver: {
    label: "네이버",
    icon: <Naver className="h-6 w-6" />,
  },
  google: {
    label: "구글",
    icon: <Google className="h-5 w-5" />,
  },
  kakao: {
    label: "카카오",
    icon: <Kakao className="h-6 w-6" />,
  },
  email: {
    label: "이메일",
    icon: <Sms className="h-6 w-6" />,
  },
};

export default function LoginButton({ provider }: LoginButtonProps) {
  const router = useRouter();

  const { label, icon } = loginProviderMap[provider];

  function handleClick() {
    if (provider === "email") {
      router.push("/login/email");
      return;
    }

    window.location.href = oauthAuthorizeUrl(provider);
  }

  return (
    <button
      type="button"
      className="bg-gray-90 text-body-15m flex w-full items-center justify-center gap-2 rounded-xl py-3.5"
      onClick={handleClick}
    >
      {icon}
      <p>{label}로 계속하기</p>
    </button>
  );
}

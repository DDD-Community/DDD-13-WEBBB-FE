import MainTopbar from "@/components/MainTopbar";
import Character from "./character.svg";
import Link from "next/link";

export default function Landing() {
  return (
    <>
      <MainTopbar />

      <p className="text-head-22sb mx-auto mt-29 text-center text-white">
        마음 속 몬스터를 꺼내고
        <br />
        함께 처치하는
        <br />
        취업 · 이직 준비생의 연대 공간
      </p>

      <div className="mx-auto mt-14 flex w-full max-w-44 flex-col gap-4">
        <Link
          href="/home"
          className="from-blue-30 to-blue-20 text-head-18sb rounded-xl bg-linear-to-r py-3 text-center text-black"
        >
          커뮤니티 보러가기
        </Link>
        <Link href="/login" className="text-head-18m bg-gray-80 rounded-xl py-3 text-center">
          로그인/회원가입
        </Link>
      </div>

      <p className="text-body-14m text-gray-60 mx-auto mt-4">12명이 감정을 공유했어요</p>

      <Character className="mx-auto mt-23 mb-10 h-48 w-42" />
    </>
  );
}

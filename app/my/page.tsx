import CharacterChip from "@/components/CharacterChip";
import MainTopBar from "@/components/MainTopBar";
import Heart from "@/assets/icons/ic_heart.svg";
import Post from "@/assets/icons/ic_post.svg";
import Comment2 from "@/assets/icons/ic_comment_2.svg";
import Image from "next/image";
import Link from "next/link";

export default function MyPage() {
  return (
    <>
      <MainTopBar />

      <div className="flex items-center justify-between px-6 pt-8">
        <div>
          <p className="text-head-18b">오구오구님</p>

          <div className="mt-2 flex gap-2">
            <div className="text-detail-13sb text-gray-90 rounded-sm bg-white px-2 py-0.5">디자인</div>
            <div className="text-detail-13sb text-gray-90 rounded-sm bg-white px-2 py-0.5">신입</div>
          </div>
        </div>

        <Link href="/my/profile" className="border-gray-80 text-detail-13m text-gray-40 rounded-md border px-2.5 py-1">
          내 정보 수정
        </Link>
      </div>

      <div className="my-10 grid grid-cols-2 gap-3 px-4">
        <div className="bg-gray-90 flex flex-col items-center gap-0.5 rounded-xl py-3">
          <p className="text-detail-13m text-gray-50">전체 몬스터 수</p>
          <p className="text-body-15b">5마리</p>
        </div>
        <div className="bg-gray-90 flex flex-col items-center gap-0.5 rounded-xl py-3">
          <p className="text-detail-13m text-gray-50">물리친 몬스터 수</p>
          <p className="text-body-15b">3마리</p>
        </div>
        <div className="bg-gray-90 col-span-2 flex items-center justify-between gap-0.5 rounded-xl px-6 py-3">
          <div>
            <p className="text-detail-13m text-gray-50">가장 많이 나타난 몬스터</p>
            <div className="mt-4 flex items-center gap-2">
              <CharacterChip type="ANXIETY" />
              <p className="text-body-15b">32%</p>
            </div>
          </div>

          <Image
            src="/characters/anxiety/sm.svg"
            alt="anxiety"
            width={88}
            height={96}
            priority={false}
            className="flex-none"
          />
        </div>
      </div>

      <div className="bg-gray-90 h-2" />

      <div className="mt-8 flex flex-col gap-8 px-4">
        <Link href="/my/posts?tab=posts" className="text-body-16sb flex items-center gap-3">
          <Post className="h-6 w-6" />
          작성글
        </Link>
        <Link href="/my/posts?tab=comments" className="text-body-16sb flex items-center gap-3">
          <Comment2 className="h-6 w-6" />
          작성댓글
        </Link>
        <Link href="/my/posts?tab=likes" className="text-body-16sb flex items-center gap-3">
          <Heart className="h-6 w-6 fill-white" />
          공감한 글
        </Link>
      </div>
    </>
  );
}

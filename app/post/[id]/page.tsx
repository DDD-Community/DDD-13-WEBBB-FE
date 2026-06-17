"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import ArrowLeft from "@/assets/icons/ic_arrow_left_lg.svg";
import ImgPostNoComment from "@/assets/icons/img_post_no_comment.svg";

import CharacterCard from "@/components/CharacterCard";
import LikeButton from "@/components/LikeButton";
import SpeechBubble from "./SpeechBubble";
import CommentItem from "./CommentItem";
import CommentInput from "./CommentInput";
import TopBar from "@/components/TopBar";

import { getPostDetail } from "@/api/endpoints/post";
import type { PostDetail } from "@/api/endpoints/post";

const JOB_ROLE_MAP: Record<string, string> = {
  DEVELOPMENT: "개발",
  PLANNING: "기획",
  DESIGN: "디자인",
  MARKETING: "마케팅",
  SALES: "영업",
  HR: "인사",
  GENERAL_AFFAIRS: "총무",
  PRODUCTION: "생산",
  ACCOUNTING: "회계",
  OTHER: "기타",
};

const CAREER_YEAR_MAP: Record<string, string> = {
  NEWCOMER: "신입",
  YEAR_1: "1년차",
  YEAR_2: "2년차",
  YEAR_3: "3년차",
  YEAR_4: "4년차",
  YEAR_5: "5년차",
  YEAR_6: "6년차",
  YEAR_7_PLUS: "7년차 이상",
};

const EMOTION_TYPE_MAP: Record<string, "anxious" | "helpless" | "lonely" | "selfHate" | "annoyed"> = {
  ANXIETY: "anxious",
  LETHARGY: "helpless",
  LONELINESS: "lonely",
  SELF_DEPRECATION: "selfHate",
  IRATION: "annoyed",
};

const COMMENT_TONE_MAP: Record<string, string> = {
  VENT_WITH_ME: "대신 욕해주기",
  COMFORT_ME: "무조건 위로해주기",
  WARM_ADVICE: "따뜻한 조언해주기",
  MAKE_ME_LAUGH: "웃겨주기",
};

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const postId = Number(id);

  const [post, setPost] = useState<PostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isNaN(postId)) return;

    const fetchPostDetail = async () => {
      try {
        setIsLoading(true);
        const response = await getPostDetail(postId);
        if (response) {
          setPost(response);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("게시글 상세 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostDetail();
  }, [postId]);

  if (isLoading) {
    return (
      <div className="text-gray-40 text-body-14m flex min-h-screen items-center justify-center bg-black">
        고민 글을 불러오는 중입니다...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-gray-40 text-body-14m flex min-h-screen flex-col items-center justify-center gap-4 bg-black">
        존재하지 않거나 삭제된 게시글입니다.
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-80 text-body-14m rounded-sm px-4 py-2 text-white"
        >
          돌아가기
        </button>
      </div>
    );
  }

  const comments = post.comments || [];
  const cardType = EMOTION_TYPE_MAP[post.emotion.type] || "anxious";
  const displayJob = post.author.jobRole ? JOB_ROLE_MAP[post.author.jobRole] || "기타" : "개발";
  const displayCareer = post.author.careerYear ? CAREER_YEAR_MAP[post.author.careerYear] || "기타" : "1년차";
  const supportText = COMMENT_TONE_MAP[post.commentTone] || "무조건 위로해주기";

  return (
    <div className="min-h-screen bg-black pb-[120px]">
      <TopBar
        className="border-gray-90 sticky top-0 z-50 border-b"
        leftContent={
          <button type="button" aria-label="뒤로가기" onClick={() => router.back()}>
            <ArrowLeft className="text-gray-30 h-6 w-6" />
          </button>
        }
      />

      <main>
        <div className="mt-5 ml-4 flex items-center">
          <span className="text-detail-13sb text-gray-30">{post.author.nickname || "닉네임"}</span>
          <div className="bg-gray-60 mx-2 h-2.5 w-[1px]" />
          <span className="text-detail-13m text-gray-60">{displayJob}</span>
          <span className="text-detail-13m text-gray-60 mx-0.5">·</span>
          <span className="text-detail-13m text-gray-60">{displayCareer}</span>
        </div>

        <div className="mt-3 px-4">
          <p className="text-body-16sb whitespace-pre-wrap text-white">{post.content}</p>
        </div>

        <div className="mt-6 px-4">
          <CharacterCard profile={false} type={cardType} hp={post.monster.hp} maxHp={post.monster.maxHp} />
        </div>

        <div className="mt-5 px-4">
          <LikeButton initialLikeCount={post.likeCount} />
        </div>

        <div className="bg-gray-90 mt-5 h-[1px] w-full" />

        <div className="mt-5 flex items-center gap-3 px-4">
          <div className="flex items-center gap-0.5">
            <span className="text-detail-13sb text-white">댓글</span>
            <span className="text-detail-13sb text-white">{post.commentCount}</span>
          </div>
          <SpeechBubble text={supportText} />
        </div>

        {comments.length === 0 ? (
          <div className="mt-[60px] flex flex-col items-center justify-center">
            <ImgPostNoComment className="h-[98px] w-[58px] object-contain" />
            <p className="text-gray-70 text-body-14m mt-3 text-center whitespace-pre-line">
              아직 작성된 댓글이 없어요.{"\n"}댓글을 써 몬스터를 처치해주세요!
            </p>
          </div>
        ) : (
          <ul className="mt-[18px] flex list-none flex-col gap-6 px-4">
            {comments.map((comment) => (
              <CommentItem key={comment.commentId} comment={comment} />
            ))}
          </ul>
        )}
      </main>

      <CommentInput placeholderType={supportText} />
    </div>
  );
}

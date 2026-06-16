"use client";

import ArrowLeft from "@/assets/icons/ic_arrow_left_lg.svg";
import ImgPostNoComment from "@/assets/icons/img_post_no_comment.svg";

import CharacterCard from "@/components/CharacterCard";
import LikeButton from "@/components/LikeButton";
import SpeechBubble from "./SpeechBubble";
import CommentItem from "./CommentItem";
import CommentInput from "./CommentInput";
import TopBar from "@/components/TopBar";

import { MOCK_POST, MOCK_COMMENTS } from "./mockData";

export default function PostDetailPage() {
  const post = MOCK_POST;
  const comments = MOCK_COMMENTS;

  return (
    <div className="min-h-screen bg-black pb-[120px]">
      <TopBar
        className="border-gray-90 sticky top-0 z-50 border-b"
        leftContent={
          <button type="button" aria-label="뒤로가기">
            <ArrowLeft className="text-gray-30 h-6 w-6" />
          </button>
        }
      />

      <main>
        <div className="mt-5 ml-4 flex items-center">
          <span className="text-detail-13sb text-gray-30">{post.author.nickname}</span>
          <div className="bg-gray-60 mx-2 h-2.5 w-[1px]" />
          <span className="text-detail-13m text-gray-60">{post.author.job}</span>
          <span className="text-detail-13m text-gray-60 mx-0.5">·</span>
          <span className="text-detail-13m text-gray-60">{post.author.experience}</span>
        </div>

        <div className="mt-3 px-4">
          <p className="text-body-16sb whitespace-pre-wrap text-white">{post.content}</p>
        </div>

        <div className="mt-6 px-4">
          <CharacterCard profile={false} type={post.characterType} />
        </div>

        <div className="mt-5 px-4">
          <LikeButton initialLikeCount={post.likeCount} />
        </div>

        <div className="bg-gray-90 mt-5 h-[1px] w-full" />

        <div className="mt-5 flex items-center gap-3 px-4">
          <div className="flex items-center gap-0.5">
            <span className="text-detail-13sb text-white">댓글</span>
            <span className="text-detail-13sb text-white">{comments.length}</span>
          </div>
          <SpeechBubble text={post.supportType} />
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
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </ul>
        )}
      </main>

      <CommentInput placeholderType={post.supportType} />
    </div>
  );
}

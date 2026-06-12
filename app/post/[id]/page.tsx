"use client";

import ArrowLeft from "@/assets/icons/ic_arrow_left_lg.svg";
import HeartDefault from "@/assets/icons/ic_heart_default.svg";

import CharacterCard from "@/components/CharacterCard";
import SpeechBubble from "./SpeechBubble";
import CommentItem from "./CommentItem";
import CommentInput from "./CommentInput";

import { MOCK_POST, MOCK_COMMENTS } from "./mockData";

export default function PostDetailPage() {
  const post = MOCK_POST;
  const comments = MOCK_COMMENTS;

  return (
    <div className="min-h-screen bg-black pb-[120px]">
      <header className="border-gray-90 flex h-[68px] w-full items-center border-b bg-black px-4 py-[22px]">
        <button type="button" aria-label="뒤로가기">
          <ArrowLeft className="text-gray-30 h-6 w-6" />
        </button>
      </header>

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
          <button
            type="button"
            className="bg-gray-90 flex w-fit items-center justify-center gap-0.5 rounded-[4px] px-2 py-1.25"
          >
            <HeartDefault className="text-gray-30 h-4 w-4" />
            <span className="text-detail-13m text-gray-30">공감하기</span>
            <span className="text-detail-13m text-gray-30 mx-0.5">·</span>
            <span className="text-detail-13m text-gray-30">{post.likeCount}</span>
          </button>
        </div>

        <div className="bg-gray-90 mt-5 h-[1px] w-full" />

        <div className="mt-5 flex items-center gap-3 px-4">
          <div className="flex items-center gap-0.5">
            <span className="text-detail-13sb text-white">댓글</span>
            <span className="text-detail-13sb text-white">{comments.length}</span>
          </div>
          <SpeechBubble text={post.supportType} />
        </div>

        <ul className="mt-[18px] flex flex-col gap-6 px-4">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </ul>
      </main>

      <CommentInput placeholderType={post.supportType} />
    </div>
  );
}

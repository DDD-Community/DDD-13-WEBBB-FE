"use client";

import { useEffect, useState } from "react";
import Filter from "./Filter";
import MainTopBar from "@/components/MainTopBar";
import WriteButton from "./WriteButton";
import CharacterCard from "@/components/CharacterCard";
import { getPosts } from "@/api/endpoints/post";
import type { PostListItem } from "@/api/endpoints/post";

const EMOTION_TYPE_MAP: Record<string, "anxious" | "helpless" | "lonely" | "selfHate" | "annoyed"> = {
  ANXIETY: "anxious",
  LETHARGY: "helpless",
  LONELINESS: "lonely",
  SELF_DEPRECATION: "selfHate",
  IRRITATION: "annoyed",
};

export default function HomePage() {
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await getPosts({ size: 20 });
        if (response && response.posts) {
          setPosts(response.posts);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("게시글 목록 로딩 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <div>
        <MainTopBar />
        <Filter />
      </div>

      <main className="flex-1 overflow-y-auto pb-[100px]">
        {isLoading ? (
          <div className="text-gray-40 text-body-14m flex items-center justify-center py-20">
            고민 글을 불러오는 중입니다...
          </div>
        ) : posts.length === 0 ? (
          <div className="text-body-14m flex items-center justify-center py-20 text-center whitespace-pre-wrap text-gray-50">
            {"아직 작성된 고민이 없어요.\n첫번째 고민의 주인공이 되어보세요!"}
          </div>
        ) : (
          <ul className="flex flex-col gap-4 px-4">
            {posts.map((post) => {
              const cardType = EMOTION_TYPE_MAP[post.emotionType] || "anxious";

              return (
                <li key={post.postId}>
                  <CharacterCard
                    profile={true}
                    type={cardType}
                    postId={post.postId}
                    authorNickname={post.authorNickname}
                    jobRole={post.jobRole}
                    careerYear={post.careerYear}
                    createdAt={post.createdAt}
                    contentPreview={post.contentPreview}
                    hp={post.monster?.hp}
                    maxHp={post.monster?.maxHp}
                    likeCount={post.likeCount}
                    commentCount={post.commentCount}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </main>

      <WriteButton />
    </>
  );
}

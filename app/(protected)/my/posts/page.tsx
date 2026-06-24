import Link from "next/link";
import CommentList from "./CommentList";
import LikedPostList from "./LikedPostList";
import PostsTopBar from "./PostsTopBar";
import WrittenPostList from "./WrittenPostList";
import type { ActivityTab } from "./const";

const TABS = [
  { value: "posts", label: "작성글" },
  { value: "comments", label: "작성댓글" },
  { value: "likes", label: "공감한 글" },
] as const satisfies ReadonlyArray<{ value: ActivityTab; label: string }>;

function resolveTab(tab: string | string[] | undefined): ActivityTab {
  if (typeof tab === "string" && TABS.some(({ value }) => value === tab)) {
    return tab as ActivityTab;
  }

  return "posts";
}

export default async function MyPostsPage({ searchParams }: { searchParams: Promise<{ tab?: string | string[] }> }) {
  const activeTab = resolveTab((await searchParams).tab);

  return (
    <>
      <PostsTopBar />

      <nav aria-label="내 활동 목록" className="mt-5 flex gap-1 px-4">
        {TABS.map((tab) => {
          const isActive = tab.value === activeTab;

          return (
            <Link
              key={tab.value}
              href={`/my/posts?tab=${tab.value}`}
              aria-current={isActive ? "page" : undefined}
              className={`rounded-sm px-3 py-1.5 ${
                isActive ? "text-body-14sb bg-gray-90 text-white" : "text-body-14m text-gray-50"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <main className="flex-1 py-6">
        {activeTab === "comments" ? <CommentList /> : activeTab === "likes" ? <LikedPostList /> : <WrittenPostList />}
      </main>
    </>
  );
}

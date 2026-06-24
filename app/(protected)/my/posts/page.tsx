import ImgPostNoComment from "@/assets/icons/img_post_no_comment.svg";
import CharacterCard, { type CharacterCardProps } from "@/components/CharacterCard";
import Link from "next/link";
import PostsTopBar from "./PostsTopBar";

const TABS = [
  { value: "posts", label: "작성글" },
  { value: "comments", label: "작성댓글" },
  { value: "likes", label: "공감한 글" },
] as const;

type ActivityTab = (typeof TABS)[number]["value"];

const EMPTY_MESSAGES: Record<ActivityTab, string> = {
  posts: "아직 작성한 글이 없어요",
  comments: "아직 작성한 댓글이 없어요",
  likes: "아직 공감한 글이 없어요",
};

const WRITTEN_POSTS = [
  {
    type: "ANXIETY",
    authorNickname: "오구오구",
    jobRole: "DESIGN",
    careerYear: "NEWCOMER",
    contentPreview: "포트폴리오를 계속 수정하고 있는데 언제쯤 완성됐다는 확신이 들까요?",
    hp: 20,
    maxHp: 30,
    likeCount: 12,
    commentCount: 5,
    commentTone: "COMFORT_ME",
  },
  {
    type: "LETHARGY",
    authorNickname: "오구오구",
    jobRole: "DESIGN",
    careerYear: "NEWCOMER",
    contentPreview: "오늘도 할 일을 미루기만 했어요. 다시 집중할 수 있는 방법이 필요해요.",
    hp: 8,
    maxHp: 20,
    likeCount: 7,
    commentCount: 3,
    commentTone: "WARM_ADVICE",
  },
] satisfies CharacterCardProps[];

const LIKED_POSTS = [
  {
    type: "LONELINESS",
    authorNickname: "취준하는감자",
    jobRole: "DEVELOPMENT",
    careerYear: "YEAR_1",
    contentPreview: "주변 사람들은 다 잘하고 있는 것 같은데 저만 멈춰 있는 기분이에요.",
    hp: 14,
    maxHp: 20,
    likeCount: 18,
    commentCount: 9,
    commentTone: "VENT_WITH_ME",
  },
  {
    type: "SELF_DEPRECATION",
    authorNickname: "한걸음씩",
    jobRole: "PLANNING",
    careerYear: "YEAR_3",
    contentPreview: "면접에서 준비한 말을 제대로 못 했지만 다음에는 더 잘해보고 싶어요.",
    hp: 24,
    maxHp: 30,
    likeCount: 21,
    commentCount: 11,
    commentTone: "MAKE_ME_LAUGH",
  },
] satisfies CharacterCardProps[];

function resolveTab(tab: string | string[] | undefined): ActivityTab {
  if (typeof tab === "string" && TABS.some(({ value }) => value === tab)) {
    return tab as ActivityTab;
  }

  return "posts";
}

export default async function MyPostsPage({ searchParams }: { searchParams: Promise<{ tab?: string | string[] }> }) {
  const activeTab = resolveTab((await searchParams).tab);
  const cards = activeTab === "posts" ? WRITTEN_POSTS : activeTab === "likes" ? LIKED_POSTS : [];

  return (
    <>
      <PostsTopBar />

      <nav aria-label="내 활동 목록" className="mt-5 flex gap-1">
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
        {cards.length > 0 ? (
          <ul className="flex flex-col gap-4 px-4">
            {cards.map((card, index) => (
              <li key={`${activeTab}-${index}`}>
                <CharacterCard profile={true} {...card} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-15 flex flex-col items-center justify-center">
            <ImgPostNoComment className="h-[98px] w-[58px] object-contain" aria-hidden="true" />
            <p className="text-gray-70 text-body-14m mt-3 text-center">{EMPTY_MESSAGES[activeTab]}</p>
          </div>
        )}
      </main>
    </>
  );
}

export type ActivityTab = "posts" | "comments" | "likes";

export const ACTIVITY_PAGE_SIZE = 10;

export const ACTIVITY_EMPTY_MESSAGES: Record<ActivityTab, string> = {
  posts: "아직 작성한 글이 없어요",
  comments: "아직 작성한 댓글이 없어요",
  likes: "아직 공감한 글이 없어요",
};

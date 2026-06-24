export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (filters?: unknown) => [...postKeys.lists(), filters ?? {}] as const,
  details: () => [...postKeys.all, "detail"] as const,
  detail: (postId: number) => [...postKeys.details(), postId] as const,
};

export const userKeys = {
  all: ["users"] as const,
  me: () => [...userKeys.all, "me"] as const,
};

export const myPageKeys = {
  all: ["my-page"] as const,
  activities: () => [...myPageKeys.all, "activities"] as const,
  posts: () => [...myPageKeys.activities(), "posts"] as const,
  comments: () => [...myPageKeys.activities(), "comments"] as const,
  likedPosts: () => [...myPageKeys.activities(), "liked-posts"] as const,
  monsterStats: () => [...myPageKeys.all, "monster-stats"] as const,
};

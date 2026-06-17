export type CharacterType = "helpless" | "anxious" | "lonely" | "selfHate" | "annoyed";

export type SupportType = "무조건 위로해주기" | "대신 욕해주기" | "따뜻한 조언해주기" | "웃겨주기";

export interface Post {
  id: number;
  author: {
    nickname: string;
    job: string;
    experience: string;
  };
  content: string;
  characterType: CharacterType;
  likeCount: number;
  isLiked: boolean;
  supportType: SupportType;
}

export interface Comment {
  id: number;
  author: {
    nickname: string;
    job: string;
    experience: string;
  };
  content: string;
  createdAt: string;
  likeCount: number;
  isLiked: boolean;
}

export const MOCK_POST: Post = {
  id: 123,
  author: { nickname: "오오", job: "개발", experience: "1년차" },
  content:
    "이직 준비 시작하기 진짜 힘들다... 주말에 아무것도 안하고 누워있기만 함 ㅠㅠ 내 자신이 한심해. 어떻게 해야할까?",
  characterType: "helpless",
  likeCount: 4,
  isLiked: false,
  supportType: "무조건 위로해주기",
};

export const MOCK_COMMENTS: Comment[] = [];

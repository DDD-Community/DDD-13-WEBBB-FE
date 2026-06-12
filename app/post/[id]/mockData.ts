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

export const MOCK_COMMENTS: Comment[] = [
  {
    id: 1,
    author: { nickname: "이직귀찮", job: "개발", experience: "1년차" },
    content: "조금만 더 버텨보자..!! 잠깐 쉬어도 되니 파이팅",
    createdAt: "1분 전",
    likeCount: 1,
    isLiked: true,
  },
  {
    id: 2,
    author: { nickname: "포포", job: "디자인", experience: "3년차" },
    content: "저도 똑같아요 ㅠㅠ 이번 주말은 그냥 푹 쉬는 걸로 해요 우리!",
    createdAt: "5분 전",
    likeCount: 0,
    isLiked: false,
  },
];

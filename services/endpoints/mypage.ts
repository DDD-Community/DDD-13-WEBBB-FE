import { http } from "@/services/client";
import type { EmotionType } from "@/services/types";

export interface MostFrequentEmotion {
  type: EmotionType;
  displayName: string;
  count: number;
  percentage: number;
}

export interface MonsterStatsResponse {
  totalMonsterCount: number;
  defeatedMonsterCount: number;
  mostFrequentEmotion: MostFrequentEmotion | null;
}

export const getMonsterStats = () => http.get<MonsterStatsResponse>("/api/me/monster-stats");

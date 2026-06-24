import { type CommentTone } from "@/services/types";
import { create } from "zustand";

interface WriteState {
  content: string;
  setContent: (content: string) => void;
  selectedOption: CommentTone | "";
  setSelectedOption: (option: CommentTone | "") => void;
}

export const useWriteStore = create<WriteState>((set) => ({
  content: "",
  setContent: (content) => set({ content }),
  selectedOption: "",
  setSelectedOption: (option) => set({ selectedOption: option }),
}));

import { create } from "zustand";

interface WriteState {
  content: string;
  setContent: (content: string) => void;
  selectedOption: string | null;
  setSelectedOption: (option: string) => void;
}

export const useWriteStore = create<WriteState>((set) => ({
  content: "",
  setContent: (content) => set({ content }),
  selectedOption: null,
  setSelectedOption: (option) => set({ selectedOption: option }),
}));

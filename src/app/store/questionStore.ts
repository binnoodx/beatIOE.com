// stores/questionStore.ts
import { create } from 'zustand';

interface QuestionType {
  _id: string;
  seed: string;
  question: string;
  options: string[];
  correctOption: string;
  subject?: string;
  topic?: string;
  solvedBy: number;
}

interface QuestionStore {
  questions: QuestionType[];
  setQuestions: (questions: QuestionType[]) => void;
  fetchQuestions: (email: string, page: number, limit?: number) => Promise<void>;
}

export const useQuestionStore = create<QuestionStore>((set) => ({
  questions: [],
  setQuestions: (questions) => set({ questions }),
  fetchQuestions: async (email, page, limit = 5) => {
    const res = await fetch(`/api/getQuestions?page=${page}&limit=${limit}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (data.success) {
      set((state) => ({
        questions: [...state.questions, ...data.data],
      }));
    }
  },
}));

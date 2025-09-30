import { create } from 'zustand';
import type { CreateAnswerResponse } from '../schemas/taskCreation.schema';

interface QuestionState {
  questions: CreateAnswerResponse | null;
  setQuestions: (data: CreateAnswerResponse) => void;
  clearQuestions: () => void;
}

export const useQuestionStore = create<QuestionState>((set) => ({
  questions: null,
  setQuestions: (data) => set({ questions: data }),
  clearQuestions: () => set({ questions: null })
}));
import { create } from 'zustand';

export type ViewType = 'CHOICE' | 'URL_INPUT' | 'MANUAL_INPUT' | 'CODE_INPUT' | 'RESULTS';
export type SubmissionType = 'url' | 'manual' | null;

export interface ProblemData {
  title: string;
  description: string;
  input: string;
  output: string;
  constraints: string;
  url?: string;
}

export interface CodeData {
  code: string;
  language: string;
}

export interface AnalysisResult {
  id: string;
  title: string;
  description: string;
  code: string;
}

interface IncorrectAnswerNoteState {
  isModalOpen: boolean;
  currentView: ViewType;
  problemData: Partial<ProblemData>;
  submissionType: SubmissionType;
  codeData: CodeData;
  analysisResult: AnalysisResult[];
  selectedLogicId: string | null;
  isLoading: boolean;
  error: string | null;
}

interface IncorrectAnswerNoteActions {
  openModal: () => void;
  closeModal: () => void;
  setCurrentView: (view: ViewType) => void;
  setProblemData: (data: Partial<ProblemData>) => void;
  setSubmissionType: (type: SubmissionType) => void;
  setCodeData: (data: CodeData) => void;
  setAnalysisResult: (results: AnalysisResult[]) => void;
  setSelectedLogicId: (id: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  resetModal: () => void;
}

type IncorrectAnswerNoteStore = IncorrectAnswerNoteState & IncorrectAnswerNoteActions;

const initialState: IncorrectAnswerNoteState = {
  isModalOpen: false,
  currentView: 'CHOICE',
  problemData: {},
  submissionType: null,
  codeData: { code: '', language: 'javascript' },
  analysisResult: [],
  selectedLogicId: null,
  isLoading: false,
  error: null,
};

export const useIncorrectAnswerNoteStore = create<IncorrectAnswerNoteStore>((set) => ({
  ...initialState,

  openModal: () => set({ isModalOpen: true, currentView: 'CHOICE' }),

  closeModal: () => set({ isModalOpen: false }),

  setCurrentView: (view) => set({ currentView: view }),

  setProblemData: (data) =>
    set((state) => ({ problemData: { ...state.problemData, ...data } })),

  setSubmissionType: (type) => set({ submissionType: type }),

  setCodeData: (data) => set({ codeData: data }),

  setAnalysisResult: (results) =>
    set({
      analysisResult: results,
      selectedLogicId: results.length > 0 ? results[0].id : null
    }),

  setSelectedLogicId: (id) => set({ selectedLogicId: id }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  resetModal: () => set(initialState),
}));
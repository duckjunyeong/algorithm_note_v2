import { create } from 'zustand';

export type ViewType = 'CHOICE' | 'URL_INPUT' | 'MANUAL_INPUT' | 'CODE_INPUT' | 'RESULTS';
export type SubmissionType = 'url' | 'manual' | null;

export interface ProblemData {
  title: string;
  description: string;
  inputCondition: string;
  outputCondition: string;
  constraints: string;
  url?: string;
}

export interface CodeData {
  code: string;
  language: string;
}

export interface AnalysisResult {
  title: string;
  description: string;
  code: string;
}

interface IncorrectAnswerNoteState {
  isModalOpen: boolean;
  isExitConfirmationVisible: boolean;
  currentView: ViewType;
  problemData: ProblemData;
  submissionType: SubmissionType;
  codeData: CodeData;
  analysisResult: AnalysisResult[];
  selectedAnalysisIndex: number;
  isLoading: boolean;
  error: string | null;
}

interface IncorrectAnswerNoteActions {
  openModal: () => void;
  closeModal: () => void;
  showExitConfirmation: () => void;
  hideExitConfirmation: () => void;
  setCurrentView: (view: ViewType) => void;
  setSubmissionType: (type: SubmissionType) => void;
  setProblemData: (data: Partial<ProblemData>) => void;
  setCodeData: (data: Partial<CodeData>) => void;
  setAnalysisResult: (results: AnalysisResult[]) => void;
  setSelectedAnalysisIndex: (index: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetState: () => void;
  analyzeCode: () => Promise<void>;
}

type IncorrectAnswerNoteStore = IncorrectAnswerNoteState & IncorrectAnswerNoteActions;

const initialState: IncorrectAnswerNoteState = {
  isModalOpen: false,
  isExitConfirmationVisible: false,
  currentView: 'CHOICE',
  problemData: {
    title: '',
    description: '',
    inputCondition: '',
    outputCondition: '',
    constraints: '',
    url: '',
  },
  submissionType: null,
  codeData: {
    code: '',
    language: 'javascript',
  },
  analysisResult: [],
  selectedAnalysisIndex: 0,
  isLoading: false,
  error: null,
};

export const useIncorrectAnswerNoteStore = create<IncorrectAnswerNoteStore>((set, get) => ({
  ...initialState,

  openModal: () => set({ isModalOpen: true }),

  closeModal: () => set((state) => ({
    ...initialState,
    isModalOpen: false,
  })),

  showExitConfirmation: () => set({ isExitConfirmationVisible: true }),

  hideExitConfirmation: () => set({ isExitConfirmationVisible: false }),

  setCurrentView: (view: ViewType) => set({ currentView: view }),

  setSubmissionType: (type: SubmissionType) => set({ submissionType: type }),

  setProblemData: (data: Partial<ProblemData>) =>
    set((state) => ({
      problemData: { ...state.problemData, ...data }
    })),

  setCodeData: (data: Partial<CodeData>) =>
    set((state) => ({
      codeData: { ...state.codeData, ...data }
    })),

  setAnalysisResult: (results: AnalysisResult[]) => set({ analysisResult: results }),

  setSelectedAnalysisIndex: (index: number) => set({ selectedAnalysisIndex: index }),

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  setError: (error: string | null) => set({ error }),

  resetState: () => set(initialState),

  analyzeCode: async () => {
    set({ isLoading: true, error: null });

    try {
      // Simulate 2-second loading
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate dummy analysis data
      const dummyAnalysis: AnalysisResult[] = [
        {
          title: "1. Initial Variable Declaration and Input Processing",
          description: "This section initializes variables required for the algorithm and reads data via standard input.",
          code: `const fs = require('fs');\nconst input = fs.readFileSync('/dev/stdin').toString().trim().split('\\n');\nconst N = parseInt(input[0]);`
        },
        {
          title: "2. Core Logic: Dynamic Programming (DP)",
          description: "This is the core logic that creates a DP table and solves the problem based on recurrence relations, improving efficiency by reusing previous calculation results.",
          code: `const dp = new Array(N + 1).fill(0);\ndp[1] = 1;\ndp[2] = 2;\nfor (let i = 3; i <= N; i++) {\n  dp[i] = (dp[i-1] + dp[i-2]) % 10007;\n}`
        },
        {
          title: "3. Output Result",
          description: "This section outputs the final value from the calculated DP table in the specified format.",
          code: `console.log(dp[N]);`
        }
      ];

      set({
        analysisResult: dummyAnalysis,
        selectedAnalysisIndex: 0,
        currentView: 'RESULTS',
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Analysis failed',
        isLoading: false
      });
    }
  },
}));
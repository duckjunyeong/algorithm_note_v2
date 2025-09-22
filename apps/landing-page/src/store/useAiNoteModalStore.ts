import { create } from 'zustand';

export type ModalView = 'CHOICE' | 'URL_INPUT' | 'MANUAL_INPUT' | 'CODE_INPUT' | 'RESULTS';
export type SubmissionType = 'url' | 'manual' | null;

export interface ProblemData {
  url?: string;
  title?: string;
  description?: string;
  inputOutput?: string;
  constraints?: string;
}

export interface CodeData {
  code: string;
  language: string;
}

export interface AnalysisUnit {
  title: string;
  description: string;
  code: string;
  selected?: boolean;
}

interface AiNoteModalState {
  isModalOpen: boolean;
  isExitConfirmationVisible: boolean;
  currentView: ModalView;
  problemData: ProblemData;
  submissionType: SubmissionType;
  codeData: CodeData;
  analysisResult: AnalysisUnit[];
  isLoading: boolean;
  error: string | null;
}

interface AiNoteModalActions {
  openModal: () => void;
  closeModal: () => void;
  showExitConfirmation: () => void;
  hideExitConfirmation: () => void;
  setCurrentView: (view: ModalView) => void;
  setSubmissionType: (type: SubmissionType) => void;
  setProblemData: (data: Partial<ProblemData>) => void;
  setCodeData: (data: Partial<CodeData>) => void;
  setAnalysisResult: (result: AnalysisUnit[]) => void;
  toggleAnalysisSelection: (index: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetModal: () => void;
  startAnalysis: () => Promise<void>;
}

type AiNoteModalStore = AiNoteModalState & AiNoteModalActions;

const initialState: AiNoteModalState = {
  isModalOpen: false,
  isExitConfirmationVisible: false,
  currentView: 'CHOICE',
  problemData: {},
  submissionType: null,
  codeData: { code: '', language: 'javascript' },
  analysisResult: [],
  isLoading: false,
  error: null,
};

const generateDummyAnalysis = (): AnalysisUnit[] => [
  {
    title: "1. Initial Variable Declaration and Input Processing",
    description: "This section initializes variables required for the algorithm and reads data via standard input.",
    code: `const fs = require('fs');\nconst input = fs.readFileSync('/dev/stdin').toString().trim().split('\\n');\nconst N = parseInt(input[0]);`,
    selected: false,
  },
  {
    title: "2. Core Logic: Dynamic Programming (DP)",
    description: "This is the core logic that creates a DP table and solves the problem based on recurrence relations, improving efficiency by reusing previous calculation results.",
    code: `const dp = new Array(N + 1).fill(0);\ndp[1] = 1;\ndp[2] = 2;\nfor (let i = 3; i <= N; i++) {\n  dp[i] = (dp[i-1] + dp[i-2]) % 10007;\n}`,
    selected: false,
  },
  {
    title: "3. Output Result",
    description: "This section outputs the final value from the calculated DP table in the specified format.",
    code: `console.log(dp[N]);`,
    selected: false,
  }
];

export const useAiNoteModalStore = create<AiNoteModalStore>((set, get) => ({
  ...initialState,

  openModal: () => set({ isModalOpen: true }),

  closeModal: () => {
    const { resetModal } = get();
    resetModal();
    set({ isModalOpen: false });
  },

  showExitConfirmation: () => set({ isExitConfirmationVisible: true }),

  hideExitConfirmation: () => set({ isExitConfirmationVisible: false }),

  setCurrentView: (view) => set({ currentView: view }),

  setSubmissionType: (type) => set({ submissionType: type }),

  setProblemData: (data) =>
    set((state) => ({
      problemData: { ...state.problemData, ...data }
    })),

  setCodeData: (data) =>
    set((state) => ({
      codeData: { ...state.codeData, ...data }
    })),

  setAnalysisResult: (result) => set({ analysisResult: result }),

  toggleAnalysisSelection: (index) =>
    set((state) => ({
      analysisResult: state.analysisResult.map((unit, i) =>
        i === index ? { ...unit, selected: !unit.selected } : unit
      ),
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  resetModal: () => set(initialState),

  startAnalysis: async () => {
    set({ isLoading: true, error: null });

    try {
      // Simulate API call with 2-second delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const dummyAnalysis = generateDummyAnalysis();
      set({
        analysisResult: dummyAnalysis,
        currentView: 'RESULTS',
        isLoading: false
      });
    } catch (error) {
      set({
        error: 'Failed to analyze code. Please try again.',
        isLoading: false
      });
    }
  },
}));
import { create } from 'zustand';

interface AnalysisStep {
  id: string;
  title: string;
  code: string;
}

interface AnalysisResult {
  problemTitle: string;
  language: string;
  analysis: AnalysisStep[];
}

interface AnalysisState {
  analysisResult: AnalysisResult | null;
}

interface AnalysisActions {
  setAnalysisResult: (result: AnalysisResult) => void;
  clearAnalysisResult: () => void;
}

type AnalysisStore = AnalysisState & AnalysisActions;

const initialState: AnalysisState = {
  analysisResult: null,
};

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  ...initialState,

  setAnalysisResult: (result) =>
    set(() => ({
      analysisResult: result,
    })),

  clearAnalysisResult: () =>
    set(() => ({
      analysisResult: null,
    })),
}));
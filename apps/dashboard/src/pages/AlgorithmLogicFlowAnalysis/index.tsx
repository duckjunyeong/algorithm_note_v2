// AlgorithmLogicFlowAnalysisPage/index.tsx
import type { FC } from 'react';
import { useAlgorithmLogicFlowAnalysisPage } from './useAlgorithmLogicFlowAnalysis';
import { AlgorithmLogicFlowAnalysisPageView } from './AlgorithmLogicFlowAnalysis.view';

const AlgorithmLogicFlowAnalysisPage: FC = () => {
  const { analysisResult, selectedStep, handleSelectStep } = useAlgorithmLogicFlowAnalysisPage();

  return (
    <AlgorithmLogicFlowAnalysisPageView
      analysisResult={analysisResult}
      selectedStep={selectedStep}
      handleSelectStep={handleSelectStep}
    />
  );
};

export default AlgorithmLogicFlowAnalysisPage;
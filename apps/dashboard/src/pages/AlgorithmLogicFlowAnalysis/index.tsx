// AlgorithmLogicFlowAnalysisPage/index.tsx
import type { FC } from 'react';
import { useAlgorithmLogicFlowAnalysisPage } from './useAlgorithmLogicFlowAnalysis';
import { AlgorithmLogicFlowAnalysisPageView } from './AlgorithmLogicFlowAnalysis.view';

const AlgorithmLogicFlowAnalysisPage: FC = () => {
  const {
    analysisResult,
    selectedStep,
    isChatModalOpen,
    chatModalStep,
    chatSessionKey,
    handleSelectStep,
    handleOpenChatModal,
    handleCloseChatModal,
  } = useAlgorithmLogicFlowAnalysisPage();

  return (
    <AlgorithmLogicFlowAnalysisPageView
      analysisResult={analysisResult}
      selectedStep={selectedStep}
      isChatModalOpen={isChatModalOpen}
      chatModalStep={chatModalStep}
      chatSessionKey={chatSessionKey}
      handleSelectStep={handleSelectStep}
      handleOpenChatModal={handleOpenChatModal}
      handleCloseChatModal={handleCloseChatModal}
    />
  );
};

export default AlgorithmLogicFlowAnalysisPage;
// AlgorithmLogicFlowAnalysisPage/useAlgorithmLogicFlowAnalysisPage.ts
import { useState, useEffect } from 'react';
import { useAnalysisStore } from '../../store/useAnalysisStore';

interface AnalysisStep {
  id: string;
  title: string;
  description?: string;
  code: string;
}


export const useAlgorithmLogicFlowAnalysisPage = () => {
  const { analysisResult, clearAnalysisResult } = useAnalysisStore();
  const [selectedStep, setSelectedStep] = useState<AnalysisStep | null>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [chatModalStep, setChatModalStep] = useState<AnalysisStep | null>(null);
  const [chatSessionKey, setChatSessionKey] = useState<string>('');

  useEffect(() => {
    // 분석 결과가 있을 때 첫 번째 단계를 기본 선택
    if (analysisResult?.analysis && analysisResult.analysis.length > 0) {
      setSelectedStep(analysisResult.analysis[0]);
    }
  }, [analysisResult]);

  // 페이지 이탈 시 데이터 정리
  useEffect(() => {
    const handleBeforeUnload = () => {
      clearAnalysisResult();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // 컴포넌트 언마운트 시에도 정리
      clearAnalysisResult();
    };
  }, [clearAnalysisResult]);

  const handleSelectStep = (step: AnalysisStep) => {
    setSelectedStep(step);
  };

  const handleOpenChatModal = (step: AnalysisStep) => {
    setChatModalStep(step);
    setChatSessionKey(Date.now().toString()); // 새로운 세션 키 생성
    setIsChatModalOpen(true);
  };

  const handleCloseChatModal = () => {
    setIsChatModalOpen(false);
    setChatModalStep(null);
    setChatSessionKey(''); // 세션 키 초기화
  };

  return {
    analysisResult,
    selectedStep,
    isChatModalOpen,
    chatModalStep,
    chatSessionKey,
    handleSelectStep,
    handleOpenChatModal,
    handleCloseChatModal,
  };
};
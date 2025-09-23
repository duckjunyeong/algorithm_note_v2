// AlgorithmLogicFlowAnalysisPage/useAlgorithmLogicFlowAnalysisPage.ts
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

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

export const useAlgorithmLogicFlowAnalysisPage = () => {
  const [searchParams] = useSearchParams();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [selectedStep, setSelectedStep] = useState<AnalysisStep | null>(null);

  useEffect(() => {
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const parsedData: AnalysisResult = JSON.parse(decodeURIComponent(dataParam));
        setAnalysisResult(parsedData);
        if (parsedData.analysis && parsedData.analysis.length > 0) {
          setSelectedStep(parsedData.analysis[0]);
        }
      } catch (error) {
        console.error("Failed to parse analysis data from URL:", error);
      }
    }
  }, [searchParams]);

  const handleSelectStep = (step: AnalysisStep) => {
    setSelectedStep(step);
  };

  return {
    analysisResult,
    selectedStep,
    handleSelectStep,
  };
};
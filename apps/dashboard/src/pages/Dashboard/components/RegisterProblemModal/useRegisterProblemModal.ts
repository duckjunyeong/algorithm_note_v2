// RegisterProblemModal/useRegisterProblemModal.ts
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProblemService } from '../../../../services/problemService';
import { useCodeAnalysisService } from '../../../../services/codeAnalysisService';
import { useAnalysisStore } from '../../../../store/useAnalysisStore';
import type { ProblemManualRequest, ProblemUrlRequest } from '../../../../services/problemService';
import type { ApiError } from '../../../../types/api';

// 모달이 보여줄 수 있는 화면들의 타입을 정의합니다.
type ModalView = 'selection' | 'url' | 'manual' | 'editor';

// 유효성 검사 에러 상태를 위한 타입
type Errors = {
  url?: string;
  title?: string;
  description?: string;
  inputCondition?: string;
  outputCondition?: string;
};

export const useRegisterProblemModal = ({ isOpen }: { isOpen: boolean }) => {
  const navigate = useNavigate();
  const problemService = useProblemService();
  const codeAnalysisService = useCodeAnalysisService();
  const { setAnalysisResult } = useAnalysisStore();
  const [view, setView] = useState<ModalView>('selection');

  // 폼 상태
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [inputCondition, setInputCondition] = useState('');
  const [outputCondition, setOutputCondition] = useState('');
  const [constraints, setConstraints] = useState('');

  // 코드 에디터 상태
  const [code, setCode] = useState('// 여기에 코드를 입력하세요.');
  const [language, setLanguage] = useState('javascript');

  // 유효성 검사 에러 상태
  const [errors, setErrors] = useState<Errors>({});

  // API 상태 관리
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // 모달이 열릴 때 모든 상태 초기화
  useEffect(() => {
    if (isOpen) {
      setView('selection');
      setUrl('');
      setTitle('');
      setDescription('');
      setInputCondition('');
      setOutputCondition('');
      setConstraints('');
      setCode('// 여기에 코드를 입력하세요.');
      setLanguage('javascript');
      setErrors({});
      setIsLoading(false);
      setApiError(null);
    }
  }, [isOpen]);

  // View 변경 핸들러
  const goToUrlView = () => setView('url');
  const goToManualView = () => setView('manual');
  const goToSelectionView = () => setView('selection');
  const goToEditorView = () => setView('editor');

  // 입력 핸들러 (입력 시 에러 메시지 제거)
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (errors.url) setErrors(prev => ({ ...prev, url: undefined }));
    if (apiError) setApiError(null);
  };
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (errors.title) setErrors(prev => ({ ...prev, title: undefined }));
    if (apiError) setApiError(null);
  };
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    if (errors.description) setErrors(prev => ({ ...prev, description: undefined }));
    if (apiError) setApiError(null);
  };
  const handleInputConditionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputCondition(e.target.value);
    if (errors.inputCondition) setErrors(prev => ({ ...prev, inputCondition: undefined }));
    if (apiError) setApiError(null);
  };
  const handleOutputConditionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOutputCondition(e.target.value);
    if (errors.outputCondition) setErrors(prev => ({ ...prev, outputCondition: undefined }));
    if (apiError) setApiError(null);
  };
  const handleConstraintsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setConstraints(e.target.value);
  
  // 코드 에디터 핸들러
  const handleCodeChange = (value: string) => setCode(value);
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => setLanguage(e.target.value);

  // 제출 핸들러 (유효성 검사 후 API 호출)
  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setErrors({});

    // 클라이언트 사이드 검증
    const validation = problemService.validateUrl(url);
    if (!validation.isValid) {
      setErrors({ url: validation.error! });
      return;
    }

    setIsLoading(true);

    try {
      const request: ProblemUrlRequest = { url: url.trim() };
      await problemService.registerFromUrl(request);

      console.log(`URL 등록 성공: ${url}`);
      goToEditorView();
    } catch (error) {
      const apiErr = error as ApiError;
      setApiError(apiErr.message);
      console.error('URL 등록 실패:', apiErr);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setErrors({});

    // 클라이언트 사이드 검증
    const requestData: ProblemManualRequest = {
      title: title.trim(),
      description: description.trim(),
      inputCondition: inputCondition.trim(),
      outputCondition: outputCondition.trim(),
      constraints: constraints?.trim() || undefined,
    };

    const validation = problemService.validateManualInput(requestData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);

    try {
      await problemService.registerFromManualInput(requestData);

      console.log(`수동 등록 성공: ${title}`);
      goToEditorView();
    } catch (error) {
      const apiErr = error as ApiError;
      setApiError(apiErr.message);
      console.error('수동 등록 실패:', apiErr);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 분석 시작 및 페이지 이동을 처리하는 함수
  const handleStartAnalysis = async () => {
    setIsLoading(true);
    setApiError(null);

    try {
      // 클라이언트 사이드 검증
      const validation = codeAnalysisService.validateCodeAnalysisRequest({
        code,
        language
      });

      if (!validation.isValid) {
        setApiError(validation.error!);
        return;
      }

      const analysisResponse = await codeAnalysisService.analyzeCode({
        code,
        language
      });

      console.log("분석 시작 성공:", analysisResponse);

      // 응답 데이터를 AlgorithmLogicFlowAnalysis 페이지 형식으로 변환
      const analysisResult = {
        problemTitle: title || 'URL로부터 추출된 문제',
        language: language,
        analysis: analysisResponse.logicalUnits.map((unit, index) => ({
          id: `step${index + 1}`,
          title: unit.unitName,
          description: unit.description,
          code: unit.code
        }))
      };

      // Zustand store에 분석 결과 저장
      setAnalysisResult(analysisResult);

      // 분석 페이지로 네비게이션 (쿼리 파라미터 없이)
      navigate('/algorithm-logic-flow-analysis');

    } catch (error) {
      const apiErr = error as ApiError;
      setApiError(apiErr.message || '코드 분석 중 오류가 발생했습니다.');
      console.error("분석 시작 실패:", apiErr);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    view, url, title, description, inputCondition, outputCondition, constraints, code, language, errors,
    isLoading, apiError,
    goToUrlView, goToManualView, goToSelectionView,
    handleUrlChange, handleTitleChange, handleDescriptionChange, handleInputConditionChange, handleOutputConditionChange, handleConstraintsChange,
    handleCodeChange, handleLanguageChange,
    handleUrlSubmit, handleManualSubmit,
    handleStartAnalysis,
  };
};
// RegisterProblemModal/useRegisterProblemModal.ts
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProblemService } from '../../../../services/problemService';
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
      // 먼저 캐시된 문제 데이터를 영구 저장
      await problemService.saveProblemFromCache();

      // Mock 분석 결과 생성 (향후 실제 AI 분석 API로 교체 예정)
      const mockAnalysisResult = {
        problemTitle: title || 'URL로부터 추출된 문제',
        language: language,
        analysis: [
          { id: 'step1', title: '초기 변수 선언 및 입력값 처리', code: `const fs = require('fs');\nconst input = fs.readFileSync('/dev/stdin').toString().split(' ');` },
          { id: 'step2', title: '알고리즘 핵심 로직: 합계 계산', code: `const a = parseInt(input[0]);\nconst b = parseInt(input[1]);\nconst sum = a + b;` },
          { id: 'step3', title: '결과 출력', code: `console.log(sum);` },
          { id: 'step4', title: '시간 복잡도 분석', code: `// 이 로직의 시간 복잡도는 O(1)입니다.\n// 입력 크기에 관계없이 일정한 수의 연산만 수행합니다.` },
        ]
      };

      const queryString = encodeURIComponent(JSON.stringify(mockAnalysisResult));
      navigate(`/algorithm-logic-flow-analysis?data=${queryString}`);

    } catch (error) {
      const apiErr = error as ApiError;
      setApiError(apiErr.message);
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
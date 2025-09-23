// RegisterProblemModal/useRegisterProblemModal.ts
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
  };
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (errors.title) setErrors(prev => ({ ...prev, title: undefined }));
  };
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    if (errors.description) setErrors(prev => ({ ...prev, description: undefined }));
  };
  const handleInputConditionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputCondition(e.target.value);
    if (errors.inputCondition) setErrors(prev => ({ ...prev, inputCondition: undefined }));
  };
  const handleOutputConditionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOutputCondition(e.target.value);
    if (errors.outputCondition) setErrors(prev => ({ ...prev, outputCondition: undefined }));
  };
  const handleConstraintsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setConstraints(e.target.value);
  
  // 코드 에디터 핸들러
  const handleCodeChange = (value: string) => setCode(value);
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => setLanguage(e.target.value);

  // 제출 핸들러 (유효성 검사 후 View 전환)
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setErrors({ url: '문제 링크(URL)를 입력하세요.' });
      return;
    }
    console.log(`URL 등록: ${url}`);
    goToEditorView();
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Errors = {};
    if (!title.trim()) newErrors.title = '문제 제목을 입력하세요.';
    if (!description.trim()) newErrors.description = '문제 설명을 입력하세요.';
    if (!inputCondition.trim()) newErrors.inputCondition = '입력 조건을 입력하세요.';
    if (!outputCondition.trim()) newErrors.outputCondition = '출력 조건을 입력하세요.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    console.log(`수동 등록: ${title}`);
    goToEditorView();
  };
  
  // 분석 시작 및 페이지 이동을 처리하는 함수
  const handleStartAnalysis = async () => {
    const requestData = {
      problem: { title, description, inputCondition, outputCondition, constraints },
      solution: { code, language },
    };

    try {
      // --- Axios 요청 의사코드 ---
      // const response = await axios.post('/api/analyze', requestData);
      // const analysisResult = response.data;
      
      // Mock 응답 데이터 생성
      const mockAnalysisResult = {
        problemTitle: title || '문제 제목(URL로부터 추출됨)',
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
      console.error("Analysis request failed:", error);
      alert("분석 요청에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return {
    view, url, title, description, inputCondition, outputCondition, constraints, code, language, errors,
    goToUrlView, goToManualView, goToSelectionView,
    handleUrlChange, handleTitleChange, handleDescriptionChange, handleInputConditionChange, handleOutputConditionChange, handleConstraintsChange,
    handleCodeChange, handleLanguageChange,
    handleUrlSubmit, handleManualSubmit,
    handleStartAnalysis,
  };
};
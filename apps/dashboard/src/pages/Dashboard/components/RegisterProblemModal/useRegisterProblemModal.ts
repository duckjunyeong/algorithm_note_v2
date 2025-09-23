// RegisterProblemModal/useRegisterProblemModal.ts
import { useState, useEffect } from 'react';

type ModalView = 'selection' | 'url' | 'manual' | 'editor';

type Errors = {
  url?: string;
  title?: string;
  description?: string;
  inputCondition?: string;
  outputCondition?: string;
};

export const useRegisterProblemModal = ({ isOpen }: { isOpen: boolean }) => {
  const [view, setView] = useState<ModalView>('selection');
  
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [inputCondition, setInputCondition] = useState('');
  const [outputCondition, setOutputCondition] = useState('');
  const [constraints, setConstraints] = useState('');
  
  const [code, setCode] = useState('// 여기에 코드를 입력하세요.');
  const [language, setLanguage] = useState('javascript');
  
  const [errors, setErrors] = useState<Errors>({});

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

  const goToUrlView = () => setView('url');
  const goToManualView = () => setView('manual');
  const goToSelectionView = () => setView('selection');
  const goToEditorView = () => setView('editor');

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
  
  const handleCodeChange = (value: string) => setCode(value);
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => setLanguage(e.target.value);

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

  return {
    view, url, title, description, inputCondition, outputCondition, constraints, code, language, errors,
    goToUrlView, goToManualView, goToSelectionView,
    handleUrlChange, handleTitleChange, handleDescriptionChange, handleInputConditionChange, handleOutputConditionChange, handleConstraintsChange,
    handleCodeChange, handleLanguageChange,
    handleUrlSubmit, handleManualSubmit,
  };
};
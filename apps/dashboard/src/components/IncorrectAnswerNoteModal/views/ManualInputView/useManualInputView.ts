import { useState, useCallback } from 'react';
import { useIncorrectAnswerNoteStore } from '../../../../store/useIncorrectAnswerNoteStore';

interface FormData {
  title: string;
  description: string;
  input: string;
  output: string;
  constraints: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  input?: string;
  output?: string;
}

export function useManualInputView() {
  const { setCurrentView, setProblemData } = useIncorrectAnswerNoteStore();

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    input: '',
    output: '',
    constraints: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleBack = useCallback(() => {
    setCurrentView('CHOICE');
  }, [setCurrentView]);

  const handleInputChange = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'This is a required field.';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'This is a required field.';
    }
    if (!formData.input.trim()) {
      newErrors.input = 'This is a required field.';
    }
    if (!formData.output.trim()) {
      newErrors.output = 'This is a required field.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleNext = useCallback(() => {
    if (validateForm()) {
      setProblemData(formData);
      setCurrentView('CODE_INPUT');
    }
  }, [validateForm, setProblemData, setCurrentView, formData]);

  return {
    formData,
    errors,
    handleBack,
    handleInputChange,
    handleNext
  };
}
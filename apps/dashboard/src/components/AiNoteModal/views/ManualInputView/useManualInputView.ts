import { useState } from 'react';
import { useAiNoteModalStore } from '../../../../store/useAiNoteModalStore';

interface FormData {
  title: string;
  description: string;
  inputOutput: string;
  constraints: string;
}

export function useManualInputView() {
  const { problemData, setProblemData, setCurrentView } = useAiNoteModalStore();

  const [formData, setFormData] = useState<FormData>({
    title: problemData.title || '',
    description: problemData.description || '',
    inputOutput: problemData.inputOutput || '',
    constraints: problemData.constraints || '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Problem title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Problem description is required';
    }

    if (!formData.inputOutput.trim()) {
      newErrors.inputOutput = 'Input/Output conditions are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      setProblemData({
        title: formData.title.trim(),
        description: formData.description.trim(),
        inputOutput: formData.inputOutput.trim(),
        constraints: formData.constraints.trim(),
      });
      setCurrentView('CODE_INPUT');
    }
  };

  const handleBack = () => {
    setCurrentView('CHOICE');
  };

  return {
    formData,
    errors,
    handleInputChange,
    handleNext,
    handleBack,
  };
}
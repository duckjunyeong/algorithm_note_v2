import { useState, useCallback } from 'react';

export interface UseCategoryCreationFormProps {
  onSave: (name: string, color: string) => Promise<void>;
  onCancel: () => void;
}

export function useCategoryCreationForm({
  onSave,
  onCancel,
}: UseCategoryCreationFormProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3B82F6'); // 기본 색상
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (error) setError(''); // 에러 초기화
  }, [error]);

  const handleColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  }, []);

  const handleSubmit = useCallback(async () => {
    // 유효성 검사
    if (!name.trim()) {
      setError('카테고리 이름을 입력해주세요');
      return;
    }

    if (name.length > 100) {
      setError('카테고리 이름은 100자 이내로 작성해주세요');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSave(name.trim(), color);
      // 성공 시 폼 초기화
      setName('');
      setColor('#3B82F6');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('카테고리 생성에 실패했습니다');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [name, color, onSave]);

  const handleCancel = useCallback(() => {
    setName('');
    setColor('#3B82F6');
    setError('');
    onCancel();
  }, [onCancel]);

  return {
    name,
    color,
    error,
    isSubmitting,
    handleNameChange,
    handleColorChange,
    handleSubmit,
    handleCancel,
  };
}

export type { UseCategoryCreationFormProps as CategoryCreationFormProps };

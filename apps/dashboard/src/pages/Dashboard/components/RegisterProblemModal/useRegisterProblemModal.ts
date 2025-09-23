// RegisterProblemModal/useRegisterProblemModal.ts
import { useState, useEffect } from 'react';

type ModalView = 'selection' | 'url' | 'manual';

export const useRegisterProblemModal = ({ isOpen }: { isOpen: boolean }) => {
  const [view, setView] = useState<ModalView>('selection');
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (isOpen) {
      setView('selection');
      setUrl('');
    }
  }, [isOpen]);

  const goToUrlView = () => setView('url');
  const goToManualView = () => setView('manual');
  const goToSelectionView = () => setView('selection');

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      alert(`URL 등록: ${url}`);
    } else {
      alert('URL을 입력해주세요.');
    }
  };

  return {
    view,
    url,
    goToUrlView,
    goToManualView,
    goToSelectionView,
    handleUrlChange,
    handleUrlSubmit,
  };
};
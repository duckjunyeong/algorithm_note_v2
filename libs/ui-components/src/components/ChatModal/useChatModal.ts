// src/components/ChatModal/useChatModal.ts
import { useCallback } from 'react';

export interface ChatModalProps {
  inputText: string;
  onInputChange: (value: string) => void;
  onGenerateClick: () => void;
  onCloseClick: () => void;
}

export function useChatModal({
  inputText,
  onInputChange,
  onGenerateClick,
  onCloseClick,
}: ChatModalProps) {
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onInputChange(e.target.value);
    },
    [onInputChange],
  );

  const handleGenerateClick = useCallback(() => {
    // You can add logic here before calling the passed onGenerateClick
    onGenerateClick();
  }, [onGenerateClick]);

  const handleCloseClick = useCallback(() => {
    // You can add logic here before calling the passed onCloseClick
    onCloseClick();
  }, [onCloseClick]);

  return {
    handleInputChange,
    handleGenerateClick,
    handleCloseClick,
  };
}
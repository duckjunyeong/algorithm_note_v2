import { useChatModal } from './useChatModal';
import { ChatModalView } from './ChatModal.view';
import type { ChatModalProps } from './useChatModal';

export function ChatModal({
  inputText,
  onInputChange,
  onGenerateClick,
  onCloseClick,
}: ChatModalProps) {
  const { handleInputChange, handleGenerateClick, handleCloseClick } = useChatModal({
    inputText,
    onInputChange,
    onGenerateClick,
    onCloseClick,
  });

  return (
    <ChatModalView
      inputText={inputText}
      onInputChange={handleInputChange}
      onGenerateClick={handleGenerateClick}
      onCloseClick={handleCloseClick}
    />
  );
}

export type { ChatModalProps };
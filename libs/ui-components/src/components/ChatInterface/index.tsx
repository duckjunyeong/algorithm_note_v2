import { useChatInterface } from './useChatInterface';
import { ChatInterfaceView } from './ChatInterface.view';
import type { ChatInterfaceProps } from './useChatInterface';

export function ChatInterface(props: ChatInterfaceProps) {
  const {
    inputValue,
    setInputValue,
    isRecording,
    isProcessingAudio,
    messagesEndRef,
    category,
    onCategoryChange,
    handleSendMessage,
    handleKeyPress,
    handleMicClick,
    onBack,
    onClose,
  } = useChatInterface(props);

  return (
    <ChatInterfaceView
      category={category}
      onCategoryChange={onCategoryChange}
      inputValue={inputValue}
      setInputValue={setInputValue}
      isRecording={isRecording}
      isProcessingAudio={isProcessingAudio}
      messages={props.messages}
      isBotTyping={props.isBotTyping}
      messagesEndRef={messagesEndRef}
      onSendMessage={handleSendMessage}
      onKeyPress={handleKeyPress}
      onMicClick={handleMicClick}
      onBack={onBack}
      onClose={onClose}
    />
  );
}

export default ChatInterface;
export type { Message } from './useChatInterface';

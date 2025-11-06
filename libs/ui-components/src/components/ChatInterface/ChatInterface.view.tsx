import { ArrowLeft, X, Mic, Send } from 'lucide-react';
import type { Message } from './useChatInterface';

export interface ChatInterfaceViewProps {
  category: string;
  onCategoryChange: (category: string) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  isRecording: boolean;
  isProcessingAudio: boolean;
  messages: Message[];
  isBotTyping: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onMicClick: () => void;
  onBack: () => void;
  onClose: () => void;
}

export function ChatInterfaceView({
  category,
  onCategoryChange,
  inputValue,
  setInputValue,
  isRecording,
  isProcessingAudio,
  messages,
  isBotTyping,
  messagesEndRef,
  onSendMessage,
  onKeyPress,
  onMicClick,
  onBack,
  onClose,
}: ChatInterfaceViewProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-3xl mx-4 bg-background-primary rounded-lg shadow-xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-secondary flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-neutral-50"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-xl font-semibold text-text-primary">
              새 태스크 생성
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-neutral-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Category Input */}
        <div className="p-4 border-b border-border-secondary flex-shrink-0">
          <input
            type="text"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            placeholder="분야 (예: 컴퓨터 공학, 미술사)"
            className="w-full p-2 border border-border-secondary rounded-base focus:outline-none focus:ring-2 focus:ring-primary-blue text-text-primary bg-background-primary"
          />
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background-primary">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-primary-blue text-white rounded-tr-none'
                    : 'bg-background-secondary text-text-primary rounded-tl-none'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}

          {/* Bot Typing Indicator */}
          {isBotTyping && (
            <div className="flex justify-start">
              <div className="bg-background-secondary p-3 rounded-lg rounded-tl-none text-text-secondary animate-pulse">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-text-secondary rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-text-secondary rounded-full animate-bounce"
                    style={{ animationDelay: '0.4s' }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Footer */}
        <div className="p-4 border-t border-border-secondary flex-shrink-0">
          <div className="flex items-end gap-2">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={onKeyPress}
              placeholder="답변을 입력하세요..."
              rows={2}
              className="flex-grow resize-none p-3 border border-border-secondary rounded-base focus:outline-none focus:ring-2 focus:ring-primary-blue text-text-primary bg-background-primary"
              disabled={isRecording || isProcessingAudio}
            />

            {/* Voice Recording Button */}
            <button
              onClick={onMicClick}
              disabled={isProcessingAudio}
              className={`p-3 rounded-base transition-colors duration-base ease ${
                isRecording
                  ? 'bg-semantic-error text-white'
                  : isProcessingAudio
                  ? 'bg-primary-blue text-white animate-spin'
                  : 'text-text-secondary hover:bg-background-tertiary'
              } ${isProcessingAudio ? 'cursor-not-allowed' : ''}`}
            >
              <Mic size={20} />
            </button>

            {/* Send Button */}
            <button
              onClick={onSendMessage}
              disabled={!inputValue.trim() || isRecording || isProcessingAudio}
              className={`p-3 rounded-base transition-colors duration-base ease ${
                inputValue.trim() && !isRecording && !isProcessingAudio
                  ? 'bg-primary-blue text-white hover:bg-primary-blueHover'
                  : 'bg-background-tertiary text-text-tertiary cursor-not-allowed'
              }`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

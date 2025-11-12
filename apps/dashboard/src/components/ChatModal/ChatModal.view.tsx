import React, { useState, useRef, useEffect } from 'react';
import { Info, Maximize, X, Send } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const TYPING_SPEED_MS = 15;

interface TypingMessageProps {
  fullText: string;
  onComplete: () => void;
}

const TypingMessage: React.FC<TypingMessageProps> = ({ fullText, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    let i = 0;
    const intervalId = setInterval(() => {
      if (i < fullText.length) {
        setDisplayedText(fullText.substring(0, i + 1));
        i++;
      } else {
        clearInterval(intervalId);
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }
    }, TYPING_SPEED_MS);

    return () => clearInterval(intervalId);
  }, [fullText]);

  return <>{displayedText}</>;
};

interface MessageProps {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  isTyping?: boolean;
}

interface ChatModalViewProps {
  isOpen: boolean;
  onClose: () => void;
  onBackgroundClick: () => void;
  title: string;
  messages: MessageProps[];
  inputValue: string;
  loading: boolean;
  initLoading: boolean;
  sessionId: string | null;
  chatAreaRef: React.RefObject<HTMLDivElement>;
  recommendedQuestions: string[];
  showSaveButton: boolean;
  setInputValue: (value: string) => void;
  handleSendMessage: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleRecommendationClick: (question: string) => void;
  handleTypingComplete: (messageId: number, index: number) => void;
  handleSaveNote: () => void;
}

export const ChatModalView: React.FC<ChatModalViewProps> = ({
  isOpen,
  onClose,
  onBackgroundClick,
  title,
  messages,
  inputValue,
  loading,
  initLoading,
  sessionId,
  chatAreaRef,
  recommendedQuestions,
  showSaveButton,
  setInputValue,
  handleSendMessage,
  handleKeyDown,
  handleRecommendationClick,
  handleTypingComplete,
  handleSaveNote
}) => {
  const isSessionReady = sessionId !== null;
  const isInputDisabled = initLoading || (!isSessionReady && messages.length === 0);
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="prose prose-sm max-w-none leading-normal">
          {/* GlobalStyle equivalent - Tailwind handles global styles */}
          <motion.div
            className="fixed inset-0 bg-neutral-black bg-opacity-70 flex items-center justify-center z-[1000]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onBackgroundClick || onClose}
          >
            <motion.div
              className="bg-white text-text-primary rounded-2xl border border-neutral-200 shadow-xl w-[90%] max-w-2xl h-[85vh] flex flex-col overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-5 md:px-6 border-b border-neutral-100 flex-shrink-0">
                <div className="flex items-center gap-3 text-lg font-semibold">
                  <span>{title}</span>
                  <span className="bg-neutral-50 text-text-tertiary text-xs font-medium px-2 py-1 rounded-lg flex items-center gap-1">
                    <Info size={14} /> 무료 버전 적용중
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="bg-transparent border-none text-text-secondary cursor-pointer p-2 rounded hover:bg-neutral-50 hover:text-text-primary transition-colors">
                    <Maximize size={18} />
                  </button>
                  <button
                    className="bg-transparent border-none text-text-secondary cursor-pointer p-2 rounded hover:bg-neutral-50 hover:text-text-primary transition-colors"
                    onClick={onClose}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div
                ref={chatAreaRef}
                className="flex-grow overflow-y-auto p-4 md:px-6 flex flex-col gap-6
                           scrollbar-thin scrollbar-thumb-neutral-200 scrollbar-track-neutral-50
                           hover:scrollbar-thumb-neutral-300"
              >
                {messages.map((msg, index) => (
                  <div
                    key={msg.id}
                    className={`flex gap-4 max-w-[85%] ${
                      msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start flex-row'
                    }`}
                  >
                    {msg.sender === 'bot' && (
                      <div className="w-9 h-9 rounded-full bg-neutral-100 border-2 border-neutral-200 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                        🤖
                      </div>
                    )}
                    <div
                      className={`p-3 px-5 ${
                        msg.sender === 'user'
                          ? 'bg-neutral-50 text-text-primary rounded-2xl rounded-tr-sm font-normal'
                          : 'text-text-primary font-light antialiased'
                      } leading-relaxed text-sm whitespace-pre-wrap`}
                    >
                    {msg.sender === 'bot' ? (
                        !msg.isTyping ? (
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        ) : msg.text ? (
                          msg.text
                        ) : (
                          <div className="inline-flex gap-1">
                            <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-[typing_1.4s_infinite_ease-in-out_0s]"></span>
                            <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-[typing_1.4s_infinite_ease-in-out_0.2s]"></span>
                            <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-[typing_1.4s_infinite_ease-in-out_0.4s]"></span>
                          </div>
                        )
                      ) : (
                        msg.text
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {messages.length <= 1 && !loading && (
                <div className="p-4 md:px-6 pt-0 flex flex-wrap justify-end gap-2.5">
                  {recommendedQuestions.map((q, i) => (
                    <button
                      key={i}
                      className="bg-neutral-50 text-text-secondary border border-neutral-200 rounded-2xl px-4 py-2 text-sm cursor-pointer transition-colors hover:bg-neutral-100"
                      onClick={() => handleRecommendationClick(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              <div className="p-4 md:px-6 border-t border-neutral-100 bg-white flex-shrink-0">
                {initLoading && (
                  <div className="text-center text-sm text-text-secondary mb-2">
                    채팅을 초기화하는 중...
                  </div>
                )}
                <div className="relative flex items-center bg-background-primary border border-neutral-200 rounded-lg transition-colors focus-within:border-brand">
                  <textarea
                    placeholder={isInputDisabled ? "채팅 세션을 초기화하는 중입니다..." : "메시지를 입력하세요..."}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    disabled={isInputDisabled}
                    className="w-full bg-transparent border-none text-text-primary text-sm resize-none p-3 px-5 leading-normal min-h-[52px] max-h-[200px] placeholder-text-tertiary focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || loading || isInputDisabled}
                    className="bg-brand border-none text-white rounded px-2 w-9 h-9 flex items-center justify-center cursor-pointer mr-2 transition-colors hover:bg-brand-light disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-brand"
                  >
                    <Send size={18} />
                  </button>
                </div>
                {showSaveButton && (
                  <div className="pt-3 flex justify-end pr-2">
                    <button
                      onClick={handleSaveNote}
                      disabled={loading}
                      className="bg-brand text-white border-none rounded-lg px-6 py-3 text-sm font-medium cursor-pointer transition-colors hover:bg-brand-light disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      저장
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
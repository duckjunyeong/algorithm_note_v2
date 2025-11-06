import React, { useState, useRef, useEffect } from 'react';
import { Info, Maximize, X, Send } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Constants
const TYPING_SPEED_MS = 15;

// --- Helper Component for Typing Animation ---
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

// --- Interfaces ---
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

// --- Main Component ---
export const ChatModalView: React.FC<ChatModalViewProps> = ({
  isOpen,
  onClose,
  onBackgroundClick,
  title,
  messages,
  inputValue,
  loading,
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
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* GlobalStyle equivalent - Tailwind handles global styles */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[1000]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onBackgroundClick || onClose}
          >
            <motion.div
              className="bg-[#1a1a1a] text-gray-200 rounded-2xl border border-gray-700 shadow-xl w-[90%] max-w-2xl h-[85vh] flex flex-col overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-5 md:px-6 border-b border-gray-700 flex-shrink-0">
                <div className="flex items-center gap-3 text-lg font-semibold">
                  <span>{title}</span>
                  <span className="bg-gray-800 text-gray-400 text-xs font-medium px-2 py-1 rounded-lg flex items-center gap-1">
                    <Info size={14} /> 무료 버전 적용중
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="bg-transparent border-none text-gray-400 cursor-pointer p-2 rounded hover:bg-gray-800 hover:text-gray-200 transition-colors">
                    <Maximize size={18} />
                  </button>
                  <button
                    className="bg-transparent border-none text-gray-400 cursor-pointer p-2 rounded hover:bg-gray-800 hover:text-gray-200 transition-colors"
                    onClick={onClose}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div
                ref={chatAreaRef}
                className="flex-grow overflow-y-auto p-4 md:px-6 flex flex-col gap-6
                           scrollbar-thin scrollbar-thumb-[#2a2a2a] scrollbar-track-[#1a1a1a]
                           hover:scrollbar-thumb-[#404040]"
              >
                {messages.map((msg, index) => (
                  <div
                    key={msg.id}
                    className={`flex gap-4 max-w-[85%] ${
                      msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start flex-row'
                    }`}
                  >
                    {msg.sender === 'bot' && (
                      <div className="w-9 h-9 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                        🤖
                      </div>
                    )}
                    <div
                      className={`p-3 px-5 bg-gray-800 text-gray-200 rounded-2xl leading-relaxed text-sm font-normal whitespace-pre-wrap
                                 ${msg.sender === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}
                    >
                      {msg.sender === 'bot' && msg.isTyping ? (
                        <TypingMessage
                          fullText={msg.text}
                          onComplete={() => handleTypingComplete(msg.id, index)}
                        />
                      ) : (
                        msg.text
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-4 max-w-[85%] self-start mb-2">
                    <div className="w-9 h-9 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                      🤖
                    </div>
                    <div className="p-3 px-5 bg-gray-800 text-gray-200 rounded-2xl rounded-tl-sm flex items-center gap-2 text-sm">
                      <div className="inline-flex gap-1">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-[typing_1.4s_infinite_ease-in-out_0s]"></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-[typing_1.4s_infinite_ease-in-out_0.2s]"></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-[typing_1.4s_infinite_ease-in-out_0.4s]"></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {messages.length <= 1 && !loading && (
                <div className="p-4 md:px-6 pt-0 flex flex-wrap justify-end gap-2.5">
                  {recommendedQuestions.map((q, i) => (
                    <button
                      key={i}
                      className="bg-gray-700 text-gray-200 border border-gray-700 rounded-2xl px-4 py-2 text-sm cursor-pointer transition-colors hover:bg-gray-800"
                      onClick={() => handleRecommendationClick(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              <div className="p-4 md:px-6 border-t border-gray-700 bg-[#1a1a1a] flex-shrink-0">
                <div className="relative flex items-center bg-gray-800 border border-gray-700 rounded-lg transition-colors focus-within:border-blue-500">
                  <textarea
                    placeholder="메시지를 입력하세요..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    className="w-full bg-transparent border-none text-gray-200 text-sm resize-none p-3 px-5 leading-normal min-h-[52px] max-h-[200px] placeholder-gray-500 focus:outline-none"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || loading}
                    className="bg-gray-700 border-none text-gray-200 rounded px-2 w-9 h-9 flex items-center justify-center cursor-pointer mr-2 transition-colors hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-700"
                  >
                    <Send size={18} />
                  </button>
                </div>
                {showSaveButton && (
                  <div className="pt-3 flex justify-end pr-2">
                    <button
                      onClick={handleSaveNote}
                      disabled={loading}
                      className="bg-blue-600 text-white border-none rounded-lg px-6 py-3 text-sm font-medium cursor-pointer transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      저장
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
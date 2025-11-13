import React from 'react';
import { Info, Maximize, X, Send, Mic, MicOff, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { SelectableList } from './SelectableList';

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
  mode: 'question-generation' | 'review-test';
  messages: MessageProps[];
  inputValue: string;
  loading: boolean;
  initLoading: boolean;
  sessionId: string | null;
  chatAreaRef: React.RefObject<HTMLDivElement | null>;
  recommendedQuestions: string[];
  showSaveButton: boolean;
  showGenerateButton: boolean;
  setInputValue: (value: string) => void;
  handleSendMessage: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleRecommendationClick: (question: string) => void;
  handleSaveNote: () => void;
  handleGenerateQuestions: () => void;
  handleSelectItems: (selectedNumbers: number[]) => void;
  audioRecorder: {
    isRecording: boolean;
    isUploading: boolean;
    isTranscribing: boolean;
    error: string | null;
    toggleRecording: () => void;
  };
}

export const ChatModalView: React.FC<ChatModalViewProps> = ({
  isOpen,
  onClose,
  onBackgroundClick,
  title,
  mode,
  messages,
  inputValue,
  loading,
  initLoading,
  sessionId,
  chatAreaRef,
  recommendedQuestions,
  showSaveButton,
  showGenerateButton,
  setInputValue,
  handleSendMessage,
  handleKeyDown,
  handleRecommendationClick,
  handleSaveNote,
  handleGenerateQuestions,
  handleSelectItems,
  audioRecorder
}) => {
  const isSessionReady = sessionId !== null;
  const isInputDisabled = initLoading || (!isSessionReady && messages.length === 0) ||
                          audioRecorder.isRecording || audioRecorder.isUploading || audioRecorder.isTranscribing;
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
              className="relative bg-white text-text-primary rounded-2xl border border-neutral-200 shadow-xl w-[90%] max-w-2xl h-[85vh] flex flex-col overflow-hidden"
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
                {messages.map((msg) => (
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
                          msg.text.includes('## ✅') ? (
                            <>
                              <ReactMarkdown>{msg.text.split('## ✅')[0]}</ReactMarkdown>
                              <SelectableList
                                content={msg.text}
                                onSelect={handleSelectItems}
                              />
                            </>
                          ) : (
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                          )
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
                <div className="flex gap-2 items-center">
                  <div className="relative flex items-center flex-1 bg-background-primary border border-neutral-200 rounded-lg transition-colors focus-within:border-brand">
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

                  {/* 마이크 버튼 */}
                  <button
                    onClick={audioRecorder.toggleRecording}
                    disabled={isInputDisabled && !audioRecorder.isRecording}
                    className={`border-none rounded px-2 w-9 h-9 flex items-center justify-center cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 ${
                      audioRecorder.isRecording
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-brand text-white hover:bg-brand-light disabled:bg-brand'
                    }`}
                    aria-label={
                      audioRecorder.isRecording
                        ? '녹음 중지'
                        : audioRecorder.isUploading
                        ? '업로드 중'
                        : audioRecorder.isTranscribing
                        ? 'STT 처리 중'
                        : '음성 녹음'
                    }
                  >
                    {audioRecorder.isRecording ? (
                      <MicOff size={18} />
                    ) : audioRecorder.isUploading || audioRecorder.isTranscribing ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Mic size={18} />
                    )}
                  </button>
                </div>

                {/* "생성하기" 또는 "제출하기" 버튼 - 입력 영역 아래 */}
                {showGenerateButton && (
                  <div className="pt-3 flex justify-end">
                    <button
                      onClick={handleGenerateQuestions}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors font-medium text-sm"
                    >
                      {mode === 'review-test' ? '제출하기' : '생성하기'}
                    </button>
                  </div>
                )}

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
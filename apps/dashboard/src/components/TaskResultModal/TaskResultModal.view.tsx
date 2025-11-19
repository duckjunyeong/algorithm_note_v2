import { X } from 'lucide-react';
import type { QuestionConversation } from './utils/conversationParser';

interface TaskResultModalViewProps {
  isOpen: boolean;
  questions: QuestionConversation[];
  currentQuestionIndex: number;
  currentQuestion: QuestionConversation | undefined;
  hasEvaluated: boolean;
  canComplete: boolean;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  onClose: () => void;
  onEvaluate: (result: 'SUCCESS' | 'FAILURE') => void;
  onComplete: () => void;
}

export const TaskResultModalView = ({
  isOpen,
  questions,
  currentQuestionIndex,
  currentQuestion,
  hasEvaluated,
  canComplete,
  isLoading,
  isSaving,
  error,
  onClose,
  onEvaluate,
  onComplete
}: TaskResultModalViewProps) => {
  if (!isOpen) 
    {
      console.log('Modal is closed');
      return null;
    }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-neutral-black bg-opacity-70">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white text-text-primary rounded-2xl border border-neutral-200 shadow-xl flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-5 md:px-6 border-b border-neutral-100 flex-shrink-0">
          <div className="flex items-center gap-3 text-lg font-semibold">
            <span>테스트 결과 평가</span>
            {questions.length > 0 && (
              <span className="bg-neutral-50 text-text-tertiary text-xs font-medium px-2 py-1 rounded-lg">
                Question {currentQuestionIndex + 1} / {questions.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-text-secondary cursor-pointer p-2 rounded hover:bg-neutral-50 hover:text-text-primary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto"></div>
              <p className="mt-4 text-text-secondary">대화 내역을 불러오는 중...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center">
              <p className="text-semantic-error">{error}</p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors text-text-primary"
              >
                닫기
              </button>
            </div>
          </div>
        ) : !currentQuestion ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <p className="text-text-secondary">질문을 찾을 수 없습니다.</p>
          </div>
        ) : (
          <>
            <div className="flex-grow overflow-y-auto p-4 md:px-6 flex flex-col gap-6 scrollbar-thin scrollbar-thumb-neutral-200 scrollbar-track-neutral-50 hover:scrollbar-thumb-neutral-300">
              <div className="mb-2">
                <h3 className="text-lg font-semibold text-text-primary">
                  {currentQuestion.questionText}
                </h3>
              </div>

              <div className="space-y-4">
                {currentQuestion.messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.role === 'user'
                          ? 'bg-brand text-white'
                          : 'bg-neutral-50 text-text-primary'
                      }`}
                    >
                      <div className="text-xs font-semibold mb-2 opacity-70">
                        {message.role === 'user' ? 'You' : 'AI Tutor'}
                      </div>
                      <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => onEvaluate('FAILURE')}
                disabled={isSaving || hasEvaluated}
                className="px-6 py-3 bg-semantic-error text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? '저장 중...' : '실패'}
              </button>
              <button
                type="button"
                onClick={() => onEvaluate('SUCCESS')}
                disabled={isSaving || hasEvaluated}
                className="px-6 py-3 bg-semantic-success text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? '저장 중...' : '성공'}
              </button>
              {canComplete && (
                <button
                  type="button"
                  onClick={onComplete}
                  disabled={isSaving}
                  className="px-6 py-3 bg-brand text-white rounded-lg font-medium hover:bg-brand-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSaving ? '저장 중...' : '완료'}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

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
    <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-lg shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-800">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              테스트 결과 평가
            </h2>
            {questions.length > 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Question {currentQuestionIndex + 1} / {questions.length}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-500 dark:text-gray-400">대화 내역을 불러오는 중...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center">
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        ) : !currentQuestion ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <p className="text-gray-500 dark:text-gray-400">질문을 찾을 수 없습니다.</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
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
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
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

            <div className="flex justify-end gap-3 p-6 border-t dark:border-gray-800">
              <button
                type="button"
                onClick={() => onEvaluate('FAILURE')}
                disabled={isSaving || hasEvaluated}
                className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? '저장 중...' : '실패'}
              </button>
              <button
                type="button"
                onClick={() => onEvaluate('SUCCESS')}
                disabled={isSaving || hasEvaluated}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? '저장 중...' : '성공'}
              </button>
              {canComplete && (
                <button
                  type="button"
                  onClick={onComplete}
                  disabled={isSaving}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
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

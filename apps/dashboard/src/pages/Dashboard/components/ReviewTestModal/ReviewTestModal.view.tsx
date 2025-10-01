import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import type { Answer, EvaluationResult } from '../../../../schemas/answer.schema';

interface ReviewQuestion {
  reviewQuestionId: number;
  questionText: string;
}

export interface ReviewTestModalViewProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: 'input' | 'evaluation';
  currentQuestion: ReviewQuestion | null;
  answerInput: string;
  setAnswerInput: (value: string) => void;
  previousAnswers: Answer[];
  currentAnswerIndex: number;
  isLoadingQuestions: boolean;
  isLoadingAnswers: boolean;
  isSavingAnswer: boolean;
  isPrevAnswerDisabled: boolean;
  isNextAnswerDisabled: boolean;
  onSubmitAnswer: () => void;
  onPrevAnswer: () => void;
  onNextAnswer: () => void;
  onEvaluate: (result: EvaluationResult) => void;
}

export function ReviewTestModalView({
  isOpen,
  onClose,
  currentView,
  currentQuestion,
  answerInput,
  setAnswerInput,
  previousAnswers,
  currentAnswerIndex,
  isLoadingQuestions,
  isLoadingAnswers,
  isSavingAnswer,
  isPrevAnswerDisabled,
  isNextAnswerDisabled,
  onSubmitAnswer,
  onPrevAnswer,
  onNextAnswer,
  onEvaluate,
}: ReviewTestModalViewProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">복습 테스트</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoadingQuestions ? (
            <LoadingView message="질문을 불러오고 있습니다..." />
          ) : currentQuestion ? (
            currentView === 'input' ? (
              <InputView
                questionText={currentQuestion.questionText}
                answerInput={answerInput}
                setAnswerInput={setAnswerInput}
                onSubmit={onSubmitAnswer}
              />
            ) : (
              <EvaluationView
                currentAnswer={answerInput}
                previousAnswers={previousAnswers}
                currentAnswerIndex={currentAnswerIndex}
                isLoadingAnswers={isLoadingAnswers}
                isSavingAnswer={isSavingAnswer}
                isPrevDisabled={isPrevAnswerDisabled}
                isNextDisabled={isNextAnswerDisabled}
                onPrev={onPrevAnswer}
                onNext={onNextAnswer}
                onEvaluate={onEvaluate}
              />
            )
          ) : (
            <EmptyView />
          )}
        </div>
      </div>
    </div>
  );
}

/* Input View Component */
interface InputViewProps {
  questionText: string;
  answerInput: string;
  setAnswerInput: (value: string) => void;
  onSubmit: () => void;
}

function InputView({ questionText, answerInput, setAnswerInput, onSubmit }: InputViewProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="space-y-4">
      {/* Question */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">질문</h3>
        <p className="text-gray-900">{questionText}</p>
      </div>

      {/* Answer Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          답변을 입력하세요
        </label>
        <textarea
          value={answerInput}
          onChange={(e) => setAnswerInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="답변을 입력하세요... (Ctrl+Enter로 제출)"
          rows={8}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500">Ctrl + Enter</span>
          <button
            onClick={onSubmit}
            disabled={!answerInput.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            제출하기
          </button>
        </div>
      </div>
    </div>
  );
}

/* Evaluation View Component */
interface EvaluationViewProps {
  currentAnswer: string;
  previousAnswers: Answer[];
  currentAnswerIndex: number;
  isLoadingAnswers: boolean;
  isSavingAnswer: boolean;
  isPrevDisabled: boolean;
  isNextDisabled: boolean;
  onPrev: () => void;
  onNext: () => void;
  onEvaluate: (result: EvaluationResult) => void;
}

function EvaluationView({
  currentAnswer,
  previousAnswers,
  currentAnswerIndex,
  isLoadingAnswers,
  isSavingAnswer,
  isPrevDisabled,
  isNextDisabled,
  onPrev,
  onNext,
  onEvaluate,
}: EvaluationViewProps) {
  const displayedPreviousAnswer = previousAnswers[currentAnswerIndex];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 min-h-[400px]">
        {/* Left: Previous Answers */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h3 className="text-sm font-medium text-gray-700 mb-3">이전 답변</h3>
          {isLoadingAnswers ? (
            <LoadingView message="이전 답변을 불러오는 중..." />
          ) : previousAnswers.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-gray-500">
              이전 답변이 없습니다.
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-white border border-gray-200 rounded p-3">
                <p className="text-sm text-gray-900 whitespace-pre-wrap">
                  {displayedPreviousAnswer.content}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      displayedPreviousAnswer.evaluationResult === 'SUCCESS'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {displayedPreviousAnswer.evaluationResult === 'SUCCESS' ? '성공' : '실패'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(displayedPreviousAnswer.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={onPrev}
                  disabled={isPrevDisabled}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiChevronLeft size={16} />
                  이전
                </button>
                <span className="text-xs text-gray-600">
                  {currentAnswerIndex + 1} / {previousAnswers.length}
                </span>
                <button
                  onClick={onNext}
                  disabled={isNextDisabled}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  다음
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Current Answer */}
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <h3 className="text-sm font-medium text-gray-700 mb-3">현재 답변</h3>
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <p className="text-sm text-gray-900 whitespace-pre-wrap">{currentAnswer}</p>
          </div>
        </div>
      </div>

      {/* Evaluation Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          onClick={() => onEvaluate('FAILURE')}
          disabled={isSavingAnswer}
          className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isSavingAnswer ? '저장 중...' : '실패'}
        </button>
        <button
          onClick={() => onEvaluate('SUCCESS')}
          disabled={isSavingAnswer}
          className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isSavingAnswer ? '저장 중...' : '성공'}
        </button>
      </div>
    </div>
  );
}

/* Loading View */
interface LoadingViewProps {
  message?: string;
}

function LoadingView({ message = '로딩 중...' }: LoadingViewProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-sm text-gray-600">{message}</p>
    </div>
  );
}

/* Empty View */
function EmptyView() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <p className="text-gray-600">질문이 없습니다.</p>
    </div>
  );
}

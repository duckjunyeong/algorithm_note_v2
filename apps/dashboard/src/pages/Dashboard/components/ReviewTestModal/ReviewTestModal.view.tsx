import { FiX, FiChevronLeft, FiChevronRight, FiTrash } from 'react-icons/fi';
import type { Answer, EvaluationResult } from '../../../../schemas/answer.schema';

interface ReviewQuestion {
  reviewQuestionId: number;
  questionText: string;
}

export interface ReviewTestModalViewProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: 'input' | 'evaluation' | 'result';
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
  // Result View props
  questions?: ReviewQuestion[];
  deletedQuestionIds?: Set<number>;
  localSettings?: {
    category: string;
    importance: number;
    reviewCycle: number;
  };
  questionResults?: Map<number, { successCount: number; failCount: number }>;
  onDeleteQuestion?: (questionId: number) => void;
  onSettingChange?: (field: string, value: string | number) => void;
  onSave?: () => void;
  isSaving?: boolean;
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
  questions,
  deletedQuestionIds,
  localSettings,
  questionResults,
  onDeleteQuestion,
  onSettingChange,
  onSave,
  isSaving,
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
          ) : currentView === 'result' ? (
            <ResultView
              questions={questions || []}
              deletedQuestionIds={deletedQuestionIds || new Set()}
              localSettings={localSettings || { category: '', importance: 3, reviewCycle: 7 }}
              questionResults={questionResults || new Map()}
              onDeleteQuestion={onDeleteQuestion || (() => {})}
              onSettingChange={onSettingChange || (() => {})}
              onSave={onSave || (() => {})}
              isSaving={isSaving || false}
            />
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

/* Result View Component */
interface ResultViewProps {
  questions: ReviewQuestion[];
  deletedQuestionIds: Set<number>;
  localSettings: {
    category: string;
    importance: number;
    reviewCycle: number;
  };
  questionResults: Map<number, { successCount: number; failCount: number }>;
  onDeleteQuestion: (questionId: number) => void;
  onSettingChange: (field: string, value: string | number) => void;
  onSave: () => void;
  isSaving: boolean;
}

function ResultView({
  questions,
  deletedQuestionIds,
  localSettings,
  questionResults,
  onDeleteQuestion,
  onSettingChange,
  onSave,
  isSaving,
}: ResultViewProps) {
  const remainingQuestions = questions.filter(q => !deletedQuestionIds.has(q.reviewQuestionId));
  const isAllQuestionsDeleted = remainingQuestions.length === 0;

  return (
    <div className="space-y-4">
      {/* Main Content: Questions + Settings */}
      <div className="grid grid-cols-2 gap-4 min-h-[400px]">
        {/* Left: Question List */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 overflow-y-auto max-h-[500px]">
          <h3 className="text-sm font-medium text-gray-700 mb-3">질문 목록</h3>
          {questions.length === 0 ? (
            <EmptyView />
          ) : (
            <div className="space-y-2">
              {questions.map((question) => {
                const isDeleted = deletedQuestionIds.has(question.reviewQuestionId);
                const result = questionResults.get(question.reviewQuestionId) || { successCount: 0, failCount: 0 };

                // Determine background color based on results
                let bgColor = 'bg-white';
                if (!isDeleted) {
                  if (result.successCount > 0 && result.failCount === 0) {
                    bgColor = 'bg-green-50';
                  } else if (result.failCount > 0 && result.successCount === 0) {
                    bgColor = 'bg-red-50';
                  } else if (result.successCount > 0 && result.failCount > 0) {
                    bgColor = 'bg-yellow-50';
                  }
                }
                if (isDeleted) bgColor = 'bg-gray-100';

                return (
                  <div
                    key={question.reviewQuestionId}
                    className={`${bgColor} p-3 rounded-lg border ${
                      isDeleted ? 'border-gray-300 opacity-60' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p
                          className={`text-sm mb-2 ${
                            isDeleted ? 'line-through text-gray-500' : 'text-gray-900'
                          }`}
                        >
                          {question.questionText}
                        </p>

                        {/* Display counts for each question */}
                        {!isDeleted && (result.successCount > 0 || result.failCount > 0) && (
                          <div className="flex gap-2 mt-2">
                            {result.successCount > 0 && (
                              <span className="inline-flex items-center text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                                성공 {result.successCount}회
                              </span>
                            )}
                            {result.failCount > 0 && (
                              <span className="inline-flex items-center text-xs px-2 py-1 bg-red-100 text-red-800 rounded">
                                실패 {result.failCount}회
                              </span>
                            )}
                          </div>
                        )}

                        {isDeleted && (
                          <span className="inline-block text-xs px-2 py-1 bg-red-100 text-red-700 rounded">
                            삭제됨
                          </span>
                        )}
                      </div>

                      {!isDeleted && (
                        <button
                          onClick={() => onDeleteQuestion(question.reviewQuestionId)}
                          className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <FiTrash size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Warning for all deleted */}
          {isAllQuestionsDeleted && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ 모든 질문이 삭제되었습니다. 저장 시 이 카드는 영구히 삭제됩니다.
              </p>
            </div>
          )}
        </div>

        {/* Right: Settings Panel */}
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <h3 className="text-sm font-medium text-gray-700 mb-4">설정</h3>
          <div className="space-y-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                카테고리
              </label>
              <input
                type="text"
                value={localSettings.category}
                onChange={(e) => onSettingChange('category', e.target.value)}
                placeholder="카테고리 입력"
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Importance Slider */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                중요도: {localSettings.importance}/5
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={localSettings.importance}
                onChange={(e) => onSettingChange('importance', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1</span>
                <span>5</span>
              </div>
            </div>

            {/* Review Cycle Slider */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                복습 주기: {localSettings.reviewCycle}일
              </label>
              <input
                type="range"
                min="1"
                max="365"
                value={localSettings.reviewCycle}
                onChange={(e) => onSettingChange('reviewCycle', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1일</span>
                <span>365일</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {isSaving && (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          {isSaving ? '저장 중...' : '저장하기'}
        </button>
      </div>

      {/* Slider Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .slider::-webkit-slider-track {
          background: #E5E7EB;
          border-radius: 8px;
          height: 8px;
        }

        .slider::-moz-range-track {
          background: #E5E7EB;
          border-radius: 8px;
          height: 8px;
        }
      `}</style>
    </div>
  );
}

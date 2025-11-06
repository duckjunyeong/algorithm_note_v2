import { FiChevronLeft, FiChevronRight, FiTrash } from 'react-icons/fi';
import type { Answer, EvaluationResult } from '../../../../../../schemas/answer.schema';
import { CategorySelector } from '../../../../../../../../../libs/ui-components/src/components/CategorySelector';
import { CategoryCreationForm } from '../../../../../../../../../libs/ui-components/src/components/CategoryCreationForm';

interface ReviewQuestion {
  reviewQuestionId: number;
  questionText: string;
}

export interface TestViewViewProps {
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
  categories?: Array<{ categoryId: number; name: string; color: string }>;
  selectedCategoryId?: number | null;
  isLoadingCategories?: boolean;
  categoryError?: string | null;
  showCategoryForm?: boolean;
  onCategorySelect?: (categoryId: number) => void;
  onAddCategoryClick?: () => void;
  onCloseCategoryForm?: () => void;
  onSaveCategory?: (name: string, color: string) => Promise<void>;
}

export function TestViewView({
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
  categories,
  selectedCategoryId,
  isLoadingCategories,
  categoryError,
  showCategoryForm,
  onCategorySelect,
  onAddCategoryClick,
  onCloseCategoryForm,
  onSaveCategory,
}: TestViewViewProps) {
  return (
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
          categories={categories || []}
          selectedCategoryId={selectedCategoryId ?? null}
          isLoadingCategories={isLoadingCategories || false}
          categoryError={categoryError ?? null}
          showCategoryForm={showCategoryForm || false}
          onCategorySelect={onCategorySelect || (() => {})}
          onAddCategoryClick={onAddCategoryClick || (() => {})}
          onCloseCategoryForm={onCloseCategoryForm || (() => {})}
          onSaveCategory={onSaveCategory || (async () => {})}
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
      <div className="bg-brand/5 border border-brand/20 rounded-lg p-4">
        <h3 className="text-sm font-medium text-brand mb-2">질문</h3>
        <p className="text-text-primary">{questionText}</p>
      </div>

      {/* Answer Input */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          답변을 입력하세요
        </label>
        <textarea
          value={answerInput}
          onChange={(e) => setAnswerInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="답변을 입력하세요... (Ctrl+Enter로 제출)"
          rows={8}
          className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent resize-none bg-background-secondary text-text-primary"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-text-tertiary">Ctrl + Enter</span>
          <button
            type="button"
            onClick={onSubmit}
            disabled={!answerInput.trim()}
            className="px-4 py-2 bg-brand text-white rounded-lg font-medium hover:bg-brand-dark disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
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
      <div className="grid grid-cols-2 gap-4">
        {/* Left: Previous Answers */}
        <div className="border border-neutral-200 rounded-lg p-4 bg-background-tertiary flex flex-col max-h-[500px]">
          <h3 className="text-sm font-medium text-text-primary mb-3 flex-shrink-0">이전 답변</h3>
          {isLoadingAnswers ? (
            <LoadingView message="이전 답변을 불러오는 중..." />
          ) : previousAnswers.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-text-tertiary">
              이전 답변이 없습니다.
            </div>
          ) : (
            <div className="space-y-3 flex-1 flex flex-col">
              <div className="bg-background-secondary border border-neutral-200 rounded p-3 overflow-y-auto flex-1">
                <p className="text-sm text-text-primary whitespace-pre-wrap">
                  {displayedPreviousAnswer.content}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      displayedPreviousAnswer.evaluationResult === 'SUCCESS'
                        ? 'bg-semantic-success/10 text-semantic-success'
                        : 'bg-semantic-error/10 text-semantic-error'
                    }`}
                  >
                    {displayedPreviousAnswer.evaluationResult === 'SUCCESS' ? '성공' : '실패'}
                  </span>
                  <span className="text-xs text-text-tertiary">
                    {new Date(displayedPreviousAnswer.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between flex-shrink-0">
                <button
                  type="button"
                  onClick={onPrev}
                  disabled={isPrevDisabled}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-text-primary hover:bg-neutral-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FiChevronLeft size={16} />
                  이전
                </button>
                <span className="text-xs text-text-secondary">
                  {currentAnswerIndex + 1} / {previousAnswers.length}
                </span>
                <button
                  type="button"
                  onClick={onNext}
                  disabled={isNextDisabled}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-text-primary hover:bg-neutral-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  다음
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Current Answer */}
        <div className="border border-neutral-200 rounded-lg p-4 bg-background-secondary flex flex-col max-h-[500px]">
          <h3 className="text-sm font-medium text-text-primary mb-3 flex-shrink-0">현재 답변</h3>
          <div className="bg-brand/5 border border-brand/20 rounded p-3 overflow-y-auto flex-1">
            <p className="text-sm text-text-primary whitespace-pre-wrap">{currentAnswer}</p>
          </div>
        </div>
      </div>

      {/* Evaluation Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
        <button
          type="button"
          onClick={() => onEvaluate('FAILURE')}
          disabled={isSavingAnswer}
          className="px-6 py-2 bg-semantic-error text-white rounded-lg font-medium hover:bg-semantic-error/90 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
        >
          {isSavingAnswer ? '저장 중...' : '실패'}
        </button>
        <button
          type="button"
          onClick={() => onEvaluate('SUCCESS')}
          disabled={isSavingAnswer}
          className="px-6 py-2 bg-semantic-success text-white rounded-lg font-medium hover:bg-semantic-success/90 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
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
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mb-4"></div>
      <p className="text-sm text-text-secondary">{message}</p>
    </div>
  );
}

/* Empty View */
function EmptyView() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <p className="text-text-secondary">질문이 없습니다.</p>
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
  categories: Array<{ categoryId: number; name: string; color: string }>;
  selectedCategoryId: number | null;
  isLoadingCategories: boolean;
  categoryError: string | null;
  showCategoryForm: boolean;
  onCategorySelect: (categoryId: number) => void;
  onAddCategoryClick: () => void;
  onCloseCategoryForm: () => void;
  onSaveCategory: (name: string, color: string) => Promise<void>;
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
  categories,
  selectedCategoryId,
  isLoadingCategories,
  categoryError,
  showCategoryForm,
  onCategorySelect,
  onAddCategoryClick,
  onCloseCategoryForm,
  onSaveCategory,
}: ResultViewProps) {
  const remainingQuestions = questions.filter(q => !deletedQuestionIds.has(q.reviewQuestionId));
  const isAllQuestionsDeleted = remainingQuestions.length === 0;

  return (
    <div className="space-y-4">
      {/* Main Content: Questions + Settings */}
      <div className="grid grid-cols-2 gap-4 min-h-[400px]">
        {/* Left: Question List */}
        <div className="border border-neutral-200 rounded-lg p-4 bg-background-tertiary overflow-y-auto max-h-[500px]">
          <h3 className="text-sm font-medium text-text-primary mb-3">질문 목록</h3>
          {questions.length === 0 ? (
            <EmptyView />
          ) : (
            <div className="space-y-2">
              {questions.map((question) => {
                const isDeleted = deletedQuestionIds.has(question.reviewQuestionId);
                const result = questionResults.get(question.reviewQuestionId) || { successCount: 0, failCount: 0 };

                let bgColor = 'bg-background-secondary';
                if (!isDeleted) {
                  if (result.successCount > 0 && result.failCount === 0) {
                    bgColor = 'bg-semantic-success/10';
                  } else if (result.failCount > 0 && result.successCount === 0) {
                    bgColor = 'bg-semantic-error/10';
                  } else if (result.successCount > 0 && result.failCount > 0) {
                    bgColor = 'bg-semantic-warning/10';
                  }
                }
                if (isDeleted) bgColor = 'bg-neutral-100';

                return (
                  <div
                    key={question.reviewQuestionId}
                    className={`${bgColor} p-3 rounded-lg border ${
                      isDeleted ? 'border-neutral-300 opacity-60' : 'border-neutral-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p
                          className={`text-sm mb-2 ${
                            isDeleted ? 'line-through text-text-tertiary' : 'text-text-primary'
                          }`}
                        >
                          {question.questionText}
                        </p>

                        {!isDeleted && (result.successCount > 0 || result.failCount > 0) && (
                          <div className="flex gap-2 mt-2">
                            {result.successCount > 0 && (
                              <span className="inline-flex items-center text-xs px-2 py-1 bg-semantic-success/20 text-semantic-success rounded">
                                성공 {result.successCount}회
                              </span>
                            )}
                            {result.failCount > 0 && (
                              <span className="inline-flex items-center text-xs px-2 py-1 bg-semantic-error/20 text-semantic-error rounded">
                                실패 {result.failCount}회
                              </span>
                            )}
                          </div>
                        )}

                        {isDeleted && (
                          <span className="inline-block text-xs px-2 py-1 bg-semantic-error/20 text-semantic-error rounded">
                            삭제됨
                          </span>
                        )}
                      </div>

                      {!isDeleted && (
                        <button
                          onClick={() => onDeleteQuestion(question.reviewQuestionId)}
                          className="ml-2 text-semantic-error hover:text-semantic-error/80 transition-colors"
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

          {isAllQuestionsDeleted && (
            <div className="mt-4 p-3 bg-semantic-warning/10 border border-semantic-warning/20 rounded-lg">
              <p className="text-sm text-semantic-warning">
                ⚠️ 모든 질문이 삭제되었습니다. 저장 시 이 카드는 영구히 삭제됩니다.
              </p>
            </div>
          )}
        </div>

        <div className="border border-neutral-200 rounded-lg p-4 bg-background-secondary">
          <h3 className="text-sm font-medium text-text-primary mb-4">설정</h3>
          <div className="space-y-4">
            <div>
              {showCategoryForm ? (
                <CategoryCreationForm
                  onSave={onSaveCategory}
                  onCancel={onCloseCategoryForm}
                  existingCategories={categories}
                />
              ) : (
                <CategorySelector
                  categories={categories}
                  selectedCategoryId={selectedCategoryId}
                  isLoading={isLoadingCategories}
                  error={categoryError}
                  onCategorySelect={onCategorySelect}
                  onAddCategoryClick={onAddCategoryClick}
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-text-primary mb-2">
                중요도: {localSettings.importance}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={localSettings.importance}
                onChange={(e) => onSettingChange('importance', Number(e.target.value))}
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-text-tertiary mt-1">
                <span>1</span>
                <span>10</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-primary mb-2">
                복습 주기: {localSettings.reviewCycle}일
              </label>
              <input
                type="range"
                min="1"
                max="15"
                value={localSettings.reviewCycle}
                onChange={(e) => onSettingChange('reviewCycle', Number(e.target.value))}
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-text-tertiary mt-1">
                <span>1일</span>
                <span>15일</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-neutral-200">
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="px-6 py-2 bg-brand text-white rounded-lg font-medium hover:bg-brand-dark disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {isSaving && (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          {isSaving ? '저장 중...' : '저장하기'}
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
      .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #5E6AD2;
        cursor: pointer;
        border: 2px solid #ffffff;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .slider::-moz-range-thumb {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #5E6AD2;
        cursor: pointer;
        border: 2px solid #ffffff;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }
    `}} />
    </div>
  );
}

import { Button } from '../../../../../../../libs/ui-components/src/components/Button';
import { QuestionCard } from '../../../../../../../libs/ui-components/src/components/QuestionCard';
import { QuestionEditModal } from '../../../../../../../libs/ui-components/src/components/QuestionEditModal';
import { QuestionSettingsPanel } from '../../../../../../../libs/ui-components/src/components/QuestionSettingsPanel';
import { CategoryCreationForm } from '../../../../../../../libs/ui-components/src/components/CategoryCreationForm';
import type { CreateAnswerResponse } from '../../../../schemas/taskCreation.schema';

interface TaskCreationModalViewProps {
  isOpen: boolean;
  onClose: () => void;
  onBackgroundClick?: () => void;
  currentView: 'input' | 'select' | 'category';
  inputValue: string;
  setInputValue: (value: string) => void;
  errorMessage: string;
  isLoading: boolean;
  questions: CreateAnswerResponse | null;
  selectedQuestions: Set<number>;
  editingQuestion: { id: number; text: string } | null;
  title: string;
  setTitle: (value: string) => void;
  repetitionCycle: number;
  setRepetitionCycle: (value: number) => void;
  importance: number;
  setImportance: (value: number) => void;
  url: string;
  setUrl: (value: string) => void;
  categories: Array<{ categoryId: number; name: string; color: string }>;
  selectedCategoryId: number | null;
  isLoadingCategories: boolean;
  categoryError: string | null;
  showCategoryForm: boolean;
  onCategorySelect: (categoryId: number) => void;
  onAddCategoryClick: () => void;
  onCloseCategoryForm: () => void;
  onSaveCategory: (name: string, color: string) => Promise<void>;
  onContinue: () => void;
  onQuestionToggle: (questionId: number) => void;
  onQuestionEdit: (questionId: number) => void;
  onQuestionSave: (questionId: number, newText: string) => void;
  onQuestionDelete: (questionId: number) => void;
  onEditModalClose: () => void;
  onRegisterSelectedQuestions: () => void;
}

export function TaskCreationModalView({
  isOpen,
  onClose,
  onBackgroundClick,
  currentView,
  inputValue,
  setInputValue,
  errorMessage,
  isLoading,
  questions,
  selectedQuestions,
  editingQuestion,
  title,
  setTitle,
  repetitionCycle,
  setRepetitionCycle,
  importance,
  setImportance,
  url,
  setUrl,
  categories,
  selectedCategoryId,
  isLoadingCategories,
  categoryError,
  showCategoryForm,
  onCategorySelect,
  onAddCategoryClick,
  onCloseCategoryForm,
  onSaveCategory,
  onContinue,
  onQuestionToggle,
  onQuestionEdit,
  onQuestionSave,
  onQuestionDelete,
  onEditModalClose,
  onRegisterSelectedQuestions
}: TaskCreationModalViewProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="absolute inset-0"
        onClick={onBackgroundClick}
      />
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
            <h2 className="text-xl font-semibold text-gray-900">
              추가 태스크 생성
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            {currentView === 'input' && (
              <InputView
                value={inputValue}
                onChange={setInputValue}
                errorMessage={errorMessage}
                isLoading={isLoading}
                onContinue={onContinue}
              />
            )}
            {currentView === 'select' && (
              <>
                {isLoading && !questions ? (
                  <LoadingView />
                ) : questions ? (
                  <SelectView
                    title={title}
                    setTitle={setTitle}
                    questions={questions.questions}
                    selectedQuestions={selectedQuestions}
                    repetitionCycle={repetitionCycle}
                    setRepetitionCycle={setRepetitionCycle}
                    importance={importance}
                    setImportance={setImportance}
                    url={url}
                    setUrl={setUrl}
                    categories={categories}
                    selectedCategoryId={selectedCategoryId}
                    isLoadingCategories={isLoadingCategories}
                    categoryError={categoryError}
                    showCategoryForm={showCategoryForm}
                    onCategorySelect={onCategorySelect}
                    onAddCategoryClick={onAddCategoryClick}
                    onCloseCategoryForm={onCloseCategoryForm}
                    onSaveCategory={onSaveCategory}
                    onQuestionToggle={onQuestionToggle}
                    onQuestionEdit={onQuestionEdit}
                    onQuestionDelete={onQuestionDelete}
                    onRegisterSelectedQuestions={onRegisterSelectedQuestions}
                    errorMessage={errorMessage}
                  />
                ) : null}
              </>
            )}
        </div>
      </div>

      {/* Question Edit Modal */}
      <QuestionEditModal
        isOpen={!!editingQuestion}
        questionId={editingQuestion?.id}
        initialQuestion={editingQuestion?.text}
        onSave={onQuestionSave}
        onClose={onEditModalClose}
      />
    </div>
  );
}

// ... InputView, LoadingView 컴포넌트는 변경 없음 ...

interface InputViewProps {
  value: string;
  onChange: (value: string) => void;
  errorMessage: string;
  isLoading: boolean;
  onContinue: () => void;
}

function InputView({ value, onChange, errorMessage, isLoading, onContinue }: InputViewProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      onContinue();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          학습하신 내용을 작성해주세요
        </label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="예: React Hook의 useEffect 사용법에 대해 학습했습니다... (Ctrl+Enter로 제출)"
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          disabled={isLoading}
        />
        {errorMessage && (
          <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
        )}
      </div>
      <div className="flex justify-between items-end">
        <span className="text-xs text-gray-500">Ctrl + Enter</span>
        <Button
          onClick={onContinue}
          disabled={isLoading || !value.trim()}
          variant="primary"
        >
          {isLoading ? '처리 중...' : '계속하기'}
        </Button>
      </div>
    </div>
  );
}

interface SelectViewProps {
  title: string;
  setTitle: (value: string) => void;
  questions: Array<{ id: number; text: string }>;
  selectedQuestions: Set<number>;
  repetitionCycle: number;
  setRepetitionCycle: (value: number) => void;
  importance: number;
  setImportance: (value: number) => void;
  url: string;
  setUrl: (value: string) => void;
  categories: Array<{ categoryId: number; name: string; color: string }>;
  selectedCategoryId: number | null;
  isLoadingCategories: boolean;
  categoryError: string | null;
  showCategoryForm: boolean;
  onCategorySelect: (categoryId: number) => void;
  onAddCategoryClick: () => void;
  onCloseCategoryForm: () => void;
  onSaveCategory: (name: string, color: string) => Promise<void>;
  onQuestionToggle: (questionId: number) => void;
  onQuestionEdit: (questionId: number) => void;
  onQuestionDelete: (questionId: number) => void;
  onRegisterSelectedQuestions: () => void;
  errorMessage: string;
}

function SelectView({
  title,
  setTitle,
  questions,
  selectedQuestions,
  repetitionCycle,
  setRepetitionCycle,
  importance,
  setImportance,
  url,
  setUrl,
  categories,
  selectedCategoryId,
  isLoadingCategories,
  categoryError,
  showCategoryForm,
  onCategorySelect,
  onAddCategoryClick,
  onCloseCategoryForm,
  onSaveCategory,
  onQuestionToggle,
  onQuestionEdit,
  onQuestionDelete,
  onRegisterSelectedQuestions,
  errorMessage
}: SelectViewProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          제목 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="복습 카드의 제목을 입력하세요"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-sm text-gray-600 mt-3">
          생성된 질문을 클릭하여 선택하거나 수정/삭제할 수 있습니다.
        </p>
      </div>

      <div className="flex gap-4 flex-1 min-h-[400px]">
        <div className="flex-1 overflow-y-auto pr-2 space-y-3 max-h-[500px]">
          {questions.map((question) => (
            <div
              key={question.id}
              className="flex items-start gap-3 p-2 rounded-lg"
            >
              <input
                type="checkbox"
                id={`question-${question.id}`}
                checked={selectedQuestions.has(question.id)}
                onChange={() => onQuestionToggle(question.id)}
                className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <div className="flex-1">
                <QuestionCard
                  questionId={question.id}
                  question={question.text}
                  onEdit={onQuestionEdit}
                  onDelete={onQuestionDelete}
                  onQuestionClick={() => onQuestionToggle(question.id)}
                />
              </div>
            </div>
          ))}
          {questions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              표시할 질문이 없습니다.
            </div>
          )}
        </div>

        {/* Settings Panel */}
        <div className="w-64 flex-shrink-0">
          {showCategoryForm ? (
            <CategoryCreationForm
              onSave={onSaveCategory}
              onCancel={onCloseCategoryForm}
              existingCategories={categories}
            />
          ) : (
            <QuestionSettingsPanel
              repetitionCycle={repetitionCycle}
              setRepetitionCycle={setRepetitionCycle}
              importance={importance}
              setImportance={setImportance}
              url={url}
              setUrl={setUrl}
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              isLoadingCategories={isLoadingCategories}
              categoryError={categoryError}
              onCategorySelect={onCategorySelect}
              onAddCategoryClick={onAddCategoryClick}
            />
          )}
        </div>
      </div>

      {/* Bottom Action Bar - Sticky */}
      <div className="border-t mt-4 pt-4 pb-4 bg-white bottom-0">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {selectedQuestions.size}개 질문 선택됨
          </div>
          <Button
            onClick={onRegisterSelectedQuestions}
            disabled={selectedQuestions.size === 0}
            variant="primary"
          >
            선택한 질문 등록하기
          </Button>
        </div>
        {errorMessage && (
          <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}

function LoadingView() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">질문을 생성하고 있습니다</h3>
      <p className="text-sm text-gray-600 text-center">
        입력하신 내용을 바탕으로 복습용 질문을 생성하고 있습니다.<br />
        잠시만 기다려주세요.
      </p>
    </div>
  );
}
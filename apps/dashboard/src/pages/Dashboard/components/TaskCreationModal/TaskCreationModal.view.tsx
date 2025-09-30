import { Button } from '../../../../../../../libs/ui-components/src/components/Button';
import { QuestionCard } from '../../../../../../../libs/ui-components/src/components/QuestionCard';
import { QuestionEditModal } from '../../../../../../../libs/ui-components/src/components/QuestionEditModal';
import { QuestionSettingsPanel } from '../../../../../../../libs/ui-components/src/components/QuestionSettingsPanel';
import type { CreateAnswerResponse } from '../../../../schemas/taskCreation.schema';

interface TaskCreationModalViewProps {
  isOpen: boolean;
  onClose: () => void;
  onBackgroundClick?: () => void;
  currentView: 'input' | 'select';
  inputValue: string;
  setInputValue: (value: string) => void;
  errorMessage: string;
  isLoading: boolean;
  questions: CreateAnswerResponse | null;
  selectedQuestions: Set<string>;
  editingQuestion: { id: string; text: string } | null;
  repetitionCycle: number;
  setRepetitionCycle: (value: number) => void;
  importance: number;
  setImportance: (value: number) => void;
  category: string;
  setCategory: (value: string) => void;
  categoryColor: string;
  setCategoryColor: (value: string) => void;
  onContinue: () => void;
  onQuestionToggle: (questionId: string) => void;
  onQuestionEdit: (questionId: string) => void;
  onQuestionSave: (questionId: string, newText: string) => void;
  onQuestionDelete: (questionId: string) => void;
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
  repetitionCycle,
  setRepetitionCycle,
  importance,
  setImportance,
  category,
  setCategory,
  categoryColor,
  setCategoryColor,
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
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
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

        <div className="p-6">
          {currentView === 'input' && (
            <InputView
              value={inputValue}
              onChange={setInputValue}
              errorMessage={errorMessage}
              isLoading={isLoading}
              onContinue={onContinue}
            />
          )}
          {currentView === 'select' && questions && (
            <SelectView
              title={questions.title}
              questions={questions.questions}
              selectedQuestions={selectedQuestions}
              repetitionCycle={repetitionCycle}
              setRepetitionCycle={setRepetitionCycle}
              importance={importance}
              setImportance={setImportance}
              category={category}
              setCategory={setCategory}
              categoryColor={categoryColor}
              setCategoryColor={setCategoryColor}
              onQuestionToggle={onQuestionToggle}
              onQuestionEdit={onQuestionEdit}
              onQuestionDelete={onQuestionDelete}
              onRegisterSelectedQuestions={onRegisterSelectedQuestions}
              errorMessage={errorMessage}
            />
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

interface InputViewProps {
  value: string;
  onChange: (value: string) => void;
  errorMessage: string;
  isLoading: boolean;
  onContinue: () => void;
}

function InputView({ value, onChange, errorMessage, isLoading, onContinue }: InputViewProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
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
          placeholder="예: React Hook의 useEffect 사용법에 대해 학습했습니다..."
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          disabled={isLoading}
        />
        {errorMessage && (
          <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
        )}
      </div>
      <div className="flex justify-end">
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
  questions: Array<{ id: string; text: string }>;
  selectedQuestions: Set<string>;
  repetitionCycle: number;
  setRepetitionCycle: (value: number) => void;
  importance: number;
  setImportance: (value: number) => void;
  category: string;
  setCategory: (value: string) => void;
  categoryColor: string;
  setCategoryColor: (value: string) => void;
  onQuestionToggle: (questionId: string) => void;
  onQuestionEdit: (questionId: string) => void;
  onQuestionDelete: (questionId: string) => void;
  onRegisterSelectedQuestions: () => void;
  errorMessage: string;
}

function SelectView({
  title,
  questions,
  selectedQuestions,
  repetitionCycle,
  setRepetitionCycle,
  importance,
  setImportance,
  category,
  setCategory,
  categoryColor,
  setCategoryColor,
  onQuestionToggle,
  onQuestionEdit,
  onQuestionDelete,
  onRegisterSelectedQuestions,
  errorMessage
}: SelectViewProps) {
  return (
    <div className="relative space-y-4">
      {/* 설정 패널 - 우상단 고정 */}
      <QuestionSettingsPanel
        repetitionCycle={repetitionCycle}
        setRepetitionCycle={setRepetitionCycle}
        importance={importance}
        setImportance={setImportance}
        category={category}
        setCategory={setCategory}
        categoryColor={categoryColor}
        setCategoryColor={setCategoryColor}
      />

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">
          생성된 질문을 수정하거나 삭제할 수 있습니다. 체크박스로 선택 후 하단 등록 버튼을 클릭해주세요.
        </p>
      </div>

      <div className="max-h-96 overflow-y-auto space-y-3 mr-72">
        {questions.map((question) => (
          <div key={question.id} className="flex items-start gap-3">
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
              />
            </div>
          </div>
        ))}
      </div>

      {questions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          표시할 질문이 없습니다.
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="border-t pt-4 bg-gray-50 -mx-6 -mb-6 px-6 pb-6">
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
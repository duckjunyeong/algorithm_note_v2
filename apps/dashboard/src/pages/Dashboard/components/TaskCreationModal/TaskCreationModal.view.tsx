import { Button } from '../../../../../../../libs/ui-components/src/components/Button';
import { QuestionCard } from '../../../../../../../libs/ui-components/src/components/QuestionCard';
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
  onContinue: () => void;
  onQuestionRegister: (questionId: string) => void;
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
  onContinue,
  onQuestionRegister
}: TaskCreationModalViewProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="absolute inset-0"
        onClick={onBackgroundClick}
      />
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
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
              onQuestionRegister={onQuestionRegister}
            />
          )}
        </div>
      </div>
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
  onQuestionRegister: (questionId: string) => void;
}

function SelectView({ title, questions, onQuestionRegister }: SelectViewProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">
          생성된 질문 중에서 등록하고 싶은 것을 선택해주세요.
        </p>
      </div>

      <div className="max-h-96 overflow-y-auto space-y-3">
        {questions.map((question) => (
          <QuestionCard
            key={question.id}
            questionId={question.id}
            question={question.text}
            onRegister={onQuestionRegister}
          />
        ))}
      </div>
    </div>
  );
}
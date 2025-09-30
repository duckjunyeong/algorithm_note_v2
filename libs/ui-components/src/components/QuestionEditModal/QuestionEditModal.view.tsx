import { Button } from '../Button';

interface QuestionEditModalViewProps {
  isOpen: boolean;
  questionText: string;
  setQuestionText: (text: string) => void;
  errorMessage: string;
  isLoading: boolean;
  onSave: () => void;
  onClose: () => void;
  onBackgroundClick: () => void;
}

export function QuestionEditModalView({
  isOpen,
  questionText,
  setQuestionText,
  errorMessage,
  isLoading,
  onSave,
  onClose,
  onBackgroundClick
}: QuestionEditModalViewProps) {
  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      onSave();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="absolute inset-0"
        onClick={onBackgroundClick}
      />
      <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            질문 수정
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                질문 내용
              </label>
              <textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="질문을 입력해주세요..."
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                disabled={isLoading}
              />
              {errorMessage && (
                <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Ctrl + Enter로 저장할 수 있습니다
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 p-6 border-t bg-gray-50">
          <Button
            onClick={onClose}
            disabled={isLoading}
            variant="secondary"
            size="sm"
          >
            취소
          </Button>
          <Button
            onClick={onSave}
            disabled={isLoading || !questionText.trim()}
            variant="primary"
            size="sm"
          >
            {isLoading ? '저장 중...' : '저장'}
          </Button>
        </div>
      </div>
    </div>
  );
}
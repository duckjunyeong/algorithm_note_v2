import { FiX, FiPlus, FiTrash2, FiEdit2, FiCheck } from 'react-icons/fi';
import { QuestionSettingsPanelView } from '../QuestionSettingsPanel/QuestionSettingsPanel.view';
import { Button } from '../Button';

interface QuestionItem {
  reviewQuestionId: number;
  questionText: string;
  isEditing: boolean;
}

export interface ReviewCardSettingsModalViewProps {
  title: string;
  questions: QuestionItem[];
  editingQuestionId: number | null;
  editingQuestionText: string;
  newQuestionText: string;
  repetitionCycle: number;
  importance: number;
  url: string;
  categories: Array<{ categoryId: number; name: string; color: string }>;
  selectedCategoryId: number | null;
  isLoadingCategories: boolean;
  categoryError: string | null;
  isSaving: boolean;
  onClose: () => void;
  onSave: () => void;
  onDeleteCard: () => void;
  onDeleteQuestion: (questionId: number) => void;
  onStartEditQuestion: (questionId: number, text: string) => void;
  onSaveEditQuestion: (questionId: number) => void;
  onEditQuestionTextChange: (text: string) => void;
  onNewQuestionTextChange: (text: string) => void;
  onAddQuestion: () => void;
  onRepetitionCycleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImportanceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCategorySelect: (categoryId: number) => void;
  onAddCategoryClick: () => void;
}

export function ReviewCardSettingsModalView({
  title,
  questions,
  editingQuestionId,
  editingQuestionText,
  newQuestionText,
  repetitionCycle,
  importance,
  url,
  categories,
  selectedCategoryId,
  isLoadingCategories,
  categoryError,
  isSaving,
  onClose,
  onSave,
  onDeleteCard,
  onDeleteQuestion,
  onStartEditQuestion,
  onSaveEditQuestion,
  onEditQuestionTextChange,
  onNewQuestionTextChange,
  onAddQuestion,
  onRepetitionCycleChange,
  onImportanceChange,
  onUrlChange,
  onCategorySelect,
  onAddCategoryClick,
}: ReviewCardSettingsModalViewProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{title} - 설정</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 p-6 overflow-y-auto border-r border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">질문 목록</h3>
            <div className="space-y-2">
              {questions.map((question) => (
                <div
                  key={question.reviewQuestionId}
                  className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  {editingQuestionId === question.reviewQuestionId ? (
                    <>
                      <input
                        type="text"
                        value={editingQuestionText}
                        onChange={(e) => onEditQuestionTextChange(e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => onSaveEditQuestion(question.reviewQuestionId)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <FiCheck size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-sm text-gray-700">{question.questionText}</span>
                      <button
                        type="button"
                        onClick={() => onStartEditQuestion(question.reviewQuestionId, question.questionText)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteQuestion(question.reviewQuestionId)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              ))}

              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <input
                  type="text"
                  value={newQuestionText}
                  onChange={(e) => onNewQuestionTextChange(e.target.value)}
                  placeholder="새 질문을 입력하세요..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={onAddQuestion}
                  disabled={!newQuestionText.trim()}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <FiPlus size={16} />
                  추가
                </button>
              </div>
            </div>
          </div>

          <div className="w-80 p-6 overflow-y-auto bg-gray-50">
            <QuestionSettingsPanelView
              repetitionCycle={repetitionCycle}
              importance={importance}
              url={url}
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              isLoadingCategories={isLoadingCategories}
              categoryError={categoryError}
              onRepetitionCycleChange={onRepetitionCycleChange}
              onImportanceChange={onImportanceChange}
              onUrlChange={onUrlChange}
              onCategorySelect={onCategorySelect}
              onAddCategoryClick={onAddCategoryClick}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <Button variant="secondary" onClick={onClose} disabled={isSaving}>
            취소
          </Button>
          <Button variant="primary" onClick={onSave} disabled={isSaving}>
            {isSaving ? '저장 중...' : '저장하기'}
          </Button>
        </div>
      </div>
    </div>
  );
}

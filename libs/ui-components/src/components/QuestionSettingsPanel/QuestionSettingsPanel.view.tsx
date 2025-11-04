import { CategorySelector } from '../CategorySelector';

interface QuestionSettingsPanelViewProps {
  repetitionCycle: number;
  importance: number;
  url: string;
  categories: Array<{ categoryId: number; name: string; color: string }>;
  selectedCategoryId: number | null;
  isLoadingCategories: boolean;
  categoryError: string | null;
  onRepetitionCycleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImportanceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCategorySelect: (categoryId: number) => void;
  onAddCategoryClick: () => void;
}

export function QuestionSettingsPanelView({
  repetitionCycle,
  importance,
  url,
  categories,
  selectedCategoryId,
  isLoadingCategories,
  categoryError,
  onRepetitionCycleChange,
  onImportanceChange,
  onUrlChange,
  onCategorySelect,
  onAddCategoryClick,
}: QuestionSettingsPanelViewProps) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm h-fit sticky top-0">
      <h4 className="text-sm font-semibold text-gray-900 mb-4">질문 설정</h4>

      <div className="space-y-4">
        {/* 반복주기 슬라이더 */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            반복주기: {repetitionCycle}일
          </label>
          <input
            type="range"
            min="1"
            max="15"
            value={repetitionCycle}
            onChange={onRepetitionCycleChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
        "
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1</span>
            <span>15</span>
          </div>
        </div>

        {/* 중요도 슬라이더 */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            중요도: {importance}/10
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={importance}
            onChange={onImportanceChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                      "
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1</span>
            <span>10</span>
          </div>
        </div>

        {/* 카테고리 선택 */}
        <div>
          <CategorySelector
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            isLoading={isLoadingCategories}
            error={categoryError}
            onCategorySelect={onCategorySelect}
            onAddCategoryClick={onAddCategoryClick}
          />
        </div>

        {/* URL 링크 */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            참고 URL (선택사항)
          </label>
          <input
            type="url"
            value={url}
            onChange={onUrlChange}
            placeholder="https://example.com"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            문제 또는 학습 자료 링크를 입력하세요
          </p>
        </div>
      </div>
    </div>
  );
}
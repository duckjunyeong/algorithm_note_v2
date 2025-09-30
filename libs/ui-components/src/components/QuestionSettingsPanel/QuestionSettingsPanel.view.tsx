interface QuestionSettingsPanelViewProps {
  repetitionCycle: number;
  importance: number;
  category: string;
  categoryColor: string;
  onRepetitionCycleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImportanceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCategoryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCategoryColorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function QuestionSettingsPanelView({
  repetitionCycle,
  importance,
  category,
  categoryColor,
  onRepetitionCycleChange,
  onImportanceChange,
  onCategoryChange,
  onCategoryColorChange
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
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
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
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1</span>
            <span>10</span>
          </div>
        </div>

        {/* 카테고리 입력 */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            카테고리
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={category}
              onChange={onCategoryChange}
              placeholder="카테고리 입력"
              className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="relative">
              <input
                type="color"
                value={categoryColor}
                onChange={onCategoryColorChange}
                className="w-8 h-6 border border-gray-300 rounded cursor-pointer"
                title="색상 선택"
              />
            </div>
          </div>
        </div>

        {/* 미리보기 */}
        {category && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-600 mb-1">미리보기:</p>
            <span
              className="inline-block px-2 py-1 text-xs rounded-full text-white"
              style={{ backgroundColor: categoryColor }}
            >
              {category}
            </span>
          </div>
        )}
      </div>

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
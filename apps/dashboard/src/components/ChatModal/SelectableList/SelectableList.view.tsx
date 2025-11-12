import { Check } from 'lucide-react';
import type { ListItem } from './useSelectableList';

interface SelectableListViewProps {
  listItems: ListItem[];
  selectedItems: Set<number>;
  hasSelection: boolean;
  onToggleItem: (number: number) => void;
  onComplete: () => void;
}

export const SelectableListView = ({
  listItems,
  selectedItems,
  hasSelection,
  onToggleItem,
  onComplete,
}: SelectableListViewProps) => {
  if (listItems.length === 0) {
    return null;
  }

  return (
    <div className="my-4 space-y-3">
      {/* 선택 가능한 항목 목록 */}
      <div className="space-y-2">
        {listItems.map((item) => {
          const isSelected = selectedItems.has(item.number);

          return (
            <button
              key={item.number}
              onClick={() => onToggleItem(item.number)}
              className={`
                w-full flex items-start gap-3 p-3 rounded-lg border-2
                transition-all duration-200 text-left
                ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              {/* 체크박스 */}
              <div
                className={`
                  flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center
                  transition-all duration-200
                  ${
                    isSelected
                      ? 'bg-blue-500 border-blue-500'
                      : 'bg-white border-gray-300'
                  }
                `}
              >
                {isSelected && <Check className="w-3 h-3 text-white" />}
              </div>

              {/* 항목 텍스트 */}
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-700">
                  {item.number}. {item.text}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 선택 완료 버튼 */}
      <div className="flex justify-end">
        <button
          onClick={onComplete}
          disabled={!hasSelection}
          className={`
            px-6 py-2 rounded-lg font-medium transition-all duration-200
            ${
              hasSelection
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          선택 완료
        </button>
      </div>
    </div>
  );
};

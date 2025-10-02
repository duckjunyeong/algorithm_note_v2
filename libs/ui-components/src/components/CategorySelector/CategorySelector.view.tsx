import { FiPlus, FiCheck } from 'react-icons/fi';

interface CategorySelectorViewProps {
  categories: Array<{ categoryId: number; name: string; color: string }>;
  selectedCategoryId: number | null;
  isLoading: boolean;
  error: string | null;
  onCategoryClick: (categoryId: number) => void;
  onAddClick: () => void;
}

export function CategorySelectorView({
  categories,
  selectedCategoryId,
  isLoading,
  error,
  onCategoryClick,
  onAddClick,
}: CategorySelectorViewProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-red-600">{error}</p>
        <button
          onClick={onAddClick}
          className="mt-2 text-sm text-blue-600 hover:text-blue-700"
        >
          카테고리 추가하기
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-xs font-medium text-gray-700 mb-2">카테고리 선택</div>

      {/* 카테고리 목록 */}
      <div className="max-h-48 overflow-y-auto space-y-1">
        {categories.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500 mb-2">생성된 카테고리가 없습니다.</p>
            <button
              onClick={onAddClick}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              첫 카테고리를 만들어보세요
            </button>
          </div>
        ) : (
          categories.map((category) => (
            <button
              key={category.categoryId}
              onClick={() => onCategoryClick(category.categoryId)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                selectedCategoryId === category.categoryId
                  ? 'bg-blue-50 border border-blue-200'
                  : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm font-medium text-gray-900">
                  {category.name}
                </span>
              </div>
              {selectedCategoryId === category.categoryId && (
                <FiCheck className="text-blue-600" size={16} />
              )}
            </button>
          ))
        )}
      </div>

      {/* 카테고리 추가 버튼 */}
      <button
        onClick={onAddClick}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 border-dashed border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
      >
        <FiPlus size={16} />
        <span className="text-sm font-medium">카테고리 추가</span>
      </button>
    </div>
  );
}

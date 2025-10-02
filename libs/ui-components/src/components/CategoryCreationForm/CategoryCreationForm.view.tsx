import { FiSave, FiX } from 'react-icons/fi';

interface CategoryCreationFormViewProps {
  name: string;
  color: string;
  error: string;
  isSubmitting: boolean;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onColorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function CategoryCreationFormView({
  name,
  color,
  error,
  isSubmitting,
  onNameChange,
  onColorChange,
  onSubmit,
  onCancel,
}: CategoryCreationFormViewProps) {
  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-gray-900 mb-3">새 카테고리 만들기</div>

      {/* 카테고리 이름 입력 */}
      <div>
        <label htmlFor="category-name" className="block text-xs font-medium text-gray-700 mb-1">
          카테고리 이름
        </label>
        <input
          id="category-name"
          type="text"
          value={name}
          onChange={onNameChange}
          placeholder="예: 백준, 알고리즘 기초"
          disabled={isSubmitting}
          className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
          } ${isSubmitting ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
          maxLength={100}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>

      {/* 색상 선택 */}
      <div>
        <label htmlFor="category-color" className="block text-xs font-medium text-gray-700 mb-1">
          색상
        </label>
        <div className="flex items-center gap-3">
          <input
            id="category-color"
            type="color"
            value={color}
            onChange={onColorChange}
            disabled={isSubmitting}
            className={`w-12 h-10 rounded-lg border border-gray-300 cursor-pointer ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
          <input
            type="text"
            value={color}
            onChange={onColorChange}
            placeholder="#3B82F6"
            disabled={isSubmitting}
            className={`flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-200 transition-colors ${
              isSubmitting ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
            }`}
            maxLength={7}
          />
        </div>
      </div>

      {/* 버튼 그룹 */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>저장 중...</span>
            </>
          ) : (
            <>
              <FiSave size={16} />
              <span>저장</span>
            </>
          )}
        </button>
        <button
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiX size={16} className="inline mr-1" />
          취소
        </button>
      </div>
    </div>
  );
}

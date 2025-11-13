import { FiFileText, FiCheckSquare, FiSquare } from 'react-icons/fi';
import { Button } from '../../../../../../../libs/ui-components/src/components/Button';
import type { ReviewCard } from '../../../../schemas/reviewCard.schema';

type SortByType = 'all' | 'backlog' | 'completed' | 'successRate' | 'category';

interface ExamSheetModalViewProps {
  isOpen: boolean;
  onClose: () => void;
  onBackgroundClick?: () => void;
  selectedCardIds: Set<number>;
  sortBy: SortByType;
  examTitle: string;
  setexamTitle: (value: string) => void;
  instruction: string;
  setInstruction: (value: string) => void;
  isLoading: boolean;
  errorMessage: string;
  sortedCards: ReviewCard[];
  allCardsCount: number;
  onCardToggle: (cardId: number) => void;
  onToggleAll: () => void;
  onSortChange: (sortBy: SortByType) => void;
  onGeneratePdf: () => void;
}

export function ExamSheetModalView({
  isOpen,
  onClose,
  onBackgroundClick,
  selectedCardIds,
  sortBy,
  examTitle,
  setexamTitle,
  instruction,
  setInstruction,
  isLoading,
  errorMessage,
  sortedCards,
  allCardsCount,
  onCardToggle,
  onToggleAll,
  onSortChange,
  onGeneratePdf,
}: ExamSheetModalViewProps) {
  if (!isOpen) return null;

  const allSelected = selectedCardIds.size === sortedCards.length && sortedCards.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="absolute inset-0"
        onClick={onBackgroundClick}
      />
      <div className="relative bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <div className="flex items-center gap-3">
            <FiFileText size={24} className="text-brand" />
            <h2 className="text-xl font-semibold text-gray-900">
              시험지 생성하기
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="flex gap-6 h-full">
            {/* Left: Card Selection Area */}
            <div className="flex-1 flex flex-col">
              {/* Controls */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => onSortChange(e.target.value as SortByType)}
                    className="bg-neutral-700 text-white text-sm rounded px-3 py-2 border-none outline-none cursor-pointer"
                  >
                    <option value="all">전체 ({allCardsCount}개)</option>
                    <option value="backlog">백로그</option>
                    <option value="completed">완료</option>
                    <option value="successRate">정답률 낮은 순</option>
                    <option value="category">카테고리별</option>
                  </select>

                  {/* Toggle All Button */}
                  <button
                    onClick={onToggleAll}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                  >
                    {allSelected ? (
                      <>
                        <FiCheckSquare size={16} />
                        전체 해제
                      </>
                    ) : (
                      <>
                        <FiSquare size={16} />
                        전체 선택
                      </>
                    )}
                  </button>
                </div>

                <div className="text-sm text-gray-600">
                  {sortedCards.length}개 표시 중
                </div>
              </div>

              {/* Cards Grid */}
              <div className="flex-1 overflow-y-auto pr-2">
                {sortedCards.length === 0 ? (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    표시할 복습 카드가 없습니다.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sortedCards.map((card) => (
                      <CardItem
                        key={card.reviewCardId}
                        card={card}
                        isSelected={selectedCardIds.has(card.reviewCardId)}
                        onToggle={() => onCardToggle(card.reviewCardId)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Settings Panel */}
            <div className="w-80 flex-shrink-0">
              <SettingsPanel
                examTitle={examTitle}
                setexamTitle={setexamTitle}
                instruction={instruction}
                setInstruction={setInstruction}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {selectedCardIds.size}개 카드 선택됨
            </div>
            <div className="flex items-center gap-3">
              {errorMessage && (
                <p className="text-sm text-red-600">{errorMessage}</p>
              )}
              <Button
                onClick={onGeneratePdf}
                disabled={isLoading || selectedCardIds.size === 0}
                variant="primary"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    생성 중...
                  </>
                ) : (
                  'PDF로 추출하기'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Card Item Component
interface CardItemProps {
  card: ReviewCard;
  isSelected: boolean;
  onToggle: () => void;
}

function CardItem({ card, isSelected, onToggle }: CardItemProps) {
  const tags = [
    { label: '정답률', value: `${(card.successRate ?? 0).toFixed(1)}%` },
    { label: '중요도', value: card.importance },
    { label: '주기', value: `${card.reviewCycle}일` },
    { label: '반복', value: `${card.reviewCount}회` },
  ];

  return (
    <div
      onClick={onToggle}
      className={`relative flex cursor-pointer flex-col gap-3 rounded-lg border p-4 transition-all duration-200 ${
        isSelected
          ? 'border-brand bg-brand-light shadow-md'
          : 'border-neutral-100 bg-background-secondary hover:border-brand-light hover:shadow-sm'
      }`}
    >
      {/* Checkbox */}
      <div className="absolute top-3 right-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggle}
          onClick={(e) => e.stopPropagation()}
          className="w-5 h-5 text-brand bg-gray-100 border-gray-300 rounded focus:ring-brand focus:ring-2 cursor-pointer"
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between pr-8">
        <span className="text-xs font-medium text-text-secondary">
          #{card.reviewCardId}
        </span>
        <span className="text-xs text-text-tertiary">{card.category}</span>
      </div>

      {/* Title */}
      <h3 className="font-bold text-text-primary line-clamp-2">{card.title}</h3>

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag.label}
            className="rounded px-2 py-0.5 text-xs font-medium bg-neutral-50 text-text-secondary"
          >
            {tag.label}: {tag.value}
          </span>
        ))}
      </div>

      {/* Status Badge */}
      <div className="absolute bottom-3 right-3">
        <span
          className={`text-xs font-medium px-2 py-1 rounded ${
            card.isActive
              ? 'bg-blue-100 text-blue-700'
              : 'bg-green-100 text-green-700'
          }`}
        >
          {card.isActive ? '백로그' : '완료'}
        </span>
      </div>
    </div>
  );
}

// Settings Panel Component
interface SettingsPanelProps {
  examTitle: string;
  setexamTitle: (value: string) => void;
  instruction: string;
  setInstruction: (value: string) => void;
}

function SettingsPanel({
  examTitle,
  setexamTitle,
  instruction,
  setInstruction,
}: SettingsPanelProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-5 h-full flex flex-col gap-5">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">시험지 설정</h3>
        <p className="text-xs text-gray-600">
          시험지 상단에 표시될 정보를 입력하세요.
        </p>
      </div>

      {/* Course Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          과목명
        </label>
        <input
          type="text"
          value={examTitle}
          onChange={(e) => setexamTitle(e.target.value)}
          placeholder="Synapse AI"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
        />
        <p className="mt-1 text-xs text-gray-500">
          시험지 상단에 표시되는 과목명입니다.
        </p>
      </div>

      {/* Instruction */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          응시 안내문
        </label>
        <textarea
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder="각 질문에 대한 답변을 작성하시오."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent resize-none text-sm"
        />
        <p className="mt-1 text-xs text-gray-500">
          시험지 상단에 표시되는 안내 문구입니다.
        </p>
      </div>

      {/* Info Box */}
      <div className="mt-auto p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          💡 선택한 복습 카드의 질문들이 시험지 형식으로 변환됩니다.
        </p>
      </div>
    </div>
  );
}

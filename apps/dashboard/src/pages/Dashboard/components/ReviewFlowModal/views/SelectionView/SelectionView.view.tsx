import { ArrowRight } from 'lucide-react';
import type { ReviewTypeOption } from './useSelectionView';

export interface SelectionViewViewProps {
  selectedReviewType: string | null;
  reviewTypeOptions: ReviewTypeOption[];
  isNextButtonEnabled: boolean;
  onSelectType: (typeId: string) => void;
  onConfirm: () => void;
}

export function SelectionViewView({
  selectedReviewType,
  reviewTypeOptions,
  isNextButtonEnabled,
  onSelectType,
  onConfirm,
}: SelectionViewViewProps) {
  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        {/* Description */}
        <div className="mb-8 text-center">
          <p className="text-base text-text-secondary">
            복습 테스트를 진행할 방식을 선택해주세요
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {reviewTypeOptions.map((option) => {
            const isSelected = selectedReviewType === option.id;
            const Icon = option.icon;

            return (
              <button
                key={option.id}
                onClick={() => onSelectType(option.id)}
                disabled={option.disabled}
                className={`
                  flex flex-col items-center justify-center p-8 rounded-lg border-2 transition-all
                  ${
                    option.disabled
                      ? 'opacity-50 cursor-not-allowed bg-background-tertiary border-neutral-200'
                      : isSelected
                      ? 'border-brand bg-brand/5 shadow-md'
                      : 'border-neutral-200 bg-background-secondary hover:bg-background-tertiary hover:border-neutral-300'
                  }
                `}
                tabIndex={option.disabled ? -1 : 0}
                aria-pressed={isSelected}
                aria-disabled={option.disabled}
              >
                <Icon
                  size={48}
                  className={`mb-4 ${
                    option.disabled
                      ? 'text-text-tertiary'
                      : isSelected
                      ? 'text-brand'
                      : 'text-text-secondary'
                  }`}
                />
                <span
                  className={`text-lg font-semibold mb-2 ${
                    option.disabled
                      ? 'text-text-tertiary'
                      : isSelected
                      ? 'text-brand'
                      : 'text-text-primary'
                  }`}
                >
                  {option.label}
                </span>
                <span className="text-sm text-text-secondary text-center">
                  {option.description}
                </span>
              </button>
            );
          })}
        </div>

        {isNextButtonEnabled && (
          <div className="flex justify-center">
            <button
              onClick={onConfirm}
              className="
                inline-flex items-center gap-2 px-6 py-3
                bg-brand text-white rounded-lg font-medium
                hover:bg-brand-dark transition-colors
                focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2
              "
            >
              다음
              <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import { Mic, FileText, ArrowRight } from 'lucide-react';

interface ReviewTypeOption {
  id: string;
  label: string;
  icon: React.ElementType;
}

export interface ChoiceReviewTypeModalViewProps {
  reviewTypes: ReviewTypeOption[];
  selectedReviewType: string | null;
  onSelectReviewType: (reviewType: string) => void;
  onConfirmSelection: () => void;
}

export function ChoiceReviewTypeModalView({
  reviewTypes,
  selectedReviewType,
  onSelectReviewType,
  onConfirmSelection,
}: ChoiceReviewTypeModalViewProps) {
  return (
    <div className="min-h-screen bg-background-primary font-primary text-text-primary flex flex-col items-center py-16 px-4">
      <div className="max-w-4xl w-full">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold mb-4">테스트 방식을 선택해주세요</h1>
          <p className="text-base text-text-secondary">
            직접 음성 녹음을 하시거나 텍스트 입력을 통해 테스트를 진행할 수 있습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {reviewTypes.map((type) => (
            <div
              key={type.id}
              className={`
                flex flex-col items-center justify-center p-6 rounded-lg border
                ${selectedReviewType === type.id
                  ? 'border-primary-blue bg-primary-blueLight focus-within:ring-2 focus-within:ring-primary-blue' // focus-within 추가
                  : 'border-border-secondary bg-background-secondary hover:bg-background-tertiary focus-within:ring-2 focus-within:ring-primary-blue'
                }
                transition-all duration-base ease cursor-pointer relative group // group 클래스 추가
              `}
              onClick={() => onSelectReviewType(type.id)}
              tabIndex={0} // 키보드 접근성 위해 tabIndex 추가
              onKeyDown={(e) => { // 키보드 이벤트 처리
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectReviewType(type.id);
                }
              }}
              role="button" // 의미론적 역할 추가
              aria-pressed={selectedReviewType === type.id} // 스크린리더 접근성
            >
              <type.icon className="text-primary-blue mb-2" size={32} /> {/* lucide-react 아이콘 */}
              <span
                className={`
                  mt-2 font-medium
                  ${selectedReviewType === type.id ? 'text-primary-blue' : 'text-text-primary'}
                `}
              >
                {type.label}
              </span>
              {selectedReviewType === type.id && (
                <button
                  onClick={onConfirmSelection}
                  className="mt-4 px-4 py-2 text-sm bg-primary-blue text-white rounded-md font-medium
                             hover:bg-primary-blueHover focus:outline-none focus:ring-2 focus:ring-primary-blue
                             transition-colors duration-base ease flex items-center gap-2"
                >
                  SELECT <ArrowRight size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


export const reviewTypeIcons = {
  'voice': Mic,
  'text': FileText,
};
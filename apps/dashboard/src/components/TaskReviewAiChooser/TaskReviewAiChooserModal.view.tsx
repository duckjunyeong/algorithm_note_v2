import type { AiModeOption } from './useTaskReviewAiChooserModal';

interface TaskReviewAiChooserViewProps {
  aiModes: AiModeOption[];
  selectedAiModeId: string | null;
  onAiModeSelect: (id: string) => void;
  onCancel: () => void;
  onNext: () => void;
}

export function TaskReviewAiChooserView({
  aiModes,
  selectedAiModeId,
  onAiModeSelect,
  onCancel,
  onNext,
}: TaskReviewAiChooserViewProps) {
  return (
    <div className="bg-background-secondary rounded-xl shadow-lg p-6 sm:p-8 max-w-lg w-full font-sans">
      
      <header className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            AI 모드 선택
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            테스트에 사용할 AI 모드를 선택해주세요.
          </p>
        </div>
      </header>

      <div className="space-y-3 mb-4">
        {aiModes.map((aiMode) => {
          const isSelected = selectedAiModeId === aiMode.id;

          const itemClasses = [
            'flex', 'items-center', 'space-x-4', 'p-4', 'rounded-lg',
            'cursor-pointer', 'transition-all', 'duration-200', 'relative',
            isSelected
              ? 'border-2 border-brand-DEFAULT bg-brand-100 shadow-md'
              : 'border-2 border-transparent bg-neutral-50 hover:border-brand-200 hover:bg-neutral-100'
          ].join(' ');

          return (
            <div
              key={aiMode.id}
              className={itemClasses}
              onClick={() => onAiModeSelect(aiMode.id)}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onAiModeSelect(aiMode.id);
                }
              }}
            >
              <div
                className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg ${aiMode.iconBgClass}`}
              >
                {aiMode.icon}
              </div>

              <div className="flex-1">
                <h3 className="font-medium text-text-primary">
                  {aiMode.title}
                </h3>
                <p className="text-sm text-text-secondary">
                  {aiMode.description}
                </p>
              </div>

              {isSelected && (
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-DEFAULT flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mb-8 p-4 bg-neutral-50 rounded-lg">
        <p className="text-sm text-text-secondary text-center">
          AI Model의 수준이 높아지면 꼬리질문을 덜 하게 됩니다.
        </p>
      </div>

      <footer className="flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-5 py-2.5 rounded-md bg-neutral-50 text-text-primary font-medium text-sm hover:bg-neutral-100 transition-colors"
        >
          취소
        </button>
        <button
          onClick={onNext}
          disabled={!selectedAiModeId}
          className="px-5 py-2.5 rounded-md bg-neutral-black text-text-inverse font-medium text-sm hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          다음
        </button>
      </footer>
    </div>
  );
}
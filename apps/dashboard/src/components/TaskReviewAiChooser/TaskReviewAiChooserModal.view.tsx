import type { TemplateOption } from './useTaskReviewAiChooserModal';

interface TaskReviewAiChooserViewProps {
  templates: TemplateOption[];
  selectedTemplateId: string | null;
  onTemplateSelect: (id: string) => void;
  onCancel: () => void;
  onNext: () => void;
}

export function TaskReviewAiChooserView({
  templates,
  selectedTemplateId,
  onTemplateSelect,
  onCancel,
  onNext,
}: TaskReviewAiChooserViewProps) {
  return (
    <div className="bg-background-secondary rounded-xl shadow-lg p-6 sm:p-8 max-w-lg w-full font-sans">
      
      <header className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            Choose template
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Select a template to start organizing your content.
          </p>
        </div>
        <span className="text-sm text-text-tertiary flex-shrink-0 ml-4">
          1/3
        </span>
      </header>

      <div className="space-y-3 mb-8">
        {templates.map((template) => {
          const isSelected = selectedTemplateId === template.id;
          
          const itemClasses = [
            'flex', 'items-center', 'space-x-4', 'p-4', 'rounded-lg',
            'cursor-pointer', 'transition-all', 'duration-200',
            isSelected
              ? 'border-2 border-brand-DEFAULT' 
              : 'border border-neutral-100 hover:border-neutral-300' 
          ].join(' ');

          return (
            <div
              key={template.id}
              className={itemClasses}
              onClick={() => onTemplateSelect(template.id)}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onTemplateSelect(template.id)}
            >
              <div 
                className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg ${template.iconBgClass}`}
              >
                {template.icon}
              </div>
              
              <div>
                <h3 className="font-medium text-text-primary">
                  {template.title}
                </h3>
                <p className="text-sm text-text-secondary">
                  {template.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <footer className="flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-5 py-2.5 rounded-md bg-neutral-50 text-text-primary font-medium text-sm hover:bg-neutral-100 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onNext}
          className="px-5 py-2.5 rounded-md bg-neutral-black text-text-inverse font-medium text-sm hover:bg-neutral-800 transition-colors"
        >
          Next
        </button>
      </footer>
    </div>
  );
}
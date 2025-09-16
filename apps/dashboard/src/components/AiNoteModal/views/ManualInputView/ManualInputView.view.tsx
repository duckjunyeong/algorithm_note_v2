import { ArrowLeft, ArrowRight } from 'lucide-react';

interface FormData {
  title: string;
  description: string;
  inputOutput: string;
  constraints: string;
}

interface ManualInputViewProps {
  formData: FormData;
  errors: Partial<FormData>;
  onInputChange: (field: keyof FormData, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ManualInputViewComponent({
  formData,
  errors,
  onInputChange,
  onNext,
  onBack,
}: ManualInputViewProps) {
  const hasRequiredFields = formData.title.trim() && formData.description.trim() && formData.inputOutput.trim();

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Manual Problem Information Input
        </h2>
        <p className="text-gray-600">
          Please enter the detailed problem information directly.
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-400">
        <div className="space-y-6 w-4/5 mx-auto">
          {/* Problem Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Problem Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => onInputChange('title', e.target.value)}
              placeholder="Enter problem title"
              className={`
                w-full px-4 py-3 border rounded-lg
                focus:outline-none focus:ring-2 transition duration-200
                ${errors.title
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }
              `}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Problem Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Problem Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => onInputChange('description', e.target.value)}
              placeholder="Enter detailed problem description"
              rows={8}
              className={`
                w-full px-4 py-3 border rounded-lg resize-none
                focus:outline-none focus:ring-2 transition duration-200
                ${errors.description
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }
              `}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Input/Output Conditions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Input/Output Conditions *
            </label>
            <textarea
              value={formData.inputOutput}
              onChange={(e) => onInputChange('inputOutput', e.target.value)}
              placeholder="Enter input and output format specifications"
              rows={4}
              className={`
                w-full px-4 py-3 border rounded-lg resize-none
                focus:outline-none focus:ring-2 transition duration-200
                ${errors.inputOutput
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }
              `}
            />
            {errors.inputOutput && (
              <p className="mt-1 text-sm text-red-600">{errors.inputOutput}</p>
            )}
          </div>

          {/* Constraints */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Constraints
            </label>
            <input
              type="text"
              value={formData.constraints}
              onChange={(e) => onInputChange('constraints', e.target.value)}
              placeholder="Enter problem constraints (optional)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       transition duration-200"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-3 pt-4 border-t mt-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300
                   text-gray-700 rounded-md hover:bg-gray-50 transition duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>

        <button
          onClick={onNext}
          disabled={!hasRequiredFields}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2
                   bg-blue-600 text-white rounded-md hover:bg-blue-700
                   disabled:bg-gray-300 disabled:cursor-not-allowed
                   transition duration-200"
        >
          <span>Next</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
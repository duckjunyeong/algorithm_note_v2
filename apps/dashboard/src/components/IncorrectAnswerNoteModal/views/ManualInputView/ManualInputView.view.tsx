import { ArrowLeft } from 'lucide-react';

interface FormData {
  title: string;
  description: string;
  input: string;
  output: string;
  constraints: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  input?: string;
  output?: string;
}

interface ManualInputViewProps {
  formData: FormData;
  errors: FormErrors;
  onBack: () => void;
  onInputChange: (field: keyof FormData, value: string) => void;
  onNext: () => void;
}

export function ManualInputViewComponent({
  formData,
  errors,
  onBack,
  onInputChange,
  onNext
}: ManualInputViewProps) {
  const inputBaseStyles = "bg-gray-900 border border-gray-700 rounded-md p-3 text-sm placeholder:text-gray-500 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition-colors duration-200";

  return (
    <div className="flex flex-col h-full">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-10 w-10 h-10 rounded-full bg-transparent hover:bg-gray-800 flex items-center justify-center transition-colors duration-200"
        aria-label="Go back"
      >
        <ArrowLeft className="w-5 h-5 text-gray-400" />
      </button>

      <div className="overflow-y-auto flex-1 px-8 pt-16 pb-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Manual Registration
          </h2>
          <p className="text-gray-400">
            Please enter the detailed problem information directly.
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-6 mb-8">
          {/* Problem Title */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Problem Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => onInputChange('title', e.target.value)}
              placeholder="Enter problem title"
              className={inputBaseStyles}
            />
            {errors.title && (
              <p className="text-red-400 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => onInputChange('description', e.target.value)}
              placeholder="Enter problem description"
              rows={4}
              className={`${inputBaseStyles} resize-none`}
            />
            {errors.description && (
              <p className="text-red-400 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Input */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Input
            </label>
            <textarea
              value={formData.input}
              onChange={(e) => onInputChange('input', e.target.value)}
              placeholder="Enter input format"
              rows={3}
              className={`${inputBaseStyles} resize-none`}
            />
            {errors.input && (
              <p className="text-red-400 text-sm mt-1">{errors.input}</p>
            )}
          </div>

          {/* Output */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Output
            </label>
            <textarea
              value={formData.output}
              onChange={(e) => onInputChange('output', e.target.value)}
              placeholder="Enter output format"
              rows={3}
              className={`${inputBaseStyles} resize-none`}
            />
            {errors.output && (
              <p className="text-red-400 text-sm mt-1">{errors.output}</p>
            )}
          </div>

          {/* Constraints (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Constraints (Optional)
            </label>
            <textarea
              value={formData.constraints}
              onChange={(e) => onInputChange('constraints', e.target.value)}
              placeholder="Enter constraints (optional)"
              rows={3}
              className={`${inputBaseStyles} resize-none`}
            />
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={onNext}
          className="w-full mt-auto bg-blue-500 text-base px-6 py-3 rounded-md font-medium transition-colors duration-200 hover:bg-blue-600 text-white"
        >
          Next
        </button>
      </div>
    </div>
  );
}
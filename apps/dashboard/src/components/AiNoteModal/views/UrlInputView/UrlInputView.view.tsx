import { ArrowLeft, ArrowRight } from 'lucide-react';

interface UrlInputViewProps {
  url: string;
  error: string | null;
  onUrlChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function UrlInputViewComponent({
  url,
  error,
  onUrlChange,
  onNext,
  onBack,
}: UrlInputViewProps) {
  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Register Problem Link (URL)
        </h2>
        <p className="text-gray-600">
          Please enter the full URL of the problem to register.
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 flex flex-col">
        <div className="mb-6">
          <div className="relative">
            <input
              type="url"
              value={url}
              onChange={(e) => onUrlChange(e.target.value)}
              placeholder="https://www.acmicpc.net/problem/1000"
              className={`
                w-full px-4 py-3 border rounded-lg bg-gray-50
                focus:outline-none focus:ring-2 focus:bg-white transition duration-200
                ${error
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }
              `}
            />
            <label className={`
              absolute left-4 transition-all duration-200 pointer-events-none
              ${url
                ? '-top-2 text-xs bg-white px-1 text-blue-600'
                : 'top-3 text-gray-500'
              }
            `}>
              Problem Link
            </label>
          </div>

          {error && (
            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
          )}
        </div>

        {/* Example */}
        <div className="mb-8 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Example:</h4>
          <code className="text-sm text-blue-700">
            https://www.acmicpc.net/problem/1000
          </code>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-3 pt-4 border-t">
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
          disabled={!url.trim()}
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
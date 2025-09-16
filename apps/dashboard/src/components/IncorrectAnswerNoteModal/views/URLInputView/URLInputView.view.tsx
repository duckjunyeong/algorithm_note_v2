import { ArrowLeft } from 'lucide-react';

interface URLInputViewProps {
  url: string;
  error: string;
  onBack: () => void;
  onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
}

export function URLInputViewComponent({
  url,
  error,
  onBack,
  onUrlChange,
  onNext
}: URLInputViewProps) {
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

      <div className="flex flex-col flex-1 px-8 pt-16 pb-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            Register Problem Link (URL)
          </h2>
          <p className="text-gray-400">
            Please enter the full URL of the problem to register.
          </p>
        </div>

        {/* Form */}
        <div className="flex-1 flex flex-col">
          {/* Floating Label Input */}
          <div className="relative mb-6">
            <input
              type="text"
              value={url}
              onChange={onUrlChange}
              placeholder=" "
              className="peer bg-transparent border-b-2 border-gray-700 outline-none text-lg text-gray-100 w-full pb-2 focus:border-blue-500 transition-colors duration-200"
            />
            <label className="absolute text-lg text-gray-400 pointer-events-none transition-all duration-200 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-500 peer-placeholder-shown:not(:placeholder-shown):-translate-y-6 peer-placeholder-shown:not(:placeholder-shown):scale-75 peer-placeholder-shown:not(:placeholder-shown):text-blue-500">
              Problem URL
            </label>
            {error && (
              <p className="text-red-400 text-sm mt-2">{error}</p>
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={onNext}
            disabled={!url.trim()}
            className="w-full mt-auto bg-blue-500 text-base px-6 py-3 rounded-md font-medium transition-colors duration-200 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
import { ArrowLeft } from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import type { Extension } from '@codemirror/state';

interface LanguageOption {
  value: string;
  label: string;
}

interface CodeInputViewProps {
  localCode: string;
  localLanguage: string;
  extensions: Extension[];
  isLoading: boolean;
  languageOptions: LanguageOption[];
  onBack: () => void;
  onCodeChange: (value: string) => void;
  onLanguageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onAnalyze: () => void;
}

export function CodeInputViewComponent({
  localCode,
  localLanguage,
  extensions,
  isLoading,
  languageOptions,
  onBack,
  onCodeChange,
  onLanguageChange,
  onAnalyze
}: CodeInputViewProps) {
  return (
    <div className="flex flex-col h-full pt-12">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-10 w-10 h-10 rounded-full bg-transparent hover:bg-gray-800 flex items-center justify-center transition-colors duration-200"
        aria-label="Go back"
      >
        <ArrowLeft className="w-5 h-5 text-gray-400" />
      </button>

      <div className="flex flex-col flex-1 px-8 pb-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Code Input
          </h2>
          <p className="text-gray-400">
            Please enter the code that solved this problem.
          </p>
        </div>

        {/* Language Selector */}
        <div className="flex justify-end mb-3">
          <select
            value={localLanguage}
            onChange={onLanguageChange}
            className="bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors duration-200"
          >
            {languageOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Code Editor */}
        <div className="border border-gray-700 rounded-md overflow-hidden h-[350px] flex-shrink-0 mb-6">
          <CodeMirror
            value={localCode}
            height="350px"
            theme={oneDark}
            extensions={extensions}
            onChange={onCodeChange}
            placeholder="Enter your solution code here..."
            className="h-full"
          />
        </div>

        {/* Analyze Button */}
        <button
          onClick={onAnalyze}
          disabled={!localCode.trim() || isLoading}
          className="w-full mt-auto bg-blue-500 text-base px-6 py-3 rounded-md font-medium transition-colors duration-200 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white"
        >
          {isLoading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>
    </div>
  );
}
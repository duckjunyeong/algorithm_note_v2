import { ArrowLeft, Loader2 } from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { EditorView } from '@codemirror/view';

interface LanguageOption {
  value: string;
  label: string;
  extension: string;
}

interface CodeInputViewProps {
  code: string;
  language: string;
  isLoading: boolean;
  error: string | null;
  languageOptions: LanguageOption[];
  onCodeChange: (code: string) => void;
  onLanguageChange: (language: string) => void;
  onAnalyze: () => void;
  onBack: () => void;
}

const getLanguageExtension = (language: string) => {
  switch (language) {
    case 'javascript':
      return javascript();
    case 'python':
      return python();
    case 'java':
      return java();
    case 'cpp':
    case 'c':
      return cpp();
    default:
      return javascript();
  }
};

export function CodeInputViewComponent({
  code,
  language,
  isLoading,
  error,
  languageOptions,
  onCodeChange,
  onLanguageChange,
  onAnalyze,
  onBack,
}: CodeInputViewProps) {
  const extensions = [
    getLanguageExtension(language),
    EditorView.theme({
      '&': {
        fontSize: '14px',
      },
      '.cm-focused': {
        outline: 'none',
      },
    }),
  ];

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Code Input
        </h2>
        <p className="text-gray-600">
          Please enter the code that solved the problem.
        </p>
      </div>

      {/* Language Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Programming Language
        </label>
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md bg-white
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   transition duration-200"
        >
          {languageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Code Editor */}
      <div className="flex-1 mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Solution Code
        </label>
        <div className={`
          border rounded-lg overflow-hidden
          ${error ? 'border-red-300' : 'border-gray-300'}
        `}>
          <CodeMirror
            value={code}
            onChange={onCodeChange}
            extensions={extensions}
            theme={vscodeDark}
            placeholder="Enter your solution code here..."
            className="h-80"
          />
        </div>

        {error && (
          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex space-x-3 pt-4 border-t">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300
                   text-gray-700 rounded-md hover:bg-gray-50 transition duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>

        <button
          onClick={onAnalyze}
          disabled={!code.trim() || isLoading}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2
                   bg-blue-600 text-white rounded-md hover:bg-blue-700
                   disabled:bg-gray-300 disabled:cursor-not-allowed
                   transition duration-200"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <span>Analyze</span>
          )}
        </button>
      </div>
    </div>
  );
}
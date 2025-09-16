import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { oneDark } from '@codemirror/theme-one-dark';
import CodeMirror from '@uiw/react-codemirror';
import type { CodeData } from '../../../store/useIncorrectAnswerNoteStore';

interface CodeInputViewProps {
  codeData: CodeData;
  onCodeDataChange: (data: Partial<CodeData>) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

const languageExtensions = {
  javascript: javascript(),
  python: python(),
  java: java(),
  cpp: cpp(),
};

const languageOptions = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
];

export function CodeInputView({ codeData, onCodeDataChange, onAnalyze, isLoading }: CodeInputViewProps) {
  const handleLanguageChange = (language: string) => {
    onCodeDataChange({ language });
  };

  const handleCodeChange = (code: string) => {
    onCodeDataChange({ code });
  };

  const handleSubmit = () => {
    if (codeData.code.trim()) {
      onAnalyze();
    }
  };

  return (
    <div className="p-6 flex flex-col h-full">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">
        Code Input
      </h2>

      {/* Language Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Select Language
        </label>
        <select
          value={codeData.language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="w-48 px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500 transition-colors"
        >
          {languageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Code Editor */}
      <div className="flex-1 mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Your Solution Code
        </label>
        <div className="h-[350px] border border-gray-600 rounded-md overflow-hidden">
          <CodeMirror
            value={codeData.code}
            onChange={handleCodeChange}
            extensions={[languageExtensions[codeData.language as keyof typeof languageExtensions] || javascript()]}
            theme={oneDark}
            placeholder={`Enter your ${languageOptions.find(opt => opt.value === codeData.language)?.label || 'JavaScript'} code here...`}
            basicSetup={{
              lineNumbers: true,
              foldGutter: true,
              dropCursor: false,
              allowMultipleSelections: false,
              indentOnInput: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: true,
              highlightSelectionMatches: false,
            }}
            style={{ fontSize: '14px' }}
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!codeData.code.trim() || isLoading}
        className="w-full bg-blue-500 text-white font-medium text-base px-6 py-3 rounded-md hover:bg-blue-600 disabled:opacity-60 transition-colors"
      >
        {isLoading ? 'Analyzing...' : 'Analyze'}
      </button>
    </div>
  );
}
import { useState } from 'react';
import type { ProblemData } from '../../../store/useIncorrectAnswerNoteStore';

interface URLInputViewProps {
  problemData: ProblemData;
  onProblemDataChange: (data: Partial<ProblemData>) => void;
  onNext: () => void;
}

export function URLInputView({ problemData, onProblemDataChange, onNext }: URLInputViewProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(problemData.url || '');

  const handleInputChange = (value: string) => {
    setInputValue(value);
    onProblemDataChange({ url: value });
  };

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onNext();
    }
  };

  return (
    <div className="p-6 flex flex-col h-full">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">
        Register Problem Link (URL)
      </h2>

      <div className="flex-1 flex flex-col justify-center">
        <div className="relative mb-6">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-transparent focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Problem Link"
          />
          <label
            className={`absolute left-4 transition-all duration-200 pointer-events-none ${
              isFocused || inputValue
                ? '-top-2 text-xs text-blue-400 bg-gray-900 px-2'
                : 'top-3 text-gray-400'
            }`}
          >
            Problem Link
          </label>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!inputValue.trim()}
        className="w-full mt-auto bg-blue-500 text-white font-medium text-base px-6 py-3 rounded-md hover:bg-blue-600 disabled:opacity-60 transition-colors"
      >
        Next
      </button>
    </div>
  );
}
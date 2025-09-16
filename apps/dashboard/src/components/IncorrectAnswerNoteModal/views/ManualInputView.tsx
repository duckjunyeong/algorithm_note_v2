import type { ProblemData } from '../../../store/useIncorrectAnswerNoteStore';

interface ManualInputViewProps {
  problemData: ProblemData;
  onProblemDataChange: (data: Partial<ProblemData>) => void;
  onNext: () => void;
}

export function ManualInputView({ problemData, onProblemDataChange, onNext }: ManualInputViewProps) {
  const handleInputChange = (field: keyof ProblemData, value: string) => {
    onProblemDataChange({ [field]: value });
  };

  const handleSubmit = () => {
    if (problemData.title.trim() && problemData.description.trim()) {
      onNext();
    }
  };

  const isFormValid = problemData.title.trim() && problemData.description.trim();

  return (
    <div className="p-6 flex flex-col h-full">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">
        Manual Problem Information Input
      </h2>

      <div className="flex-1 overflow-y-auto space-y-4 mb-6" style={{scrollbarWidth: 'thin', scrollbarColor: '#4B5563 #1F2937'}}>
        {/* Problem Title */}
        <div className="w-4/5 mx-auto">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Problem Title *
          </label>
          <input
            type="text"
            value={problemData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full h-10 px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Enter problem title"
          />
        </div>

        {/* Problem Description */}
        <div className="w-4/5 mx-auto">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Problem Description *
          </label>
          <textarea
            value={problemData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="w-full h-40 px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors resize-none"
            placeholder="Enter detailed problem description"
          />
        </div>

        {/* Input Conditions */}
        <div className="w-4/5 mx-auto">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Input Conditions
          </label>
          <textarea
            value={problemData.inputCondition}
            onChange={(e) => handleInputChange('inputCondition', e.target.value)}
            className="w-full h-24 px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors resize-none"
            placeholder="Describe input format and constraints"
          />
        </div>

        {/* Output Conditions */}
        <div className="w-4/5 mx-auto">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Output Conditions
          </label>
          <textarea
            value={problemData.outputCondition}
            onChange={(e) => handleInputChange('outputCondition', e.target.value)}
            className="w-full h-24 px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors resize-none"
            placeholder="Describe expected output format"
          />
        </div>

        {/* Constraints */}
        <div className="w-4/5 mx-auto">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Constraints
          </label>
          <input
            type="text"
            value={problemData.constraints}
            onChange={(e) => handleInputChange('constraints', e.target.value)}
            className="w-full h-10 px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Time and memory limits, data ranges"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isFormValid}
        className="w-full bg-blue-500 text-white font-medium text-base px-6 py-3 rounded-md hover:bg-blue-600 disabled:opacity-60 transition-colors"
      >
        Next
      </button>
    </div>
  );
}
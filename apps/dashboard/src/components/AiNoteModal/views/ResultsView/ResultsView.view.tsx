import { ArrowLeft, Check } from 'lucide-react';
import { type AnalysisUnit } from '../../../../store/useAiNoteModalStore';

interface ResultsViewProps {
  analysisResult: AnalysisUnit[];
  hasSelectedUnits: boolean;
  onUnitToggle: (index: number) => void;
  onGenerate: () => void;
  onBack: () => void;
}

export function ResultsViewComponent({
  analysisResult,
  hasSelectedUnits,
  onUnitToggle,
  onGenerate,
  onBack,
}: ResultsViewProps) {
  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Please select the logic to register as an incorrect answer note.
        </h2>
        <p className="text-gray-600">
          AI has analyzed your code into logical units. Select the parts you want to focus on.
        </p>
      </div>

      {/* Analysis Results */}
      <div className="flex-1 overflow-y-auto space-y-4 scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-400">
        {analysisResult.map((unit, index) => (
          <div
            key={index}
            className={`
              border-2 rounded-lg p-4 cursor-pointer transition duration-200
              ${unit.selected
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
            onClick={() => onUnitToggle(index)}
          >
            <div className="flex items-start space-x-3">
              {/* Checkbox */}
              <div className={`
                w-5 h-5 rounded border-2 flex items-center justify-center mt-1
                transition duration-200
                ${unit.selected
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300'
                }
              `}>
                {unit.selected && (
                  <Check className="h-3 w-3 text-white" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {unit.title}
                </h3>
                <p className="text-gray-600 mb-3">
                  {unit.description}
                </p>

                {/* Code Block */}
                <div className="bg-gray-900 rounded-md p-3 overflow-x-auto">
                  <pre className="text-sm text-gray-100">
                    <code>{unit.code}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selection Summary */}
      {hasSelectedUnits && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            {analysisResult.filter(unit => unit.selected).length} logic unit(s) selected
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-3 pt-4 border-t mt-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300
                   text-gray-700 rounded-md hover:bg-gray-50 transition duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>

        <button
          onClick={onGenerate}
          disabled={!hasSelectedUnits}
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md
                   hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed
                   transition duration-200"
        >
          Generate Note with Selected Logic
        </button>
      </div>
    </div>
  );
}
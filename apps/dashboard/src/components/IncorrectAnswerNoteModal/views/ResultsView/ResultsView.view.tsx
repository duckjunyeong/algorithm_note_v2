import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { javascript } from '@codemirror/lang-javascript';
import type { AnalysisResult } from '../../../../store/useIncorrectAnswerNoteStore';

interface ResultsViewProps {
  analysisResult: AnalysisResult[];
  selectedLogic: AnalysisResult | undefined;
  selectedLogicId: string | null;
  onLogicSelect: (id: string) => void;
  onGenerate: () => void;
}

export function ResultsViewComponent({
  analysisResult,
  selectedLogic,
  selectedLogicId,
  onLogicSelect,
  onGenerate
}: ResultsViewProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-8 pt-12 pb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Please select the logic to register as an incorrect answer note.
        </h2>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex px-8 pb-8 gap-6 min-h-0">
        {/* Left Column - Logic List */}
        <div className="w-1/3 flex flex-col">
          <div className="space-y-3 flex-1 overflow-y-auto">
            {analysisResult.map((logic) => (
              <button
                key={logic.id}
                onClick={() => onLogicSelect(logic.id)}
                className={`w-full text-left p-4 rounded-lg transition-colors duration-200 ${
                  selectedLogicId === logic.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <h3 className="font-medium text-sm">{logic.title}</h3>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column - Logic Details */}
        <div className="flex-1 flex flex-col min-h-0">
          {selectedLogic ? (
            <>
              {/* Generate Button */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={onGenerate}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200"
                >
                  Generate
                </button>
              </div>

              {/* Code Display */}
              <div className="flex-1 min-h-0 mb-4">
                <div className="h-full border border-gray-700 rounded-md overflow-hidden">
                  <CodeMirror
                    value={selectedLogic.code}
                    height="100%"
                    theme={oneDark}
                    extensions={[javascript()]}
                    readOnly={true}
                    className="h-full"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Description:</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {selectedLogic.description}
                </p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">Select a logic to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import { oneDark } from '@codemirror/theme-one-dark';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import type { AnalysisResult } from '../../../store/useIncorrectAnswerNoteStore';

interface ResultsViewProps {
  analysisResult: AnalysisResult[];
  selectedAnalysisIndex: number;
  onAnalysisSelect: (index: number) => void;
  onGenerateNote: () => void;
}

export function ResultsView({
  analysisResult,
  selectedAnalysisIndex,
  onAnalysisSelect,
  onGenerateNote
}: ResultsViewProps) {
  const selectedLogic = analysisResult[selectedAnalysisIndex];

  return (
    <div className="p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">
          Please select the logic to register as an incorrect answer note.
        </h2>
        <button
          onClick={onGenerateNote}
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md transition-colors"
        >
          Generate Note with Selected Logic
        </button>
      </div>

      <div className="flex gap-6 h-full pt-4">
        {/* Left Column - Logic Title List */}
        <div className="w-1/3 flex flex-col gap-2 overflow-y-auto" style={{scrollbarWidth: 'thin', scrollbarColor: '#4B5563 #1F2937'}}>
          {analysisResult.map((result, index) => (
            <button
              key={index}
              onClick={() => onAnalysisSelect(index)}
              className={`w-full text-left p-3 rounded-md transition-colors ${
                index === selectedAnalysisIndex
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {result.title}
            </button>
          ))}
        </div>

        {/* Right Column - Selected Logic Details */}
        <div className="w-2/3 flex flex-col">
          {selectedLogic && (
            <>
              {/* Code Display */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">Code</h3>
                <div className="border border-gray-600 rounded-md overflow-hidden">
                  <CodeMirror
                    value={selectedLogic.code}
                    extensions={[javascript()]}
                    theme={oneDark}
                    readOnly={true}
                    basicSetup={{
                      lineNumbers: true,
                      foldGutter: false,
                      dropCursor: false,
                      allowMultipleSelections: false,
                      indentOnInput: false,
                      bracketMatching: true,
                      closeBrackets: false,
                      autocompletion: false,
                      highlightSelectionMatches: false,
                      searchKeymap: false,
                    }}
                    style={{ fontSize: '14px' }}
                  />
                </div>
              </div>

              {/* Description Display */}
              <div className="mt-4 p-4 bg-gray-800 rounded-md text-gray-300">
                <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                <p className="leading-relaxed">{selectedLogic.description}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
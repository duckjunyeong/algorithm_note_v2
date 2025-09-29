// AlgorithmLogicFlowAnalysisPage/AlgorithmLogicFlowAnalysisPageView.tsx
import type { FC } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeLight } from '@uiw/codemirror-theme-vscode';
import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { FiEdit, FiTrash2, FiMoreVertical } from 'react-icons/fi';
import { EditorView } from '@codemirror/view';
import ChatModal from './components/ChatModal';

interface AnalysisStep { id: string; title: string; code: string; }
interface AnalysisResult { problemTitle: string; language: string; analysis: AnalysisStep[]; }

export interface AlgorithmLogicFlowAnalysisPageViewProps {
  analysisResult: AnalysisResult | null;
  selectedStep: AnalysisStep | null;
  isChatModalOpen: boolean;
  chatModalStep: AnalysisStep | null;
  handleSelectStep: (step: AnalysisStep) => void;
  handleOpenChatModal: (step: AnalysisStep) => void;
  handleCloseChatModal: () => void;
}

const transparentTheme = EditorView.theme({
  '&': {
    backgroundColor: 'transparent !important',
    height: '100%',
    border: 'none !important',
  },
  '.cm-gutters': {
    backgroundColor: 'transparent !important',
    borderRight: 'none !important',
  },
  '.cm-scroller': {
    overflow: 'auto',
  },
});


export const AlgorithmLogicFlowAnalysisPageView: FC<AlgorithmLogicFlowAnalysisPageViewProps> = ({
  analysisResult,
  selectedStep,
  isChatModalOpen,
  chatModalStep,
  handleSelectStep,
  handleOpenChatModal,
  handleCloseChatModal,
}) => {
  if (!analysisResult) {
    return <div>Loading analysis...</div>;
  }

  const languageExtensions = {
    javascript: [javascript({ jsx: true })],
    cpp: [cpp()],
    java: [java()],
    python: [python()],
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-yellow-50 via-purple-50 to-sky-100">
      <div className="w-1/3 overflow-y-auto p-8">
        <h1 className="text-2xl font-bold text-text-primary">{analysisResult.problemTitle}</h1>
        <p className="mt-2 text-text-secondary">AI가 분석한 로직 흐름입니다.</p>
        
        <div className="mt-8 space-y-4">
          {analysisResult.analysis.map((step, index) => (
            <div
              key={step.id}
              onClick={() => handleSelectStep(step)}
              className={`cursor-pointer rounded-lg border p-4 transition-all ${selectedStep?.id === step.id ? 'border-brand/50 bg-white/50 shadow-md' : 'border-neutral-200/50 bg-white/30 hover:bg-white/50'}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className={`font-semibold ${selectedStep?.id === step.id ? 'text-brand-dark' : 'text-text-primary'}`}>
                     {step.title}
                  </h3>
                  <span className="text-sm text-text-tertiary">Logic Step</span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenChatModal(step);
                }}
                className="mt-3 w-full px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                오답노트 만들기
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="w-2/3 flex flex-col p-4">
        {selectedStep ? (
           <div className="h-full overflow-hidden rounded-lg">
             <CodeMirror
                value={selectedStep.code}
                height="100%"
                theme={vscodeLight}
                extensions={[
                  languageExtensions[analysisResult.language],
                  transparentTheme, 
                ]}
                readOnly={true}
                className="h-full"
            />
           </div>
        ) : (
            <div className="flex h-full items-center justify-center text-text-secondary">
                왼쪽에서 분석 단계를 선택하세요.
            </div>
        )}
      </div>

      <ChatModal
        isOpen={isChatModalOpen}
        onClose={handleCloseChatModal}
        title="오답노트 만들기"
        selectedStep={chatModalStep}
      />
    </div>
  );
};
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

interface AnalysisStep { id: string; title: string; code: string; }
interface AnalysisResult { problemTitle: string; language: string; analysis: AnalysisStep[]; }

export interface AlgorithmLogicFlowAnalysisPageViewProps {
  analysisResult: AnalysisResult | null;
  selectedStep: AnalysisStep | null;
  handleSelectStep: (step: AnalysisStep) => void;
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
  handleSelectStep,
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
    // 🔥 수정: 최상위 div에 그라데이션 배경 적용
    <div className="flex h-screen bg-gradient-to-br from-yellow-50 via-purple-50 to-sky-100">
      {/* 🔥 수정: 왼쪽 영역에서 배경색 관련 클래스 제거 */}
      <div className="w-1/3 overflow-y-auto p-8">
        <h1 className="text-2xl font-bold text-text-primary">{analysisResult.problemTitle}</h1>
        <p className="mt-2 text-text-secondary">AI가 분석한 로직 흐름입니다.</p>
        
        <div className="mt-8 space-y-4">
          {analysisResult.analysis.map((step, index) => (
            <div
              key={step.id}
              onClick={() => handleSelectStep(step)}
              // 🔥 수정: 선택된 항목과 기본 항목의 배경을 투명하게 하거나 미세한 효과만 주도록 변경
              className={`cursor-pointer rounded-lg border p-4 transition-all ${selectedStep?.id === step.id ? 'border-brand/50 bg-white/50 shadow-md' : 'border-neutral-200/50 bg-white/30 hover:bg-white/50'}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className={`font-semibold ${selectedStep?.id === step.id ? 'text-brand-dark' : 'text-text-primary'}`}>
                    {index + 1}. {step.title}
                  </h3>
                  <span className="text-sm text-text-tertiary">Logic Step</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-text-secondary hover:text-text-primary"><FiEdit size={16}/></button>
                  <button className="text-semantic-error/70 hover:text-semantic-error"><FiTrash2 size={16}/></button>
                  <button className="text-text-secondary hover:text-text-primary"><FiMoreVertical size={16}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 수정: 오른쪽 영역에서 배경색 관련 클래스 제거 (부모로부터 상속) */}
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
    </div>
  );
};
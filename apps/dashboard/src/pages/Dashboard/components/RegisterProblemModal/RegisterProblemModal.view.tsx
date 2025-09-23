// RegisterProblemModal/RegisterProblemModal.view.tsx
import type { FC } from 'react';
import { FiLayers, FiCheck, FiBell, FiArrowLeft } from 'react-icons/fi';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';

interface UseRegisterProblemModal {
  view: 'selection' | 'url' | 'manual' | 'editor';
  url: string;
  title: string;
  description: string;
  inputCondition: string;
  outputCondition: string;
  constraints: string;
  code: string;
  language: string;
  errors: { [key: string]: string | undefined };
  goToUrlView: () => void;
  goToManualView: () => void;
  goToSelectionView: () => void;
  handleUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleInputConditionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleOutputConditionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleConstraintsChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleCodeChange: (value: string) => void;
  handleLanguageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleUrlSubmit: (e: React.FormEvent) => void;
  handleManualSubmit: (e: React.FormEvent) => void;
}
export interface RegisterProblemModalViewProps {
  isOpen: boolean;
  onAttemptClose: () => void;
  logic: UseRegisterProblemModal;
}


// --- 내부 View 컴포넌트들 ---

const SelectionView: FC<Pick<UseRegisterProblemModal, 'goToUrlView' | 'goToManualView'>> = ({ goToUrlView, goToManualView }) => (
  <>
    <div className="flex flex-col items-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-brand/10 text-brand"><FiLayers size={32} /></div>
      <p className="mt-4 text-lg text-text-secondary">오답노트를 만들기 위해서 먼저 문제를 등록해야해요</p>
    </div>
    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
      <div onClick={goToUrlView} className="flex cursor-pointer flex-col items-center rounded-lg border border-neutral-100 bg-neutral-50 p-6 text-center transition-all hover:border-brand hover:shadow-md">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-semantic-success/10 text-semantic-success"><FiCheck size={24} /></div>
        <h3 className="mt-4 text-[13px] font-bold text-text-primary">URL</h3>
        <p className="mt-2 text-xs text-text-secondary">백준 URL 링크로 문제 등록</p>
        <button className="mt-6 w-full rounded-md border border-neutral-300 py-2 text-sm font-semibold text-text-secondary transition-colors hover:border-brand hover:bg-brand hover:text-text-inverse">GO</button>
      </div>
      <div onClick={goToManualView} className="flex cursor-pointer flex-col items-center rounded-lg border border-neutral-100 bg-neutral-50 p-6 text-center transition-all hover:border-brand hover:shadow-md">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand"><FiBell size={24} /></div>
        <h3 className="mt-4 text-[13px] font-bold text-text-primary">수동</h3>
        <p className="mt-2 text-xs text-text-secondary">간단한 입력으로 등록</p>
        <button className="mt-6 w-full rounded-md border border-neutral-300 py-2 text-sm font-semibold text-text-secondary transition-colors hover:border-brand hover:bg-brand hover:text-text-inverse">GO</button>
      </div>
    </div>
  </>
);

const UrlView: FC<Pick<UseRegisterProblemModal, 'url' | 'errors' | 'goToSelectionView' | 'handleUrlChange' | 'handleUrlSubmit'>> = ({ url, errors, goToSelectionView, handleUrlChange, handleUrlSubmit }) => (
  <>
    <div className="relative flex items-center justify-center">
      <button onClick={goToSelectionView} className="absolute left-0 text-neutral-500 hover:text-text-primary transition-colors" aria-label="뒤로 가기"><FiArrowLeft size={24} /></button>
      <h2 className="text-xl font-bold text-text-primary">문제 링크(URL) 등록</h2>
    </div>
    <p className="mt-4 text-center text-sm text-text-secondary">등록할 문제의 전체 주소(URL)를 입력해주세요.</p>
    <form onSubmit={handleUrlSubmit} className="mt-8">
      <div className="flex flex-col">
        <label htmlFor="problem-url" className="text-sm font-semibold text-text-primary">문제 링크</label>
        <input id="problem-url" type="url" value={url} onChange={handleUrlChange} placeholder="문제 URL 입력 (예: https://www.acmicpc.net/problem/1000)" className={`mt-2 w-full rounded-md border bg-background-tertiary px-4 py-2 text-text-primary placeholder:text-text-placeholder focus:border-brand focus:ring-1 focus:ring-brand outline-none ${errors.url ? 'border-semantic-error' : 'border-neutral-300'}`} />
        {errors.url && <p className="mt-1 text-xs text-semantic-error">{errors.url}</p>}
      </div>
      <button type="submit" className="mt-6 w-full rounded-md bg-brand py-3 text-base font-semibold text-text-inverse transition-colors hover:bg-brand-dark">계속하기</button>
    </form>
  </>
);

const ManualView: FC<Omit<UseRegisterProblemModal, 'url' | 'goToUrlView' | 'goToManualView' | 'handleUrlChange' | 'handleUrlSubmit' | 'code' | 'language' | 'handleCodeChange' | 'handleLanguageChange'>> = (props) => (
    <>
      <div className="relative flex items-center justify-center">
        <button onClick={props.goToSelectionView} className="absolute left-0 text-neutral-500 hover:text-text-primary transition-colors" aria-label="뒤로 가기"><FiArrowLeft size={24} /></button>
        <h2 className="text-xl font-bold text-text-primary">수동으로 등록</h2>
      </div>
      <p className="mt-4 text-center text-sm text-text-secondary">문제 제목과 설명을 직접 입력해주세요.</p>
      <form onSubmit={props.handleManualSubmit} className="mt-8 space-y-6">
        <div>
          <label htmlFor="problem-title" className="text-sm font-semibold text-text-primary">문제 제목*</label>
          <input id="problem-title" type="text" value={props.title} onChange={props.handleTitleChange} placeholder="문제 제목" className={`mt-2 w-full rounded-md border bg-background-tertiary px-4 py-2 text-text-primary placeholder:text-text-placeholder focus:border-brand focus:ring-1 focus:ring-brand outline-none ${props.errors.title ? 'border-semantic-error' : 'border-neutral-300'}`} />
          {props.errors.title && <p className="mt-1 text-xs text-semantic-error">{props.errors.title}</p>}
        </div>
        <div>
          <label htmlFor="problem-description" className="text-sm font-semibold text-text-primary">문제 설명*</label>
          <textarea id="problem-description" value={props.description} onChange={props.handleDescriptionChange} placeholder="문제 설명을 붙여넣어주세요" rows={6} className={`mt-2 w-full rounded-md border bg-background-tertiary px-4 py-2 text-text-primary placeholder:text-text-placeholder focus:border-brand focus:ring-1 focus:ring-brand outline-none resize-none ${props.errors.description ? 'border-semantic-error' : 'border-neutral-300'}`} />
          {props.errors.description && <p className="mt-1 text-xs text-semantic-error">{props.errors.description}</p>}
        </div>
        <div>
          <label htmlFor="input-condition" className="text-sm font-semibold text-text-primary">입력 조건*</label>
          <textarea id="input-condition" value={props.inputCondition} onChange={props.handleInputConditionChange} placeholder="입력 조건을 붙여넣어주세요" rows={4} className={`mt-2 w-full rounded-md border bg-background-tertiary px-4 py-2 text-text-primary placeholder:text-text-placeholder focus:border-brand focus:ring-1 focus:ring-brand outline-none resize-none ${props.errors.inputCondition ? 'border-semantic-error' : 'border-neutral-300'}`} />
          {props.errors.inputCondition && <p className="mt-1 text-xs text-semantic-error">{props.errors.inputCondition}</p>}
        </div>
        <div>
          <label htmlFor="output-condition" className="text-sm font-semibold text-text-primary">출력 조건*</label>
          <textarea id="output-condition" value={props.outputCondition} onChange={props.handleOutputConditionChange} placeholder="출력 조건을 붙여넣어주세요" rows={4} className={`mt-2 w-full rounded-md border bg-background-tertiary px-4 py-2 text-text-primary placeholder:text-text-placeholder focus:border-brand focus:ring-1 focus:ring-brand outline-none resize-none ${props.errors.outputCondition ? 'border-semantic-error' : 'border-neutral-300'}`} />
          {props.errors.outputCondition && <p className="mt-1 text-xs text-semantic-error">{props.errors.outputCondition}</p>}
        </div>
        <div>
          <label htmlFor="constraints" className="text-sm font-semibold text-text-primary">제한 조건</label>
          <textarea id="constraints" value={props.constraints} onChange={props.handleConstraintsChange} placeholder="제한 조건을 붙여넣어주세요 (선택)" rows={3} className="mt-2 w-full rounded-md border border-neutral-300 bg-background-tertiary px-4 py-2 text-text-primary placeholder:text-text-placeholder focus:border-brand focus:ring-1 focus:ring-brand outline-none resize-none" />
        </div>
        <button type="submit" className="w-full rounded-md bg-brand py-3 text-base font-semibold text-text-inverse transition-colors hover:bg-brand-dark">등록하기</button>
      </form>
    </>
);

const EditorView: FC<Pick<UseRegisterProblemModal, 'code' | 'language' | 'goToSelectionView' | 'handleCodeChange' | 'handleLanguageChange'>> = ({ code, language, goToSelectionView, handleCodeChange, handleLanguageChange }) => {
  const languageExtensions = {
    javascript: [javascript({ jsx: true })],
    cpp: [cpp()],
    java: [java()],
    python: [python()],
  };
  
  return (
    <>
      <div className="relative flex items-center justify-center">
        <button onClick={goToSelectionView} className="absolute left-0 text-neutral-500 hover:text-text-primary transition-colors" aria-label="뒤로 가기"><FiArrowLeft size={24} /></button>
        <h2 className="text-xl font-bold text-text-primary">오답 코드 등록</h2>
      </div>
      <p className="mt-4 text-center text-sm text-text-secondary">오답 코드를 붙여넣고 분석을 시작하세요.</p>
      
      <div className="mt-8">
        <div className="flex justify-end mb-2">
            <select value={language} onChange={handleLanguageChange} className="rounded border-neutral-300 text-sm focus:border-brand focus:ring-brand">
                <option value="javascript">JavaScript</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="python">Python</option>
            </select>
        </div>
        <div className="rounded-md border border-neutral-200 overflow-hidden">
            {/* 🔥 수정: CodeMirror 높이를 800px로 변경 */}
            <CodeMirror
                value={code}
                height="800px"
                theme={vscodeDark}
                extensions={languageExtensions[language]}
                onChange={handleCodeChange}
            />
        </div>
      </div>
       <button type="submit" className="mt-6 w-full rounded-md bg-brand py-3 text-base font-semibold text-text-inverse transition-colors hover:bg-brand-dark">분석 시작하기</button>
    </>
  );
};


export const RegisterProblemModalView: FC<RegisterProblemModalViewProps> = ({ isOpen, onAttemptClose, logic }) => {
  if (!isOpen) return null;

  // 🔥 수정: Editor View일 때 모달 너비를 더 넓게 (max-w-4xl)
  const modalWidth = logic.view === 'editor' ? 'max-w-4xl' : 'max-w-2xl';

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onAttemptClose(); }} className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 p-4">
      <div 
        onClick={(e) => e.stopPropagation()} 
        className={`relative w-full rounded-xl bg-background-secondary p-8 shadow-xl max-h-[90vh] overflow-y-auto transition-all duration-300 
                   ${modalWidth} 
                   [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-neutral-100 
                   [&::-webkit-scrollbar-thumb]:bg-neutral-300 [&::-webkit-scrollbar-thumb]:rounded-full
                   hover:[&::-webkit-scrollbar-thumb]:bg-neutral-400`}
      >
        {logic.view === 'selection' && <SelectionView goToUrlView={logic.goToUrlView} goToManualView={logic.goToManualView} />}
        {logic.view === 'url' && <UrlView {...logic} />}
        {logic.view === 'manual' && <ManualView {...logic} />}
        {logic.view === 'editor' && <EditorView {...logic} />}
      </div>
    </div>
  );
};
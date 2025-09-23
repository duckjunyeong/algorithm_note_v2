// RegisterProblemModal/RegisterProblemModal.view.tsx
import type { FC } from 'react';
import { FiLayers, FiCheck, FiBell, FiArrowLeft } from 'react-icons/fi';

interface UseRegisterProblemModal {
  view: 'selection' | 'url' | 'manual';
  url: string;
  goToUrlView: () => void;
  goToManualView: () => void;
  goToSelectionView: () => void;
  handleUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUrlSubmit: (e: React.FormEvent) => void;
}

export interface RegisterProblemModalViewProps {
  isOpen: boolean;
  onAttemptClose: () => void;
  logic: UseRegisterProblemModal;
}

const SelectionView: FC<Pick<UseRegisterProblemModal, 'goToUrlView' | 'goToManualView'>> = ({ goToUrlView, goToManualView }) => (
  <>
    <div className="flex flex-col items-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-brand/10 text-brand">
        <FiLayers size={32} />
      </div>
      <p className="mt-4 text-lg text-text-secondary">
        오답노트를 만들기 위해서 먼저 문제를 등록해야해요
      </p>
    </div>
    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="flex flex-col items-center rounded-lg border border-neutral-100 bg-neutral-50 p-6 text-center transition-all hover:border-brand hover:shadow-md">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-semantic-success/10 text-semantic-success"><FiCheck size={24} /></div>
        <h3 className="mt-4 text-[13px] font-bold text-text-primary">URL</h3>
        <p className="mt-2 text-xs text-text-secondary">백준 URL 링크로 문제 등록</p>
        <button onClick={goToUrlView} className="mt-6 w-full rounded-md border border-neutral-300 py-2 text-sm font-semibold text-text-secondary transition-colors hover:border-brand hover:bg-brand hover:text-text-inverse">GO</button>
      </div>
      <div className="flex flex-col items-center rounded-lg border border-neutral-100 bg-neutral-50 p-6 text-center transition-all hover:border-brand hover:shadow-md">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand"><FiBell size={24} /></div>
        <h3 className="mt-4 text-[13px] font-bold text-text-primary">수동</h3>
        <p className="mt-2 text-xs text-text-secondary">간단한 입력으로 등록</p>
        <button onClick={goToManualView} className="mt-6 w-full rounded-md border border-neutral-300 py-2 text-sm font-semibold text-text-secondary transition-colors hover:border-brand hover:bg-brand hover:text-text-inverse">GO</button>
      </div>
    </div>
  </>
);

const UrlView: FC<Pick<UseRegisterProblemModal, 'url' | 'goToSelectionView' | 'handleUrlChange' | 'handleUrlSubmit'>> = ({ url, goToSelectionView, handleUrlChange, handleUrlSubmit }) => (
  <>
    <div className="relative flex items-center justify-center">
      <button onClick={goToSelectionView} className="absolute left-0 text-neutral-500 hover:text-text-primary transition-colors" aria-label="뒤로 가기">
        <FiArrowLeft size={24} />
      </button>
      <h2 className="text-xl font-bold text-text-primary">문제 링크(URL) 등록</h2>
    </div>
    <p className="mt-4 text-center text-sm text-text-secondary">등록할 문제의 전체 주소(URL)를 입력해주세요.</p>
    <form onSubmit={handleUrlSubmit} className="mt-8">
      <div className="flex flex-col">
        <label htmlFor="problem-url" className="text-sm font-semibold text-text-primary">문제 링크</label>
        <input id="problem-url" type="url" value={url} onChange={handleUrlChange} placeholder="문제 URL 입력 (예: https://www.acmicpc.net/problem/1000)" className="mt-2 w-full rounded-md border border-neutral-300 bg-background-tertiary px-4 py-2 text-text-primary placeholder:text-text-placeholder focus:border-brand focus:ring-1 focus:ring-brand outline-none" />
      </div>
      <button type="submit" className="mt-6 w-full rounded-md bg-brand py-3 text-base font-semibold text-text-inverse transition-colors hover:bg-brand-dark">계속하기</button>
    </form>
  </>
);

const ManualView: FC<Pick<UseRegisterProblemModal, 'goToSelectionView'>> = ({ goToSelectionView }) => (
    <>
      <div className="relative flex items-center justify-center">
        <button onClick={goToSelectionView} className="absolute left-0 text-neutral-500 hover:text-text-primary transition-colors" aria-label="뒤로 가기">
          <FiArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold text-text-primary">수동 등록</h2>
      </div>
      <p className="mt-4 text-center">수동 등록 화면입니다.</p>
    </>
);


export const RegisterProblemModalView: FC<RegisterProblemModalViewProps> = ({ isOpen, onAttemptClose, logic }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onAttemptClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50"
    >
      <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-2xl rounded-xl bg-background-secondary p-8 shadow-xl">
        {logic.view === 'selection' && <SelectionView goToUrlView={logic.goToUrlView} goToManualView={logic.goToManualView} />}
        {logic.view === 'url' && <UrlView url={logic.url} goToSelectionView={logic.goToSelectionView} handleUrlChange={logic.handleUrlChange} handleUrlSubmit={logic.handleUrlSubmit} />}
        {logic.view === 'manual' && <ManualView goToSelectionView={logic.goToSelectionView} />}
      </div>
    </div>
  );
};
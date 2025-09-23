// ConfirmModal/ConfirmModal.view.tsx
import type { FC } from 'react';
import { FiX } from 'react-icons/fi';

export interface ConfirmModalViewProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModalView: FC<ConfirmModalViewProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-neutral-900/50"
    >
      <div
        className="w-full max-w-md rounded-xl bg-background-secondary p-6 shadow-xl"
      >
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-bold text-text-primary">{title}</h2>
          <button onClick={onCancel} className="text-neutral-400 transition-colors hover:text-text-primary">
            <FiX size={20} />
          </button>
        </div>
        <p className="mt-2 text-sm text-text-secondary">{message}</p>
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-semibold text-text-secondary transition-colors hover:bg-neutral-50 hover:border-neutral-300"
          >
            채팅 계속하기
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-semantic-error px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-semantic-error/90"
          >
            중단하기
          </button>
        </div>
      </div>
    </div>
  );
};
// ConfirmModal/ConfirmModal.view.tsx
import type { FC } from 'react';
import { FiX } from 'react-icons/fi';

export interface ConfirmModalViewProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmModalView: FC<ConfirmModalViewProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isLoading = false,
  confirmText = "중단하기",
  cancelText = "취소",
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-neutral-900/50"
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
            disabled={isLoading}
            className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-semibold text-text-secondary transition-colors hover:bg-neutral-50 hover:border-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-lg bg-semantic-error px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-semantic-error/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
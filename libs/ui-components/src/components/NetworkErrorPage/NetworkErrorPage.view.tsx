import type { FC } from 'react';
import { WifiOff } from 'lucide-react';

export interface NetworkErrorPageViewProps {
  onRetry: () => void;
  isRetrying?: boolean;
}

export const NetworkErrorPageView: FC<NetworkErrorPageViewProps> = ({
  onRetry,
  isRetrying = false,
}) => {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center px-4 py-12">
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-semantic-error/10">
          <WifiOff className="h-10 w-10 text-semantic-error" strokeWidth={1.5} />
        </div>

        <h2 className="mb-3 text-2xl font-bold text-text-primary">
          네트워크가 불안정합니다
        </h2>

        <p className="mb-8 max-w-md text-sm text-text-secondary">
          인터넷 연결을 확인하고 다시 시도해주세요
        </p>

        <button
          onClick={onRetry}
          disabled={isRetrying}
          className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-2"
        >
          {isRetrying && (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          )}
          다시 시도
        </button>
      </div>
    </div>
  );
};

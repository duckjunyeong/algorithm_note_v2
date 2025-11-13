import { useState } from 'react';
import type { NetworkErrorPageViewProps } from './NetworkErrorPage.view';

interface UseNetworkErrorPageProps {
  onRetry: () => void | Promise<void>;
}

export const useNetworkErrorPage = ({
  onRetry,
}: UseNetworkErrorPageProps): NetworkErrorPageViewProps => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  return {
    onRetry: handleRetry,
    isRetrying,
  };
};

import { NetworkErrorPageView } from './NetworkErrorPage.view';
import { useNetworkErrorPage } from './useNetworkErrorPage';

interface NetworkErrorPageProps {
  onRetry: () => void | Promise<void>;
}

export const NetworkErrorPage = ({ onRetry }: NetworkErrorPageProps) => {
  const props = useNetworkErrorPage({ onRetry });
  return <NetworkErrorPageView {...props} />;
};

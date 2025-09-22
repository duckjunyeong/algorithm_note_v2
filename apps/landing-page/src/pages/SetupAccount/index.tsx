import { useSetupAccount } from './useSetupAccount';
import { SetupAccountView } from './SetupAccount.view';

export default function SetupAccountPage() {
  useSetupAccount();

  return <SetupAccountView />;
}
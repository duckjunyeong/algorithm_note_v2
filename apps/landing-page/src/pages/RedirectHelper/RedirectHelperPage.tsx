import { useEffect } from 'react';

function LoadingSpinner() {
  return (
    <></>
  );
}


function RedirectHelperPage() {
  const externalUrl = import.meta.env.VITE_DASHBOARD_URL;

  useEffect(() => {
    window.location.replace(externalUrl);
  }, []);

  return <LoadingSpinner />;
}

export default RedirectHelperPage;
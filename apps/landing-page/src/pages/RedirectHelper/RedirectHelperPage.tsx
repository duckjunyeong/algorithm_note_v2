import { useEffect } from 'react';

function LoadingSpinner() {
  return (
    <></>
  );
}


function RedirectHelperPage() {
  const externalUrl = 'http://localhost:5173';

  useEffect(() => {
    window.location.replace(externalUrl);
  }, []);

  return <LoadingSpinner />;
}

export default RedirectHelperPage;
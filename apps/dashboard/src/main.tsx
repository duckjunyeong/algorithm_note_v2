import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react';
import { QueryClientProvider } from '@tanstack/react-query';
import { QueryClient } from '@tanstack/react-query';

import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient();
const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById('root')!).render(
   <QueryClientProvider client={queryClient}>
    <ClerkProvider
        publishableKey={publishableKey}
        signInUrl={import.meta.env.VITE_CLERK_SIGN_IN_URL}
        signUpUrl={import.meta.env.VITE_CLERK_SIGN_UP_URL}
      >
        <App />
    </ClerkProvider>
  </QueryClientProvider>,
)

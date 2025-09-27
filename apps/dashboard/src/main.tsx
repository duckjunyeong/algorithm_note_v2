import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react';
import { ERROR_MESSAGES } from './constants/messages';

import './index.css'
import App from './App.tsx'

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById('root')!).render(
  <ClerkProvider
      publishableKey={publishableKey}
      signInUrl={import.meta.env.VITE_CLERK_SIGN_IN_URL}
      signUpUrl={import.meta.env.VITE_CLERK_SIGN_UP_URL}
    >
      <App />
  </ClerkProvider>,
)

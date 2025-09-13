import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!publishableKey) {
  throw new Error('Missing Publishable Key')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={publishableKey}
      signInUrl={import.meta.env.VITE_CLERK_SIGN_IN_URL}
      signUpUrl={import.meta.env.VITE_CLERK_SIGN_UP_URL}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
)

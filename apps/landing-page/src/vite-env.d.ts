/// <reference types="vite/client" />

interface ImportMetaEnv {
  // App URLs
  readonly VITE_DASHBOARD_URL: string;
  readonly VITE_LANDING_URL: string;

  // Clerk Configuration
  readonly VITE_CLERK_PUBLISHABLE_KEY: string;
  readonly VITE_CLERK_SIGN_IN_URL: string;
  readonly VITE_CLERK_SIGN_UP_URL: string;

  // App Configuration
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

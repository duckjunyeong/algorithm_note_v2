/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLERK_PUBLISHABLE_KEY: string;
  readonly VITE_CLERK_SIGN_IN_URL: string;
  readonly VITE_CLERK_SIGN_UP_URL: string;
  readonly VITE_CLERK_SIGN_IN_FORCE_REDIRECT_URL: string;
  readonly VITE_CLERK_SIGN_UP_FORCE_REDIRECT_URL: string;
  readonly VITE_MIN_REPEAT_CYCLE_MS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

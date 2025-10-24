export const PATHS = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  SIGN_IN: `${import.meta.env.VITE_LANDING_URL}/sign-in`,
  SIGN_UP: `${import.meta.env.VITE_LANDING_URL}/sign-up`,
} as const;
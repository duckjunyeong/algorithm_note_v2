export const ERROR_MESSAGES = {
  AUTH_TOKEN_FAILED: 'Failed to get authentication token:',
  MISSING_PUBLISHABLE_KEY: 'Missing Publishable Key',
  PROBLEM_REGISTRATION_FAILED: 'Problem registration failed',
  PROBLEM_SAVE_FAILED: 'Failed to save problem',
  CLEANUP_FAILED: 'Failed to cleanup problem data',
} as const;

export const UI_TEXT = {
  APP_NAME: 'AlgorNote',
  DASHBOARD: {
    WELCOME: 'Welcome to Dashboard',
    NO_PROBLEMS: 'No problems registered yet',
  },
  PROBLEMS: {
    REGISTER_TITLE: 'Register Problem',
    REGISTER_SUCCESS: 'Problem registered successfully',
    SAVE_SUCCESS: 'Problem saved successfully',
  },
} as const;
export const API_CONFIG = {
  DEFAULT_BASE_URL: 'http://localhost:8080/api',
  TIMEOUT: 3000000,
  HEADERS: {
    CONTENT_TYPE: 'application/json',
  },
} as const;

export const API_ENDPOINTS = {
  PROBLEMS: {
    REGISTER_URL: '/problems/register/url',
    REGISTER_MANUAL: '/problems/register/manual',
    SAVE: '/problems/save',
    CLEANUP: '/problems/cleanup',
    CODE_ANALYZE: '/problems/code/analyze',
  },
} as const;

export const HTTP_HEADERS = {
  AUTHORIZATION: 'Authorization',
  CONTENT_TYPE: 'Content-Type',
  BEARER_PREFIX: 'Bearer',
} as const;
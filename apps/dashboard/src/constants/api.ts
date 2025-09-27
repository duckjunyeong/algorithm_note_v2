export const API_CONFIG = {
  DEFAULT_BASE_URL: 'http://localhost:8080/api',
  TIMEOUT: 10000,
  HEADERS: {
    CONTENT_TYPE: 'application/json',
  },
} as const;

export const API_ENDPOINTS = {
  PROBLEMS: {
    REGISTER_URL: '/register/url',
    REGISTER_MANUAL: '/register/manual',
    SAVE: '/save',
    CLEANUP: '/cleanup',
  },
} as const;

export const HTTP_HEADERS = {
  AUTHORIZATION: 'Authorization',
  CONTENT_TYPE: 'Content-Type',
  BEARER_PREFIX: 'Bearer',
} as const;
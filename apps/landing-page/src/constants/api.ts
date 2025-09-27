export const API_CONFIG = {
  DEFAULT_BASE_URL: 'http://localhost:8080/api',
  TIMEOUT: 10000,
  HEADERS: {
    CONTENT_TYPE: 'application/json',
  },
} as const;

export const API_ENDPOINTS = {
  USERS: {
    PROFILE: '/users/profile',
    STATS: '/users/stats',
  },
} as const;

export const HTTP_HEADERS = {
  AUTHORIZATION: 'Authorization',
  CONTENT_TYPE: 'Content-Type',
  BEARER_PREFIX: 'Bearer',
} as const;
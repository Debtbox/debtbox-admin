export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://api.debtbox.sa/v0.0.1/api';

/** Admin access token TTL: 24 hours (in days for cookie) */
export const ADMIN_ACCESS_TOKEN_TTL_DAYS = 1;
/** Admin refresh token TTL: 30 days */
export const ADMIN_REFRESH_TOKEN_TTL_DAYS = 30;

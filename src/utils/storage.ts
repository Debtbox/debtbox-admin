import Cookies from 'js-cookie';
import { ADMIN_ACCESS_TOKEN_TTL_DAYS, ADMIN_REFRESH_TOKEN_TTL_DAYS } from './const';

export const ACCESS_TOKEN_KEY = 'access_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';

export const getCookie = (name: string): string | undefined => {
  return Cookies.get(name);
};

export const setCookie = (name: string, value: string, options?: Cookies.CookieAttributes): void => {
  Cookies.set(name, value, options);
};

export const clearCookie = (name: string): void => {
  Cookies.remove(name);
};

export const setAuthTokens = (accessToken: string, refreshToken: string): void => {
  setCookie(ACCESS_TOKEN_KEY, accessToken, { expires: ADMIN_ACCESS_TOKEN_TTL_DAYS, sameSite: 'strict' });
  setCookie(REFRESH_TOKEN_KEY, refreshToken, { expires: ADMIN_REFRESH_TOKEN_TTL_DAYS, sameSite: 'strict' });
};

export const clearAuthTokens = (): void => {
  clearCookie(ACCESS_TOKEN_KEY);
  clearCookie(REFRESH_TOKEN_KEY);
};

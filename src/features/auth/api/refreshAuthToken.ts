import Axios from 'axios';
import { API_BASE_URL } from '@/utils/const';
import { getCookie, REFRESH_TOKEN_KEY } from '@/utils/storage';
import { setAuthTokens } from '@/utils/storage';
import type { RefreshTokenResponse } from './refreshToken';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';

/**
 * Standalone refresh call used by axios interceptor (avoids circular dependency).
 * Returns new tokens or throws.
 */
export async function refreshAuthToken(): Promise<RefreshTokenResponse> {
  const refreshTokenValue = getCookie(REFRESH_TOKEN_KEY);
  if (!refreshTokenValue) {
    throw new Error('No refresh token');
  }
  const language = getLanguageFromCookie();
  const { data } = await Axios.post<RefreshTokenResponse>(
    `${API_BASE_URL}/auth/admin/refresh`,
    { refreshToken: refreshTokenValue },
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': language,
      },
      timeout: 10000,
    },
  );
  if (data?.data?.accessToken && data?.data?.refreshToken) {
    setAuthTokens(data.data.accessToken, data.data.refreshToken);
  }
  return data;
}

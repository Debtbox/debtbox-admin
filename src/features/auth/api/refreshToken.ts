import { axios } from '@/lib/axios';
import type { MutationConfig } from '@/lib/react-query';
import type { ApiError } from '@/types/ApiError';
import { useMutation } from '@tanstack/react-query';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';
import type { AuthRefreshData, AuthSuccessResponse } from '../types/auth';

export type RefreshTokenCredentialsDTO = {
  refreshToken: string;
};

export type RefreshTokenResponse = AuthSuccessResponse<AuthRefreshData>;

export const refreshToken = (data: RefreshTokenCredentialsDTO): Promise<RefreshTokenResponse> => {
  const language = getLanguageFromCookie();
  return axios.post('/auth/admin/refresh', data, {
    headers: {
      'Accept-Language': language,
    },
  });
};

type UseRefreshToken = {
  config?: MutationConfig<typeof refreshToken>;
  onSuccess: (data: RefreshTokenResponse) => void;
  onError: (error: ApiError) => void;
};

export const useRefreshToken = ({ config, onError, onSuccess }: UseRefreshToken) => {
    return useMutation({
        ...config,
        mutationFn: refreshToken,
        onSuccess: (data) => {
          onSuccess(data);
        },
        onError: (error: ApiError) => {
          onError(error);
        },
    });
};

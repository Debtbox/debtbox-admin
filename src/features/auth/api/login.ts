import { axios } from '@/lib/axios';
import type { MutationConfig } from '@/lib/react-query';
import type { ApiError } from '@/types/ApiError';
import { useMutation } from '@tanstack/react-query';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';
import type { AuthSuccessResponse, AuthTokensData } from '../types/auth';

export type LoginCredentialsDTO = {
  login: string; // email or identifier accepted by backend
  password: string;
};

export type LoginResponse = AuthSuccessResponse<AuthTokensData>;

export const login = (data: LoginCredentialsDTO): Promise<LoginResponse> => {
  const language = getLanguageFromCookie();
  return axios.post('/auth/admin/login', data, {
    headers: {
      'Accept-Language': language,
    },
  });
};

type UseLogin = {
  config?: MutationConfig<typeof login>;
  onSuccess: (data: LoginResponse) => void;
  onError: (error: ApiError) => void;
};

export const useLogin = ({ config, onError, onSuccess }: UseLogin) => {
  return useMutation({
    ...config,
    mutationFn: login,
    onSuccess: (data) => {
      onSuccess(data);
    },
    onError: (error: ApiError) => {
      onError(error);
    },
  });
};

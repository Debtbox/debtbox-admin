import { axios } from '@/lib/axios';
import type { MutationConfig } from '@/lib/react-query';
import type { ApiError } from '@/types/ApiError';
import { useMutation } from '@tanstack/react-query';

export const logout = (): Promise<unknown> => {
  return axios.post('/auth/admin/logout');
};

type UseLogout = {
  config?: MutationConfig<typeof logout>;
  onSuccess?: (data: unknown) => void;
  onError?: (error: ApiError) => void;
};

export const useLogout = ({ config, onError, onSuccess }: UseLogout = {}) => {
  return useMutation({
    ...config,
    mutationFn: logout,
    onSuccess: (data) => {
      onSuccess?.(data);
    },
    onError: (error: ApiError) => {
      onError?.(error);
    },
  });
};

import { axios } from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';
import type { AuthSuccessResponse } from '../types/auth';
import type { AdminProfileData } from '../types/auth';

export type ProfileResponse = AuthSuccessResponse<AdminProfileData>;

export const getProfile = (): Promise<ProfileResponse> => {
  return axios.get('/admin/me');
};

export const profileQueryKey = ['admin', 'me'] as const;

export const useProfile = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: profileQueryKey,
    queryFn: getProfile,
    enabled: options?.enabled !== false,
  });
};

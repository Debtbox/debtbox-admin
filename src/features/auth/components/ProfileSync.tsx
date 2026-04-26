import { useEffect } from 'react';
import { useProfile } from '../api/getProfile';
import { useUserStore } from '@/stores/UserStore';
import { mapProfileToStore } from '../types/auth';

/**
 * Fetches GET /admin/me when mounted (protected layout) and syncs profile to UserStore
 * so navbar and user dropdown show up-to-date user info after reload.
 */
export const ProfileSync = () => {
  const setUser = useUserStore((s) => s.setUser);
  const setProfileLoaded = useUserStore((s) => s.setProfileLoaded);
  const { data, isSuccess, isError } = useProfile();

  useEffect(() => {
    if (isSuccess && data?.data) {
      setUser(mapProfileToStore(data.data));
    }
    if (isError) {
      setProfileLoaded(true);
    }
  }, [isSuccess, isError, data, setUser, setProfileLoaded]);

  return null;
};

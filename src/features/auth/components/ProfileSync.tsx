import { useEffect } from 'react';
import { useProfile } from '../api/getProfile';
import { useUserStore } from '@/stores/UserStore';
import { mapProfileToStore } from '../types/auth';

export const ProfileSync = () => {
  const setUser = useUserStore((s) => s.setUser);
  const setProfileLoadFailed = useUserStore((s) => s.setProfileLoadFailed);
  const { data, isSuccess, isError } = useProfile();

  useEffect(() => {
    if (isSuccess && data?.data) {
      setUser(mapProfileToStore(data.data));
    }
    if (isError) {
      setProfileLoadFailed();
    }
  }, [isSuccess, isError, data, setUser, setProfileLoadFailed]);

  return null;
};

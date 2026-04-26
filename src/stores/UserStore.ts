import { create } from 'zustand';

export interface User {
  id: string;
  full_name_en: string;
  full_name_ar: string;
  email: string;
  role: {
    id: number;
    name: string;
    slug: string;
    userType: string;
  } | null;
  permissions: string[];
  phone?: string;
  status?: string;
  last_login_at?: string | null;
}

interface UserStore {
  user: User | null;
  isProfileLoaded: boolean;
  setUser: (user: User | null) => void;
  setProfileLoaded: (isLoaded: boolean) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isProfileLoaded: false,
  setUser: (user) => set({ user, isProfileLoaded: true }),
  setProfileLoaded: (isProfileLoaded) => set({ isProfileLoaded }),
  clearUser: () => set({ user: null, isProfileLoaded: false }),
}));

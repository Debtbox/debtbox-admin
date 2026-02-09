import { create } from 'zustand';

export interface User {
  id: string;
  full_name_en: string;
  full_name_ar: string;
  email: string;
  role: string;
  phone?: string;
  status?: string;
  last_login_at?: string | null;
}

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));

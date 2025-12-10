import { create } from 'zustand';

interface SessionStore {
  showSessionExpiryPopup: boolean;
  setShowSessionExpiryPopup: (show: boolean) => void;
  handleSessionExpiry: () => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  showSessionExpiryPopup: false,
  setShowSessionExpiryPopup: (show) => set({ showSessionExpiryPopup: show }),
  handleSessionExpiry: () => set({ showSessionExpiryPopup: true }),
}));

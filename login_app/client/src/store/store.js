// src/store/store.js
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  auth: {
    username: '',
    active: false
  },

  // ✅ Set username in the auth state
  setUsername: (name) =>
    set((state) => ({
      auth: { ...state.auth, username: name, active: !!name }
    })),

  // ✅ Clear user info (e.g., on logout)
  clearAuth: () =>
    set(() => ({
      auth: { username: '', active: false }
    }))
}));

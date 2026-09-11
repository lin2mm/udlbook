import { create } from "zustand";

interface AuthState {
  userId: string | null;
  apiKey: string | null;
  username: string | null;
  isAdFree: boolean;
  setAuth: (opts: { userId: string; apiKey: string; username: string }) => void;
  setAdFree: (v: boolean) => void;
  clear: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  userId: null,
  apiKey: null,
  username: null,
  isAdFree: false,
  setAuth: ({ userId, apiKey, username }) => set({ userId, apiKey, username }),
  setAdFree: (isAdFree) => set({ isAdFree }),
  clear: () => set({ userId: null, apiKey: null, username: null, isAdFree: false }),
}));

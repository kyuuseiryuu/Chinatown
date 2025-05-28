import { create } from 'zustand';
export interface UserState {
  username: string;
  setUsername: (username: string) => void;
}
export const useUserState = create<UserState>((set) => ({
  username: '',
  setUsername: (username: string) => set({ username }),
}));

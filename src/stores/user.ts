import { createCallServer } from '@/lib/ws-utils';
import type { ServerMethods } from '@/server/types';
import { sendMessage, type User } from '@/utils';
import type { IdTokenClaims } from '@logto/react';
import { create } from 'zustand';

const callServer = createCallServer<ServerMethods>();

export interface UserState extends User {
  logined: boolean;
  loginSuccess: (user: Pick<IdTokenClaims, 'aud' | 'username' | 'picture' | 'name'>) => void;
  logout: () => void;
}
export const useUserState = create<UserState>((set, get) => ({
  logined: false,
  username: '',
  id: '',
  avatar: '',
  loginSuccess: userMeta => {
    const { aud, picture, username, name } = userMeta;
    if (!get().logined) {
      sendMessage(callServer('connect', { id: aud, avatar: picture ?? '', username: name ?? '' }));
    }
    set({ logined: true, username: name ?? username ?? aud, id: aud, avatar: picture ?? '' })
  },
  logout() {
    set({ username: '', id: '', avatar: '', logined: false });
  },
}));

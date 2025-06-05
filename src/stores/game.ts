import { createCallServer } from "@/lib/ws-utils";
import type { ServerMethods } from "@/server/types";
import { sendMessage, type User } from "@/utils";
import { create } from "zustand";
import { useUserState } from "./user";

interface GameStore {
  inRoom?: string;
  members: string[];
  memberMetas: Map<string, User>;
  joinRoom: (id: string) => Promise<void>;
}

const callServer = createCallServer<ServerMethods>();

export const useGameStore = create<GameStore>((set) => ({
  members: [],
  memberMetas: new Map(),
  joinRoom: async (roomId) => {
    const { id: user, username } = useUserState.getState();
    await sendMessage(callServer('joinRoom', {
      user,
      roomId,
      roomName: `${username} 的房间`,
    }));
    set({ inRoom: roomId });
  },
}));

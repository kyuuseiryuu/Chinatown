import { create } from 'zustand';
import { useUserState } from './user';
import { instance } from '@/utils';

export interface Room {
  id: string;
  name: string;
  owner?: string;
}

interface RoomState {
  roomList: Room[];
  setRoomList: (list: Room[]) => void;
  createRoom?: (roomName: string) => void;
  destroyRoom: (roomId: string) => Promise<void>;
}

// const callServer = createCallServer<ServerMethods>();

export const getShortID = (uuid: string) => {
  return uuid.split('-')[3];
}

export const useRoomState = create<RoomState>(((set) => ({
  roomList: [],
  setRoomList: (list) => set({ roomList: list }),
  createRoom: async (roomName: string) => {
    const { id: aud } = useUserState.getState();
    const data = await instance.put('/room/', { aud, roomName  });
    console.debug(data.data);
  },
  destroyRoom: async (roomId: string) => {
    const newRoomList = useRoomState
      .getState()
      .roomList
      .filter(room => room.id !== roomId);
    set({
      roomList: newRoomList 
    });
  }
})));

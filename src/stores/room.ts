import { v4 } from 'uuid'; // Ensure you have a UUID library installed
import { create } from 'zustand';

export interface Room {
  id: string;
  name: string;
  owner?: string;
}

interface RoomState {
  roomList: Room[];
  setRoomList: (list: Room[]) => void;
  createRoom?: (roomName: string, username: string) => Promise<Room>;
  destroyRoom: (roomId: string) => Promise<void>;
}

const getRoomId = async () => {
  return v4().toUpperCase(); // Assuming UUID is imported from a library like 'uuid'
}

export const useRoomState = create<RoomState>((set => ({
  roomList: [],
  setRoomList: (list) => set({ roomList: list }),
  createRoom: async (roomName: string, owner: string) => {
    const roomId = await getRoomId();
    const newRoom: Room = { id: roomId, name: roomName, owner };
    set(state => {
      return { roomList: [...state.roomList, newRoom] };
    });
    return newRoom; // Return the newly created room
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

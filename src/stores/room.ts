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

export const getShortID = (uuid: string) => {
  return uuid.split('-')[3];
}

export const useRoomState = create<RoomState>(((set, get) => ({
  roomList: [],
  setRoomList: (list) => set({ roomList: list }),
  createRoom: async (roomName: string, owner: string) => {
    const room = get().roomList.filter(e => e.owner === owner);
    if (room.length) return room[0];
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

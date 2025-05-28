import { v4 } from 'uuid'; // Ensure you have a UUID library installed
import { create } from 'zustand';

interface Room {
  id: string;
  name: string;
}

interface RoomState {
  roomList: Room[];
  setRoomList: (list: Room[]) => void;
  createRoom?: (roomName: string) => Promise<Room>;
}

const getRoomId = async () => {
  return v4().toUpperCase(); // Assuming UUID is imported from a library like 'uuid'
}

export const useRoomState = create<RoomState>((set => ({
  roomList: [],
  setRoomList: (list) => set({ roomList: list }),
  createRoom: async (roomName) => {
    const roomId = await getRoomId();
    const newRoom = { id: roomId, name: roomName };
    set(state => {
      return { roomList: [...state.roomList, newRoom] };
    });
    return newRoom; // Return the newly created room
  },
  destroyRoom: async (roomId) => {
    const newRoomList = useRoomState
      .getState()
      .roomList
      .filter(room => room.id !== roomId);
    set({
      roomList: newRoomList 
    });
  }
})));

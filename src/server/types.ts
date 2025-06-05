import { wsApp } from './utils';


export type WebSocket = ReturnType<typeof wsApp['getWss']>;
export interface RoomMeta {
  id: string;
  name: string;
  owner: string;
  members: string[];
}
export interface UserMeta {
  id: string;
  username: string;
  avatar?: string;
}

export type ServerMethods = {
  connect: UserMeta;
  joinRoom: { roomId: string, user: string, roomName: string };
  createRoom: { roomName: string };
}
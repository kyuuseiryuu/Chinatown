import type { FuncPayload } from "./lib/ws-utils";
import type { RoomMeta, UserMeta } from "./server/types";

export interface ClientMethods extends FuncPayload {
  'requestLogin': { connectionId: string };
  'u:online': { members: number };
  'u:roomList': { roomList: RoomMeta[] };
  'a:memberReconnect': { user?: UserMeta };
  'a:newMemberJoin': { user?: UserMeta };
} 
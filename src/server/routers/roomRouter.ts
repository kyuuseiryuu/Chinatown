import { Router } from "express";
import { roomMap, sendBroadcastAll, userWsMap } from "../utils";
import { v4 as uuidv4} from 'uuid';
import type { RoomMeta } from "../types";
import { createCallClient } from "../../lib/ws-utils";
import type { ClientMethods } from "../../types";

const callClient = createCallClient<ClientMethods>();

export const roomRouter = Router();
roomRouter.put('/', (req, res) => {
  const { aud, roomName }  = req.body;
  const room = roomMap.get(aud);
  if (room) {
    res.json({ roomId: room.id });
    return;
  }
  const roomId = uuidv4();
  roomMap.set(aud, { id: roomId, owner: aud, name: roomName, members: [aud] } as RoomMeta)
  sendBroadcastAll(callClient('u:roomList', { roomList: [...roomMap.values()] }));
  res.json({ roomId, users: [...userWsMap.keys()] });
});

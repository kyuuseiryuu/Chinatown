import { createCallClient, createRegister } from "../lib/ws-utils";
import { roomMap, userWsMap, MAX_ROOM_MEMBER_SIZE, userMetaMap, sendBroadcast, sendBroadcastAll } from "./utils";
import type { ServerMethods } from "./types";
import type { ClientMethods } from "../types";

const registMethodHandler = createRegister<ServerMethods>();

const callClient = createCallClient<ClientMethods>();

registMethodHandler('connect', (payload, ws) => {
  userWsMap.set(payload.id, ws);
  userMetaMap.set(payload.id, payload);
  ws.send(callClient('u:online', {
    members: userWsMap.size
  }));
  ws.send(callClient('u:roomList', { roomList: [...roomMap.values()] }))
  console.log('u:online, u:roomList');
});

registMethodHandler('joinRoom', (payload, ws) => {
  const { roomId, user, roomName: name } = payload
  let meta = roomMap.get(user);
  if (!meta) {
    // create new room
    meta = { id: roomId, owner: user, members: [user], name };
    roomMap.set(user, meta);
    sendBroadcastAll(callClient('u:roomList', { roomList: [...roomMap.values()]}));
    return;
  }
  if (meta.members.includes(user)) {
    sendBroadcast(meta.members, callClient('a:memberReconnect', {
      user: userMetaMap.get(user),
    }));
    return;
  }
  if (meta.members.length < MAX_ROOM_MEMBER_SIZE) {
    // new member join
    meta.members.push(user);
    sendBroadcast(meta.members, callClient('a:newMemberJoin', {
      user: userMetaMap.get(user),
    }));
    return;
  }
  ws.send(callClient('a:joinRoomError', { message: '房间人数已满' }));
});
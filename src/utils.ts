import axios from "axios";
import { createRegister, invokeMethod, parseCallClientMessage } from "./lib/ws-utils";
import type { UserMeta } from "./server/types";
import { useRoomState } from "./stores/room";
import type { ClientMethods } from "./types";

export type User = UserMeta;

const WSURL = 'http://localhost:3000/ws';

const initWebSocket = () => {
  const ws = new WebSocket(WSURL);
  // ws.onopen = () => resolve(ws);
  ws.onmessage = event => {
    const parsed = parseCallClientMessage(event.data);
    if (parsed) {
      console.debug('handle calling', parsed);
      invokeMethod(parsed.method, parsed.payload, ws);
      return;
    }
    console.debug('handle message', event.data);
  };
  return ws;
}

let connection: WebSocket = initWebSocket();

const registMethodHandler = createRegister<ClientMethods>();

registMethodHandler('requestLogin', ({ connectionId }) => {
  console.log('requestLogin', connectionId);
});

registMethodHandler('u:online', (payload, ws) => {
  console.log(payload, ws);
});

registMethodHandler('u:roomList', (payload) => {
  useRoomState.getState().setRoomList(payload.roomList);
});

export const getConnection: () => Promise<WebSocket> = async () => new Promise(resolve => {
  console.debug(connection);
  if (!connection || connection.readyState === connection.CLOSED) {
    const ws = initWebSocket();
    ws.onopen = () => resolve(ws);
    connection = ws;
    return;
  };
  resolve(connection);
});

export const sendMessage = async (message: string) => {
  const ws = await getConnection();
  ws.send(message);
};

export const instance = axios.create({ baseURL: 'http://localhost:3000/api' });
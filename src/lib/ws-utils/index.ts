import type { ClientWebSocket, ServerWebSocket } from "@/server/utils";

enum CALL_TYPE {
  CALL_SERVER = 'call-server',
  CALL_CLIENT = 'call-client',
};


export interface FuncPayload {
  [key: string]: unknown;
}


type Method<T extends FuncPayload> = keyof T;

type Payload<T extends FuncPayload, M extends Method<T>> = T[M];

export type MethodHandler<T = unknown>  = (payload: T, ws: ServerWebSocket | ClientWebSocket) => void;
export const methodRegistry = new Map<string, MethodHandler>();

export const createRegister = <T extends FuncPayload>() => <M extends Method<T>>(method: M, handler: MethodHandler<Payload<T, M>>) => {
  if (methodRegistry.has(method.toString())) {
    console.warn(`Method ${method.toString()} is already registered. Overwriting.`);
  }
  methodRegistry.set(method.toString(), handler as MethodHandler);
}

export const parseMessage = (type: CALL_TYPE) => (msg: string) => {
  try {
    const data = JSON.parse(msg);
    if (data.type === type) {
      return {
        method: data.method,
        payload: { ...data.payload },
      };
    }
  } catch (error) {
    console.error('Failed to parse call server message:', error);
  }
  return null;
}

export const parseCallServerMessage = (msg: string) => {
  return parseMessage(CALL_TYPE.CALL_SERVER)(msg);
};

export const parseCallClientMessage = (msg: string) => {
  return parseMessage(CALL_TYPE.CALL_CLIENT)(msg);
};


export const handleMessage = (msg: string, ws: ServerWebSocket) => {
  console.log(msg);
  const message = parseCallServerMessage(msg);
  if (!message) {
    // Handle the parsed message
    // ws.send(callClient('function-not-found', { message }))
    return;
  }
  console.log('Parsed message:', message);
  invokeMethod(message.method, message.payload, ws);
};

export const handleWsClosed = (id: string, wsMap: Map<string, ServerWebSocket | ClientWebSocket>) => {
  wsMap.delete(id);
  console.log(`Disconnect ${id}. left links: ${wsMap.size}`);
}


export const createCallClient = <T extends FuncPayload>() => <M extends Method<T>>(method: M, payload: Payload<T, M>) => {
  return JSON.stringify({
    type: CALL_TYPE.CALL_CLIENT,
    method,
    payload,
  });
}

export const createCallServer = <T extends FuncPayload>() => <M extends Method<T>>(method: M, payload: Payload<T, M>) => {
  return JSON.stringify({
    type: CALL_TYPE.CALL_SERVER,
    method,
    payload,
  });
}

export const invokeMethod = (
  method: string,
  payload: Record<string, unknown>,
  ws: ServerWebSocket | ClientWebSocket,
) => {
  const handler = methodRegistry.get(method);
  if (handler) {
    handler(payload, ws);
  } else {
    console.warn(`Method ${method} not found in registry.`);
  }
}
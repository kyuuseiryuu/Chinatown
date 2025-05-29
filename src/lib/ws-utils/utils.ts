import { WebSocket } from 'ws';

export type MethodHandler<T = unknown> = (payload: T, ws: WebSocket, wsMap: Map<string, WebSocket>) => void;
export const methodRegistry = new Map<string, MethodHandler<unknown>>();
enum CallType {
  CALL_SERVER = 'call-server',
  CALL_CLIENT = 'call-client',
}
export const registMethodHandler = <T>(method: string, handler: MethodHandler<T>) => {
  if (methodRegistry.has(method)) {
    console.warn(`Method ${method} is already registered. Overwriting.`);
  }
  methodRegistry.set(method, handler as MethodHandler<unknown>);
}

export const parseCallServerMessage = (msg: string) => {
  try {
    const data = JSON.parse(msg);
    if (data.type === CallType.CALL_SERVER) {
      return {
        method: data.method,
        payload: { ...data.payload },
      };
    }
  } catch (error) {
    console.error('Failed to parse call server message:', error);
  }
  return null;
};


export const handleMessage = (msg: string, ws: WebSocket, wsMap: Map<string, WebSocket>) => {
  console.log(msg);
  const message = parseCallServerMessage(msg);
  if (!message) {
    // Handle the parsed message
    // ws.send(callClient('function-not-found', { message }))
    return;
  }
  console.log('Parsed message:', message);
  invokeMethod(message.method, message.payload, ws, wsMap);
};

export const handleWsOpen = (ws) => {
  console.log('ws open');
  ws.send(`WebSocket open.`);
}

export const handleWsClosed = (id: string, wsMap: Map<string, WebSocket>) => {
  wsMap.delete(id);
  console.log(`Disconnect ${id}. left links: ${wsMap.size}`);
}

export const callClient = (method: string, payload: Record<string, unknown>) => {
  return JSON.stringify({
    type: CallType.CALL_CLIENT,
    method,
    payload,
  });
}

export const callServer = (method: string, payload: Record<string, unknown>) => {
  return JSON.stringify({
    type: CallType.CALL_SERVER,
    method,
    payload,
  });
}

export const invokeMethod = (
  method: string,
  payload: Record<string, unknown>,
  ws: WebSocket,
  wsMap: Map<string, WebSocket>
) => {
  const handler = methodRegistry.get(method);
  if (handler) {
    handler(payload, ws, wsMap);
  } else {
    console.warn(`Method ${method} not found in registry.`);
  }
}
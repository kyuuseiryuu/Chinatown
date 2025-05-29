import { WebSocket } from 'ws';

export type MethodHandler<T = unknown> = (payload: T, ws: WebSocket, wsMap: Map<string, WebSocket>) => void;
export const methodRegistry = new Map<string, MethodHandler<unknown>>();

export const registMethodHandler = <T>(method: string, handler: MethodHandler<T>) => {
  if (methodRegistry.has(method)) {
    console.warn(`Method ${method} is already registered. Overwriting.`);
  }
  methodRegistry.set(method, handler as MethodHandler<unknown>);
}

export const handleMessage = (msg: string, ws: WebSocket, wsMap: Map<string, WebSocket>) => {
  console.log(msg);
  const message = parseCallServerMessage(msg);
  if (!message) {
    // Handle the parsed message
    ws.send(callClient('function-not-found', { message }))
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

export const parseCallServerMessage = (msg: string) => {
  try {
    const data = JSON.parse(msg);
    if (data.type === 'call-server') {
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

export const callClient = (method: string, payload: Record<string, unknown>) => {
  return JSON.stringify({
    type: 'call-client',
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
    ws.send(callClient('function-not-found', { message: `Method ${method} not found.` }));
  }
}
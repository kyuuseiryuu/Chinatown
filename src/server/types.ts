import { wsApp } from './utils';


export type WebSocket = ReturnType<typeof wsApp['getWss']>;
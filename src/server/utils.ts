import express from 'express';
import expressWs from 'express-ws';
import { WebSocket as WsWebSocket } from 'ws';
import type { RoomMeta, UserMeta } from "./types";

export type ServerWebSocket = WsWebSocket;
export type ClientWebSocket = WebSocket;
export const wsApp = expressWs(express());
export const app = wsApp.app;
export const MAX_ROOM_MEMBER_SIZE = 6;
export const roomMap = new Map<string, RoomMeta>();
export const userWsMap = new Map<string, ServerWebSocket | ClientWebSocket>();
export const userMetaMap = new Map<string, UserMeta>();

export const sendBroadcast = (users: string[], message: string) => {
  users.forEach(u => {
    userWsMap.get(u)?.send(message);
  });
}

export const sendBroadcastAll = (message: string) => {
  sendBroadcast([...userWsMap.keys()], message);
}

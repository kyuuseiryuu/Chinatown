import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { app } from './utils';
import { handleMessage, callClient, handleWsOpen, handleWsClosed, registMethodHandler } from '../lib/ws-utils/utils';
import { WebSocket } from 'ws';

const wsMap = new Map<string, WebSocket>();

registMethodHandler<{ callback?: string }>('get-uuid', (payload, ws, wsMap) => {
  const { callback } = payload;
  ws.send(callClient(callback ?? 'update-uuid', { uuid: uuidv4(), memberCount: wsMap.size }));
});

app.ws('/ws', (ws, req) => {
  console.debug('Connect: ', req.hostname);
  const id = uuidv4();
  handleWsOpen(ws);
  wsMap.set(id, ws);
  ws.on('message', msg => {
    handleMessage(msg.toString(), ws, wsMap);
  });
  ws.on('close', () => handleWsClosed(id, wsMap));
});

app.use(express.static('public'))


app.listen(3000, () => {
  console.debug('App start, port: 3000');
});

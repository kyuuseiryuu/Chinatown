import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import bodyParser from 'body-parser';
import cors from 'cors';
import { app, userWsMap } from '../server/utils';
import { handleMessage, handleWsClosed, createCallClient } from '../lib/ws-utils';
import type { ClientMethods } from '@/types';
import './handler';
import { roomRouter } from './routers/roomRouter';

const callClient = createCallClient<ClientMethods>();

const jsonParser = bodyParser.json();

app.use(cors());

app.ws('/ws', (ws, req) => {
  const id = uuidv4();
  console.debug('Connect: ', req.hostname, id);
  userWsMap.set(id, ws);
  ws.send(callClient('requestLogin', { connectionId: id }));
  ws.on('message', msg => {
    handleMessage(msg.toString(), ws);
  });
  ws.on('close', () => handleWsClosed(id, userWsMap));
});

app.use('/', express.static('public'))

app.use('/api/room', jsonParser, roomRouter);

app.listen(3000, () => {
  console.debug('App start, port: 3000');
});

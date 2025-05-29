import express from 'express';
import expressWs from 'express-ws';

export const wsApp = expressWs(express());
export const app = wsApp.app;

'use strict';
console.clear();

import { createServer } from 'http';
import { Server as WebsocketServer } from 'socket.io';

import app from './app';
import Sockets from './sockets/sockets';
import { FRONTEND_URL, PORT } from './config';

const server = createServer(app);
export const httpServer = server.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});

const io = new WebsocketServer(httpServer, {
  pingTimeout: 60000,
  cors: { origin: FRONTEND_URL },
});
Sockets(io);

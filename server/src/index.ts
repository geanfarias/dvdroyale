import cookieParser from 'cookie-parser'
import express from 'express'
import routers from './routes/index.routes'
import Game from "./websocket/game";
import Player from "./websocket/player";
import http from 'http';
import { Server } from 'socket.io';
import SocketRoom from './websocket/SocketRoom';

const app = express()
const port = 3000
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

const activeRooms: { [roomId: string]: SocketRoom } = {};

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('a user connected');
  const roomId = socket.handshake.query.room as string | null;
  console.log('roomId:', roomId);
  if (roomId == null || roomId == '') {
    return socket.disconnect();
  }

  const player = new Player("Player_" + socket.id.substring(0, 5), socket.id, socket);

  let socketGame = activeRooms[roomId];
  let game: Game;
  console.log('socketGame first:', socketGame);

  if (socketGame == null) {
    game = new Game();
    socketGame = new SocketRoom(game);
    activeRooms[roomId] = socketGame;
  } else {
    game = socketGame.game;
  }

  game.addPlayer(player);

  console.log('game after:', game);
  console.log('socketGame after:', socketGame);

  socket.on('startGame', () => {
    console.log('calling startGame');
    game.startGame();
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
    game.disconnectPlayer(player);
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`)
});

routers.forEach((router) => {
  app.use(router)
})

import cookieParser from 'cookie-parser'
import express from 'express'
import routers from './routes/index.routes'
import Game from "./websocket/game";
import Player from "./websocket/player";
import http from 'http';
import { Server } from 'socket.io';
import {Socket} from "socket.io/dist/socket";

const app = express()
const port = 3000
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

const game = new Game();
const sockets: Socket[] = []

app.get('/start', (req, res) => {
  res.send('start game!')
  sockets.forEach(socket => {
    socket.emit('gameStart', game.getPlayers());
  });
  game.startGame((players) => {
    sockets.forEach(socket => {
      socket.emit('gameUpdate', players);
    });
  });
})

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('a user connected');

  // Create a new player when a user connects
  const player = new Player("Player_" + socket.id.substring(0, 5), socket.id);
  game.addPlayer(player);
  sockets.push(socket);

  socket.on('disconnect', () => {
    console.log('user disconnected');
    game.desconectPlayer(player);


    const socketIndex = sockets.indexOf(socket);
    if (socketIndex !== -1) {
      sockets.splice(socketIndex, 1);
    }
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`)
});

routers.forEach((router) => {
  app.use(router)
})

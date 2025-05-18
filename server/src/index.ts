import cookieParser from 'cookie-parser'
import express from 'express'
import routers from './routes/index.routes'
import Game from "./websocket/game";
import Player from "./websocket/player";
import http from 'http';
import { Server } from 'socket.io';
import SocketRoom from './websocket/SocketRoom';
import bodyParser from 'body-parser';
import RoomController from './controller/room.controller';
import PlayerController from './controller/player.controller';

const app = express()
const port = 3000
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded())
app.use(express.static('../front/public'));

const activeRooms: { [roomId: string]: SocketRoom } = {};
const roomController = new RoomController();
const playerController = new PlayerController();

// WebSocket connection handling
io.on('connection', async (socket) => {
  console.log('a user connected');
  const cookies = socket.handshake.headers.cookie;
  const uuid = cookies?.split('; ').find(row => row.startsWith('uuid='))?.split('=')[1];
  const roomId = socket.handshake.query.room as string | null;
  console.log(uuid)

  console.log('roomId:', roomId);
  if ((uuid == null == undefined || uuid == null || uuid == '') || (roomId == null == undefined || roomId == null || roomId == '')) {
    socket.emit('invalidRoom')
    return socket.disconnect();
  }

  let dbPlayer = await playerController.getPlayer(uuid);
  console.log('dbPlayer at get:', dbPlayer)
  if (dbPlayer == null) {
    socket.emit('invalidRoom')
    return socket.disconnect();
  }

  let dbRoom = await roomController.getRoom(roomId)
  console.log('dbRoom at get:', dbRoom)
  if (dbRoom == null) {
    dbRoom = await roomController.createRoom(uuid);
    console.log('dbRoom after create:', dbRoom)
  } else {
    if (dbRoom.finished) {
      socket.emit('roomFinished');
      return socket.disconnect();
    }
  }

  const player = new Player(dbPlayer.name, uuid, socket);

  let socketGame = activeRooms[roomId];
  let game: Game;
  console.log('socketGame first:', socketGame);

  if (socketGame == null) {
    game = new Game(roomId);
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
    if (uuid == undefined || uuid == null || uuid == '') return
    game.disconnectPlayer(player);
  });

  socket.on('clickEvent', () => {
    if (game.started == false) return
    game.toast(player);
  })

  socket.on('forceCorner', () => {
    player.viciar();
  })

});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`)
});

routers.forEach((router) => {
  app.use(router)
})

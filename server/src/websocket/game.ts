import RoomController from "../controller/room.controller";
import RoomRankingController from "../controller/room_ranking.controller";
import Player from "./player";
import Size from "./size";
import { v4 as uuidv4 } from 'uuid';

const roomRankingController = new RoomRankingController();
const roomController = new RoomController();

export default class Game {
    private readonly pointsBase = 1
    started = false;
    private readonly size: Size = { w: 640, h: 480 }
    readonly players: Player[] = [];
    private readonly chanceSurprise = 0.1;
    private readonly surprises:string[] = [];

    private rankingMap: { [uuid: string]: number } = {};

    private readonly roomId: string;

    constructor(room: string) {
        this.roomId = room;
    }

    addPlayer(player: Player) {
        player.position.w = Math.floor(Math.random() * this.size.w);
        player.position.h = Math.floor(Math.random() * this.size.h);
        player.direction = randomDirection();
        this.players.push(player);
    }

    disconnectPlayer(player: Player) {
        if ((this.players.length - 1) == 0 && this.started) {
            console.log("No players left, ending game");

            console.log(this.rankingMap)
            roomRankingController.save(this.roomId, this.rankingMap);
            roomController.markAsFinished(this.roomId);
        }

        const playerIndex = this.players.findIndex(p => p == player);
        if (playerIndex !== -1) {
            const playerDisconnected = this.players.splice(playerIndex, 1)[0];
            this.players.forEach(player => player.socket.emit("playerDisconnected", playerDisconnected.toSerializable()))
        }
    }

    startGame() {
        if (this.started) return
        if (this.players.length < 0) {
            this.players.forEach(player => player.socket.emit('toast', { message: "Pelo menos 2 jogadores precisam estar na sala!" }));
            return
        }
        console.log(this.players)
        const playerData = this.players.map(player => ({
            id: player.uuid,
            position: player.position,
        }));
        this.players.forEach(player => {
            player.socket.emit('gameStart', playerData);
        });
        this.started = true;
        setInterval(() => this.updateGame(), 100);
    }

    updateGame() {
        if (Math.random() < this.chanceSurprise) {
            this.addSurprise();
        }
        this.players.forEach(player => this.runPlayer(player));
        const playerData = this.players.map(player => player.toSerializable());
        this.players.forEach(player => {
            playerData.forEach(p => { p.currentPlayer = p.id == player.uuid })
            player.socket.emit('gameUpdate', playerData);
        });
    }

    runPlayer(player: Player) {
        const directionInRadians = player.direction * (Math.PI / 180);

        player.position.w += Math.cos(directionInRadians) * player.speed;
        player.position.h += Math.sin(directionInRadians) * player.speed;

        const minW = 0;
        const maxW = this.size.w - player.size.w;
        const minH = 0;
        const maxH = this.size.h - player.size.h;

        const onWidth = player.position.w <= minW || player.position.w >= maxW;
        const onHeight = player.position.h <= minH || player.position.h >= maxH;
        if (onWidth) {
            player.direction = newDitection(player.direction, 180);
            player.position.w = Math.max(0, Math.min(maxW, player.position.w));
        }
        if (onHeight) {
            player.direction = newDitection(player.direction, 360);
            player.position.h = Math.max(0, Math.min(maxH, player.position.h));
        }
        player.hitWall = onWidth || onHeight;
        player.hitCorner = onWidth && onHeight;
        if (player.hitCorner) {
            player.speedBoost(10, 5000);
            player.points += this.pointsBase*10
        } else if (player.hitWall) {
            player.points += this.pointsBase * 1
        }

        this.rankingMap[player.uuid] = player.points;

        player.direction = player.direction % 360;
        if (player.direction < 0) {
            player.direction += 360;
        }
    }

    toast(player: Player) {
        player.unnecessaryClicks++;
        if (player.unnecessaryClicks == 1){
            player.socket.emit('toast', {message: "Você saiu do modo hibernação!! \n Não ouse repetir o clique! \n Algo terrível pode acontecer!"});
        } else if (player.unnecessaryClicks == 2){
            player.socket.emit('toast',{message: "Você foi punido por clicar novamente! \n Agora é sério, NÃO CLIQUE NOVAMENTE!"});
            player.speedPenalty(4500)
        } else {
            player.socket.emit('playVideo')
            player.socket.emit('toast',{message: "Você saiu do modo repouso!! \n O filme será iniciado em breve. \n Até mais!!"});
            this.disconnectPlayer(player);
        }
    }

    addSurprise() {
        const surprise = {
            id: uuidv4(),
            position: {
                w: Math.floor(Math.random() * this.size.w),
                h: Math.floor(Math.random() * this.size.h),
            },
        }
        this.surprises.push(surprise.id);
        this.players.forEach(player => {
            player.socket.emit('surprise', surprise);
        });
    }

    executeSurprise(player: Player, surpriseId: string) {
        const surpriseIndex = this.surprises.findIndex(s => s == surpriseId);
        if (surpriseIndex !== -1) {
            this.surprises.splice(surpriseIndex, 1);
            if (randomizeHappySuprise()) {
                player.socket.emit('toast', {message: "Happy surprise!"});
                player.points += this.pointsBase*5;
                player.socket.emit('toast', {message: "Surprise!"});
                this.players.forEach(p => {
                    p.socket.emit('surpriseExecuted', surpriseId);
                });
            } else {
                player.socket.emit('toast', {message: "Sad surprise!"});
                player.speed = 0
                setTimeout(() => {
                    player.speed = 5;
                }, 5000);
                this.players.forEach(p => {
                    p.socket.emit('surpriseExecuted', surpriseId);
                });
            }
        }
    }
}

const happyPercent = 0.5;
function randomizeHappySuprise() {
    return Math.random() < happyPercent;
}	

function newDitection(direction: number, base: number): number {
    return randomizeAround(base - direction)
}

const default_margin = 10

function randomizeAround(value: number, range = default_margin) {
    const offset = Math.floor(Math.random() * (range * 2 + 1)) - range;
    return value + offset;
}

function randomDirection() {
    const values = [45, 135, 225, 315];
    const index = Math.floor(Math.random() * values.length);
    return randomizeAround(values[index]);
}
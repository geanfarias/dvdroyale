import Player from "./player";
import Size from "./size";

export default class Game {
    private readonly pointsBase = 1
    private started = false;
    private readonly size: Size = { w: 640, h: 480 }

    readonly players: Player[] = [];

    addPlayer(player: Player) {
        player.position.w = Math.floor(Math.random() * this.size.w);
        player.position.h = Math.floor(Math.random() * this.size.h);
        player.direction = randomDirection();
        this.players.push(player);
    }

    disconnectPlayer(player: Player) {
        const playerIndex = this.players.findIndex(p => p == player);
        if (playerIndex !== -1) {
            const playerDisconnected = this.players.splice(playerIndex, 1)[0];
            this.players.forEach(player => player.socket.emit("playerDisconnected", playerDisconnected.toSerializable()))
        }
    }

    getPlayers() {
        return this.players;
    }

    startGame() {
        if (this.started) return
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
        this.players.forEach(player => this.runPlayer(player));
        const playerData = this.players.map(player => player.toSerializable());
        this.players.forEach(player => {
            playerData.forEach(p => {p.currentPlayer = p.id == player.uuid})
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
            player.points += this.pointsBase*10
        } else if (player.hitWall) {
            player.points += this.pointsBase*1
        }

        player.direction = player.direction % 360;
        if (player.direction < 0) {
            player.direction += 360;
        }
    }
}

function newDitection(direction:number, base:number):number {
    if (isApproximately(direction,45)) {
        direction = 45
    } else if (isApproximately(direction,135)) {
        direction = 135
    } else if (isApproximately(direction,225)) {
        direction = 225
    } else if (isApproximately(direction,315)) {
        direction = 315
    }
    return randomizeAround(base - direction)
}

const default_margin = 10

function isApproximately(value:number, target:number, margin = default_margin) {
  return Math.abs(value - target) <= margin;
}

function randomizeAround(value:number, range = default_margin) {
  const offset = Math.floor(Math.random() * (range * 2 + 1)) - range;
  return value + offset;
}

function randomDirection() {
  const values = [45, 135, 225, 315];
  const index = Math.floor(Math.random() * values.length);
  return randomizeAround(values[index]);
}
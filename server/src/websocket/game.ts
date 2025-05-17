import Player from "./player";
import Size from "./size";

export default class Game {
    private readonly pointsBase = 1
    private readonly size: Size = { w: 640, h: 480 }

    readonly players: Player[] = [];

    addPlayer(player: Player) {
        player.position.w = Math.floor(Math.random() * this.size.w);
        player.position.h = Math.floor(Math.random() * this.size.h);
        this.players.push(player);
    }

    disconnectPlayer(player: Player) {
        const playerIndex = this.players.findIndex(p => p == player);
        if (playerIndex !== -1) {
            this.players.splice(playerIndex, 1);
        }
    }

    getPlayers() {
        return this.players;
    }

    startGame() {
        console.log(this.players)
        const playerData = this.players.map(player => ({
            id: player.uuid,
            position: player.position,
        }));
        this.players.forEach(player => {
            player.socket.emit('gameStart', playerData);
        });
        setInterval(() => this.updateGame(), 100);
    }

    updateGame() {
        this.players.forEach(player => this.runPlayer(player));
        const playerData = this.players.map(player => ({
            id: player.uuid,
            position: player.position,
            hitWall: player.hitWall,
            hitCorner: player.hitCorner,
            points: player.points,
        }));
        this.players.forEach(player => {
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
            player.direction = 180 - player.direction;
            player.position.w = Math.max(0, Math.min(maxW, player.position.w));
        }
        if (onHeight) {
            player.direction = 360 - player.direction;
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

import Player from "./player";
import Size from "./size";

export default class Game {
    private readonly size: Size = {w: 640, h: 480}

    private readonly players: Player[] = [];

    addPlayer(player: Player) {
        player.position.w = Math.floor(Math.random() * this.size.w);
        player.position.h = Math.floor(Math.random() * this.size.h);
        this.players.push(player);
    }

    desconectPlayer(player: Player) {
        const playerIndex = this.players.findIndex(p => p == player);
        if (playerIndex !== -1) {
            this.players.splice(playerIndex, 1);
        }
    }

    getPlayers() {
        return this.players;
    }

    startGame(callback?: (players: Player[]) => void) {
        console.log(this.players)
        this.updateGame(callback)
    }

    updateGame(callback?:(players: Player[]) => void) {
        this.players.forEach(player => this.runPlayer(player));
        if (callback) {
            callback(this.players);
        }
        setTimeout(() => this.updateGame(callback), 100);
    }

    runPlayer(player: Player) {
        const directionInRadians = player.direction * (Math.PI / 180);

        player.position.w += Math.cos(directionInRadians) * player.speed;
        player.position.h += Math.sin(directionInRadians) * player.speed;

        const minW = player.size.w / 2;
        const maxW = this.size.w - (player.size.w / 2);
        const minH = player.size.h / 2;
        const maxH = this.size.h - (player.size.h / 2);

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

        player.direction = player.direction % 360;
        if (player.direction < 0) {
            player.direction += 360;
        }
    }
}

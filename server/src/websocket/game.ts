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
        // Convert direction from degrees to radians for calculations
        const directionInRadians = player.direction * (Math.PI / 180);

        // Update position based on direction and speed
        player.position.w += Math.cos(directionInRadians) * player.speed;
        player.position.h += Math.sin(directionInRadians) * player.speed;

        // Check for wall collisions and reflect direction
        // Left or right wall collision
        if (player.position.w <= 0 || player.position.w >= this.size.w) {
            // Reflect horizontally: new_direction = 180 - direction
            player.direction = 180 - player.direction;
            // Ensure player stays within bounds
            player.position.w = Math.max(0, Math.min(this.size.w, player.position.w));
        }

        // Top or bottom wall collision
        if (player.position.h <= 0 || player.position.h >= this.size.h) {
            // Reflect vertically: new_direction = 360 - direction
            player.direction = 360 - player.direction;
            // Ensure player stays within bounds
            player.position.h = Math.max(0, Math.min(this.size.h, player.position.h));
        }

        // Normalize direction to keep it within [0, 360) degrees
        player.direction = player.direction % 360;
        if (player.direction < 0) {
            player.direction += 360;
        }

        console.log(player.position);
    }
}

import Game from "./game";

export default class SocketRoom {
    readonly game: Game;

    constructor(game: Game) {
        this.game = game;
    }
}
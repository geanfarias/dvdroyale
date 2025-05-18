import { Socket } from "socket.io/dist/socket";
import Size from "./size";

export default class Player {
    readonly name: string;
    readonly uuid: string;
    readonly size: Size = { w: 100, h: 50 };
    readonly position = {
        w: 100,
        h: 100,
    };
    direction: number = 45;
    speed: number = 5;
    readonly socket: Socket;
    hitCorner: boolean = false;
    hitWall: boolean = false;
    points: number = 0;
    unnecessaryClicks: number = 0;
    
    constructor(name: string, uuid: string, socket: Socket) {
        this.name = name;
        this.uuid = uuid;
        this.socket = socket;
    }

    toSerializable() {
        return {
            id: this.uuid,
            position: this.position,
            hitWall: this.hitWall,
            hitCorner: this.hitCorner,
            points: this.points,
            currentPlayer: false,
        }
    }
}
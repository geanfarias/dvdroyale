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
    private readonly baseSpeed: number = 5;
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

    viciar() {
        this.position.w = 496;
        this.position.h = 395;
        this.direction = 38.5;
    }

    speedBoost(multiplier: number, time: number) {
        this.speed += this.baseSpeed * multiplier;
        setTimeout(() => {
            this.speed -= this.baseSpeed * multiplier;
        }, time);
    }
}
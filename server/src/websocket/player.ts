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
    speed: number = 15;
    readonly socket: Socket;

    constructor(name: string, uuid: string, socket: Socket) {
        this.name = name;
        this.uuid = uuid;
        this.socket = socket;
    }
}
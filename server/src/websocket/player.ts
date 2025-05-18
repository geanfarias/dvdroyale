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
    private readonly baseSpeed: number = 1.5;
    speed: number = this.baseSpeed;
    readonly socket: Socket;
    hitCorner: boolean = false;
    hitWall: boolean = false;
    points: number = 0;
    unnecessaryClicks: number = 0;
    private speedTime: number = 0;
    private speedStart?: number;

    constructor(name: string, uuid: string, socket: Socket) {
        this.name = name;
        this.uuid = uuid;
        this.socket = socket;
    }

    toSerializable() {
        const speedTimeLeft = this.speedStart ?
            this.speedTime - new Date().getTime() - this.speedStart  
            : undefined
        return {
            id: this.uuid,
            name: this.name,
            position: this.position,
            hitWall: this.hitWall,
            hitCorner: this.hitCorner,
            points: this.points,
            currentPlayer: false,
            speedTimeLeft: speedTimeLeft,
        }
    }

    viciar() {
        this.position.w = 496;
        this.position.h = 395;
        this.direction = 38.5;
    }

    speedBoost(multiplier: number = 6, time: number = 5000) {
        if (this.speedStart == undefined) {
            this.speed += this.baseSpeed * multiplier;
            this.speedStart = new Date().getTime();
        }
        this.speedTime += time
        this.socket.emit('toast', {message: "Você aumentou seu speed pelo tempo de 5 segundos"});
    }

    removeSpeedBoost() {
        const now = new Date().getTime();
        if (this.speedStart
            && (now - this.speedStart) > this.speedTime
        ) {
            this.speedStart = undefined;
            this.speedTime = 0;
            this.speed = this.baseSpeed
            this.socket.emit('toast', {message: "Seu speed acabou"});
        }
    }

    speedPenalty (time:number, speed:number = this.baseSpeed){
        this.socket.emit('toast', {message: "Você foi penalizado e ficou mais lento por 5 segundos"});
        this.speed -= speed;
        setTimeout(()=>{
            this.speed += this.baseSpeed
            this.socket.emit('toast', {message: "Sua penalidade acabou"});
        }, time);
    }
}
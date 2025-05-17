import Size from "./size";

export default class Player {
    readonly name: string;
    readonly uuid: string;
    readonly size: Size = {w: 100, h: 50};
    readonly position = {
        w: 100,
        h: 100,
    };
    direction: number = 45;
    speed: number = 15;

    constructor(name: string, uuid: string) {
        this.name = name;
        this.uuid = uuid;
    }
}
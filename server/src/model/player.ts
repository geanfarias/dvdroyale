class Player {
    private name: string;
    private uuid: string;

    constructor(name: string, uuid: string) {
        this.name = name;
        this.uuid = uuid;
    }

    getName(): string {
        return this.name;
    }

    getUuid(): string {
        return this.uuid;
    }

    setName(name: string): void {
        this.name = name;
    }

    setUuid(uuid: string): void {
        this.uuid = uuid;
    }
}
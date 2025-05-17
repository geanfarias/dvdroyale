import Room from '../model/room.model'

export default class RoomController {
    async createRoom(name: string, ownerUuid: string) {
        const cretedRoom = await Room.create({
            name,
            owner: ownerUuid,
        });
        return cretedRoom.dataValues;
    }

    async getRoom(id: number) {
        const fetchedRoom = await Room.findByPk(id);
        if (fetchedRoom) {
            return fetchedRoom.dataValues;
        }
        return null;
    }

    async getRoomsList({ page, itemsPerPage }: { page: number, itemsPerPage: number }) {
        const rooms = await Room.findAll({
            limit: itemsPerPage,
            offset: (page - 1) * itemsPerPage,
        });

        const totalRooms = await Room.count();

        return {
            rooms: rooms.map((room) => room.dataValues),
            total: totalRooms,
        };
    }
}

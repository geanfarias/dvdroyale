import PlayerModel from "../model/player.model";
import RoomRankingModel from "../model/room_ranking.model";

export default class RoomRankingController {
    async save(roomId: string, rankings: { [uuid: string]: number }) {
        try {
            const functions: Promise<any>[] = [];
            Object.keys(rankings).forEach(uuid => {
                functions.push(RoomRankingModel.upsert({
                    room: roomId,
                    player: uuid,
                    points: rankings[uuid],
                }))
            })
            await Promise.all(functions);
        } catch (e) {
            console.debug(e);
        }
    }

    async getRoomRankings(roomId: string) {
        try {
            const roomRankings = await RoomRankingModel.findAll({
                where: { room: roomId },
                include: {
                    model: PlayerModel,
                    as: 'playerDetails',
                }
            });

            return roomRankings.map(roomRanking => roomRanking.dataValues);
        } catch (e) {
            console.debug(e);
            return null;
        }
    }
}
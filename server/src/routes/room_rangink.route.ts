import express from 'express'
import RoomRankingController from '../controller/room_ranking.controller';
const RoomRankingRouter = express.Router();

const controller = new RoomRankingController();

const BASE_URL = '/room_ranking';

RoomRankingRouter.get(`${BASE_URL}/:roomId`, async (req, res) => {
    try {
        const { roomId } = { ...req.params };
        const rooms = await controller.getRoomRankings(roomId);
        if (rooms == null) {
            res.status(404).send('Room not found');
        } else {
            res.json(rooms);
        }
    } catch (e) {
        console.debug(e);
        res.status(500).send("Ocorreu um erro, tente novamente")
    }
})

export default RoomRankingRouter;
import express from 'express'
import RoomController from '../controller/room.controller';
const RoomRouter = express.Router();

const controller = new RoomController();

const BASE_URL = '/room';

RoomRouter.post(BASE_URL, async (req, res) => {
    try {
        const { name } = { ...req.body };
        const { uuid } = { ...req.cookies };

        if ((name == null || name == '') || (uuid == null || uuid == '')) {
            throw new Error('Missing required data');
        } else {
            const createdRoom = await controller.createRoom(name, uuid);
            res.json(createdRoom);
        }
    } catch (e) {
        console.debug(e);
        res.status(500).send("Ocorreu um erro, tente novamente")
    }
});

RoomRouter.get(`${BASE_URL}`, async (req, res) => {
    try {
        const { page = 1, itemsPerPage = 10 } = { ...req.query };
        const rooms = await controller.getRoomsList({ page: parseInt(page.toString()), itemsPerPage: parseInt(itemsPerPage.toString()) });
        res.json(rooms);
    } catch (e) {
        console.debug(e);
        res.status(500).send("Ocorreu um erro, tente novamente")
    }
})

RoomRouter.get(`${BASE_URL}/:id`, async (req, res) => {
    try {
        const { id } = { ...req.params };
        const room = await controller.getRoom(parseInt(id));
        if (room == null) {
            res.status(404).send('Room not found');
        } else {
            res.json(room);
        }
    } catch (e) {
        console.debug(e);
        res.status(500).send("Ocorreu um erro, tente novamente")
    }
})

export default RoomRouter;
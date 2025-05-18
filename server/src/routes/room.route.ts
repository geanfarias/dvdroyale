import express from 'express'
import RoomController from '../controller/room.controller';
const RoomRouter = express.Router();

const controller = new RoomController();

const BASE_URL = '/room';

RoomRouter.post(BASE_URL, async (req, res) => {
    try {
        const { uuid } = { ...req.cookies };

        if (uuid == null || uuid == '') {
            throw new Error('Missing required data');
        } else {
            // const createdRoom = await controller.createRoom(uuid);
            res.redirect(`/?room=0a79e357-5c34-44e0-bb86-a86bfd666b15`);
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
        const room = await controller.getRoom(id);
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
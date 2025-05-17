import express from 'express'
import PlayerController from '../controller/player.controller';
const PlayerRouter = express.Router();

const controller = new PlayerController();

const BASE_URL = '/player';

PlayerRouter.get(`${BASE_URL}/`, (req, res) => {
    res.send('testing playercontroller')
})

PlayerRouter.post(BASE_URL, async (req, res) => {
    try {
        const { name } = { ...req.body };

        if (name == null || name == '') {
            res.status(400).send('name is required');
        } else {
            const createdUser = await controller.getOrCreatePlayer(name);
            res.cookie('uuid', createdUser.uuid).json(createdUser);
        }
    } catch (e) {
        console.debug(e);
        res.status(500).send("Ocorreu um erro, tente novamente")
    }
});

export default PlayerRouter;
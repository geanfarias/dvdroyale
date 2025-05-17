import express from 'express'
import PlayerController from '../controller/player.controller';
const PlayerRouter = express.Router();

const controller = new PlayerController();

const BASE_URL = '/player';

PlayerRouter.get(`${BASE_URL}/`, (req, res) => {
    res.send('testing playercontroller')
})

PlayerRouter.post(BASE_URL, async (req, res) => {
    const { name } = { ...req.body };
    console.log(req.body)
    console.log(name)

    if (name == null || name == '') {
        res.status(400).send('name is required');
    } else {
        const createdUser = await controller.createPlayer(name);
        res.json(createdUser);
    }
});

export default PlayerRouter;
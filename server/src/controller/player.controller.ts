import User from "../model/player.model";

export default class PlayerController {
    async getOrCreatePlayer(name: string) {
        const existentUser = await User.findOne({ where: { name }, limit: 1 });
        if (existentUser) return existentUser.dataValues;

        const cretedUser = await User.create({
            name
        });
        return cretedUser.dataValues;
    }

    async getPlayer(uuid: string) {
        try {
            const fetchedUser = await User.findByPk(uuid);
            if (fetchedUser) {
                return fetchedUser.dataValues;
            }
            return null;
        } catch (e) {
            console.debug(e);
            return null;
        }
    }
}

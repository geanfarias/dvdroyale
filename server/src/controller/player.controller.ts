import User from "../database/user";

export default class PlayerController {
    async createPlayer(name: string) {
        const cretedUser = await User.create({
            name
        });
        return cretedUser.dataValues;
    }

    async getPlayer(uuid: string) {
        const fetchedUser = await User.findByPk(uuid);
        if (fetchedUser) {
            return fetchedUser.dataValues;
        }
        return null;
    }
}

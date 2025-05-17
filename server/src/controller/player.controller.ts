import user from "../database/user";

export default class PlayerController {
    async createPlayer(name: String) {
        const cretedUser = await user.create({
            name
        });
        return cretedUser.dataValues;
    }
}

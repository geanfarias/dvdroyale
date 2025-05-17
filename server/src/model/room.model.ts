import { DataTypes } from "sequelize";
import db from "../database/db";
import PlayerModel from "./player.model";

const RoomModel = db.define('Room', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    owner: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: PlayerModel,
            key: 'uuid'
        }
    }
})

export default RoomModel
import { DataTypes } from "sequelize";
import db from "../database/db";
import PlayerModel from "./player.model";

const RoomModel = db.define('Room', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    owner: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: PlayerModel,
            key: 'uuid'
        }
    },
    finished: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
})

export default RoomModel
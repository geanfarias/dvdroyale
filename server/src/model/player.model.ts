import db from "../database/db";
import { DataTypes } from "sequelize";

const PlayerModel = db.define('Player', {
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
})

export default PlayerModel
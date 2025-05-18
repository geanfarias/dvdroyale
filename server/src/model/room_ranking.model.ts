import { DataTypes } from "sequelize";
import db from "../database/db";
import RoomModel from "./room.model";
import PlayerModel from "./player.model";

const RoomRankingModel = db.define('RoomRanking', {
    room: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: RoomModel,
            key: 'id'
        },
        primaryKey: true,
    },
    player: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: PlayerModel,
            key: 'uuid',
        },
        primaryKey: true,
    },
    points: {
        type: DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 0,
    }
})
RoomRankingModel.belongsTo(PlayerModel, { as: 'playerDetails', foreignKey: 'player' });

RoomRankingModel.sync({ force: true })
export default RoomRankingModel;
import { DataTypes } from "sequelize";
import db from "../database/db";

const RoomModel = db.define('Room', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    finished: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
})
setTimeout(() => {
    try {
        RoomModel.upsert({
            id: '0a79e357-5c34-44e0-bb86-a86bfd666b15',
            finished: false,
        });
    }catch (e) {
        console.log('RoomModel already created')
    }
}, 1000)
export default RoomModel
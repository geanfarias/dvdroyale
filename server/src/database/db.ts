import { DataTypes, Sequelize } from 'sequelize';

const db = new Sequelize('sqlite://./db/database.db');

db.sync({ force: true })

export default db;
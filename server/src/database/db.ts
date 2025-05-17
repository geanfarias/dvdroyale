import { Sequelize } from 'sequelize';

const db = new Sequelize('sqlite://./db/database.db');

db.sync({ force: false })

export default db;
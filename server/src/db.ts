import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

async function getDatabase() {
    const db = await open({
        filename: '/tmp/database.db',
        driver: sqlite3.cached.Database
    })

    return db;
}

module.exports = getDatabase
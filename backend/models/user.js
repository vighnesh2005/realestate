import db from "../db/db.js";

try {
    await db.query(
    `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        phoneno VARCHAR(15) NOT NULL UNIQUE
    )`);

    await  db.query(`
        alter table users add column profilepic TEXT DEFAULT NULL 
        `)
    console.log("Users table created or already exists");
} catch (err) {
    console.error("Error creating users table:", err);
};


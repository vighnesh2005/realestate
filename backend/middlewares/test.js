import db from '../db/db.js'

const results = await db.query("SELECT * FROM properties");

console.log(results.rows)
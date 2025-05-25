import dotenv from 'dotenv';
import pg from 'pg';

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

dotenv.config({ path: '../../.env' }); // Go up two levels

const { Pool } = pg;


const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false
  }
}); 

(async () => {
  try {
    const client = await pool.connect();
    console.log('Connected to the database successfully');
    client.release(); // Release the client back to the pool
  } catch (err) {
    console.error('Error connecting to the database', err);
    process.exit(1); 
  }
})();

export default pool;
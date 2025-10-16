import { Pool } from 'pg';

import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const ConnectDB = async () => {
  try {
    await pool.connect(); // ✅ async/await
    console.log("✅ DB connected successfully");
  } catch (err) {
    console.log("❌ DB connection failed", err);
  }

}
export { pool, ConnectDB };
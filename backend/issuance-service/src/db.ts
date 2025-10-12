import { config } from "dotenv";
import { Pool } from "pg";

// Load environment variables from .env file in the project root
config({ path: '../../.env' });

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: true },
});

console.log(pool)
export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
}

// New: initDB to create table if it doesn't exist
export async function initDB() {
  await query(`
    CREATE TABLE IF NOT EXISTS credentials (
      id SERIAL PRIMARY KEY,
      credential_id UUID UNIQUE NOT NULL,
      name TEXT NOT NULL,
      issuer TEXT NOT NULL,
      recipient TEXT NOT NULL,
      issueDate TIMESTAMP NOT NULL,
      expiryDate TIMESTAMP,
      status TEXT NOT NULL,
      data JSONB NOT NULL
    );
  `);
}

import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: true, // needed for Render free tier
  },
});
console.log(pool);
export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
}

// New: initDB to create credentials table if missing
export async function initDB() {
  await query(`
    CREATE TABLE IF NOT EXISTS credentials (
      id SERIAL PRIMARY KEY,
      credential_id UUID UNIQUE NOT NULL,
      name TEXT,
      issuer TEXT,
      recipient TEXT,
      issueDate TIMESTAMP,
      expiryDate TIMESTAMP,
      status TEXT,
      data JSONB
    );
  `);
}

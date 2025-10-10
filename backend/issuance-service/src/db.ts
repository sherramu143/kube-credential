// src/db.js
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Shared DB path
const SHARED_DB_PATH =
  process.env.DB_PATH || path.resolve(__dirname, "../shared/credentials.db");

export async function createDB() {
  console.log("DB Path:", SHARED_DB_PATH);

  try {
    const db = await open({
      filename: SHARED_DB_PATH,
      driver: sqlite3.Database,
    });

    console.log("✅ Connected to SQLite database");

    // ✅ Ensure the credentials table exists
    await db.exec(`
      CREATE TABLE IF NOT EXISTS credentials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        credential_id TEXT UNIQUE,
        data TEXT,
        issued_at TEXT,
        worker_id TEXT
      )
    `);

    console.log("✅ Verification: Table 'credentials' ready");
    return db;
  } catch (err) {
    console.error("❌ DB init error:", err);
    throw err;
  }
}

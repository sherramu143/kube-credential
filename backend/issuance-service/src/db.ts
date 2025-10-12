import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";
import path from "path";

export const SHARED_DB_PATH =
  process.env.DB_PATH || path.resolve(__dirname, "../shared/credentials.db");

console.log("🟩 DB Path:", SHARED_DB_PATH);

export async function createDB() {
  try {
    const dbDir = path.dirname(SHARED_DB_PATH);
    if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

    const db = await open({ filename: SHARED_DB_PATH, driver: sqlite3.Database });

    // Create table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS credentials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        credential_id TEXT UNIQUE,
        name TEXT,
        issuer TEXT,
        recipient TEXT,
        issueDate TEXT,
        expiryDate TEXT,
        status TEXT,
        data TEXT
      );
    `);

    console.log("✅ DB initialized successfully");
    return db;
  } catch (err) {
    console.error("❌ DB init error:", err);
    throw err;
  }
}

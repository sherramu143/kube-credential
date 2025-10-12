// db.ts
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import fs from "fs";
import path from "path";

// ✅ Hardcoded shared path for Docker/Render deployment
export const SHARED_DB_PATH = process.env.DB_PATH || "/app/shared/credentials.db";

// 🧩 Debug logs
console.log("🟩 Current working directory:", process.cwd());
console.log("🟩 DB Path:", SHARED_DB_PATH);

/**
 * Connects to the SQLite database (creates if missing)
 * @returns SQLite Database instance
 */
export async function createDB(): Promise<Database> {
  try {
    // Ensure the parent directory exists
    const dbDir = path.dirname(SHARED_DB_PATH);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
      console.log("✅ Created missing directory:", dbDir);
    }

    // Open SQLite connection
    const db = await open({
      filename: SHARED_DB_PATH,
      driver: sqlite3.Database,
    });

    console.log("✅ Connected to SQLite database:", SHARED_DB_PATH);

    // Ensure credentials table exists
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

    console.log("✅ 'credentials' table ensured in DB");

    return db;
  } catch (err) {
    console.error("❌ DB init error:", err);
    throw err;
  }
}

import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Choose DB path (Render allows /tmp and /app)
export const SHARED_DB_PATH = "/app/shared/credentials.db";

// Log useful paths for debugging
console.log("🟩 Current working directory:", process.cwd());
console.log("🟩 __dirname:", __dirname);
console.log("🟩 DB Path:", SHARED_DB_PATH);

export async function createDB() {
  try {
    // ✅ Ensure directory exists
    const dbDir = path.dirname(SHARED_DB_PATH);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
      console.log("✅ Created missing directory:", dbDir);
    }

    // ✅ Open SQLite connection
    const db = await open({
      filename: SHARED_DB_PATH,
      driver: sqlite3.Database,
    });

    console.log("✅ Connected to SQLite database:", SHARED_DB_PATH);

    // ✅ Create table if it doesn't exist
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

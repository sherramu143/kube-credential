import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Always use /tmp on Render (ephemeral, auto-cleared every deploy)
export const SHARED_DB_PATH = "/app/shared/credentials.db";
console.log("🟩 Current working directory:", process.cwd());
console.log("🟩 __dirname:", path.resolve());
// Create DB connection and ensure table exists
export async function createDB() {
  console.log("DB Path:", SHARED_DB_PATH);

  try {
    const db = await open({
      filename: SHARED_DB_PATH,
      driver: sqlite3.Database,
    });

    console.log("✅ Connected to SQLite database:", SHARED_DB_PATH);

    // Ensure the table exists before any queries run
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

    console.log("✅ Verification Service DB initialized");
    return db;
  } catch (err) {
    console.error("❌ DB init error:", err);
    throw err;
  }
}

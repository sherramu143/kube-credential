import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";
import path from "path";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, "../../"); // Adjust depending on folder depth
const SHARED_DB_PATH = path.join(PROJECT_ROOT, "shared", "credentials.db");

export async function createDB(createTable = false) {
  try {
    const dbDir = path.dirname(SHARED_DB_PATH);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    const db = await open({
      filename: SHARED_DB_PATH,
      driver: sqlite3.Database,
    });

    console.log("✅ Connected to SQLite database:", SHARED_DB_PATH);

    // Only issuance service creates the table
    if (createTable) {
      await db.exec(`
        CREATE TABLE IF NOT EXISTS credentials (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          credential_id TEXT UNIQUE,
          name TEXT,
          email TEXT,
          issued_at TEXT,
          worker_id TEXT
        );
      `);
      console.log("✅ Credentials table ensured (issuance)");
    }

    return db;
  } catch (err) {
    console.error("❌ DB init error:", err);
    throw err;
  }
}

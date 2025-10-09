// backend/verification-service/src/db.ts or issuance-service/src/db.ts
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";
// __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export async function createDB() {
    const dbPath = path.join(__dirname, "../../shared/credentials.db");
    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database,
    });
    // Create table if it doesn't exist
    await db.exec(`
    CREATE TABLE IF NOT EXISTS credentials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      credential_id TEXT UNIQUE,
      data TEXT,
      issued_at TEXT,
      worker_id TEXT
    )
  `);
    return db;
}

// db.ts for Verification Service
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Handle __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root folder of the project (two levels up from service folder)
const PROJECT_ROOT = path.resolve(__dirname, "../../");

// Shared database path
export const SHARED_DB_PATH = "/app/shared/credentials.db";

/**
 * Connects to the SQLite database (verification only)
 * @returns SQLite Database instance
 */
export async function createDB(): Promise<Database> {
  try {
    // Ensure shared folder exists
    const dbDir = path.dirname(SHARED_DB_PATH);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
      console.log("✅ Created missing directory:", dbDir);
    }

    // Open database (do NOT create table)
    const db = await open({
      filename: SHARED_DB_PATH,
      driver: sqlite3.Database,
    });

    console.log("✅ Connected to SQLite database:", SHARED_DB_PATH);

    return db;
  } catch (err) {
    console.error("❌ DB init error:", err);
    throw err;
  }
}

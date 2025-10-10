import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Compute __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use project root as reference (two levels up)
const PROJECT_ROOT = path.resolve(__dirname, "../../");

// Shared DB path
const SHARED_DB_PATH =
  process.env.DB_PATH || path.join(PROJECT_ROOT, "shared", "credentials.db");

/**
 * Connect to the shared SQLite database (verification only)
 */
export async function createDB() {
  try {
    // Ensure shared folder exists
    const dbDir = path.dirname(SHARED_DB_PATH);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
      console.log("✅ Created missing directory:", dbDir);
    }

    // Open DB (do not create table)
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

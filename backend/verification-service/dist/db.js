// db.ts
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export async function createDB() {
    const dbPath = path.join(__dirname, "../../shared/credentials.db");
    // Adjust the ../../ according to where 'shared' folder is relative to this db.ts
    return open({
        filename: dbPath,
        driver: sqlite3.Database
    });
}

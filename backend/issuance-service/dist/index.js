import express from "express";
import { createDB } from "./db.js";
import { v4 as uuidv4 } from "uuid";
const app = express();
const PORT = 4001;
const WORKER_ID = `worker-${Math.floor(Math.random() * 1000)}`;
app.use(express.json());
let db;
createDB()
    .then((database) => {
    db = database;
    console.log(`✅ SQLite DB initialized for Issuance Service`);
})
    .catch((err) => {
    console.error("❌ DB init error:", err?.stack || err);
});
app.post("/issue", async (req, res) => {
    const { data } = req.body;
    if (!data) {
        return res.status(400).json({ error: "data is required" });
    }
    try {
        const dataStr = JSON.stringify(data);
        const existing = await db.get("SELECT * FROM credentials WHERE data = ?", dataStr);
        if (existing) {
            console.log(`[${WORKER_ID}] Duplicate credential: ${existing.credential_id}`);
            return res.json({
                message: `Credential already issued by ${existing.worker_id}`,
                credential_id: existing.credential_id,
                issued_at: existing.issued_at,
                worker_id: existing.worker_id,
            });
        }
        const credential_id = uuidv4();
        const issued_at = new Date().toISOString();
        await db.run("INSERT INTO credentials (credential_id, data, issued_at, worker_id) VALUES (?, ?, ?, ?)", credential_id, dataStr, issued_at, WORKER_ID);
        console.log(`[${WORKER_ID}] Credential issued: ${credential_id}`);
        res.json({
            message: `Credential issued by ${WORKER_ID}`,
            credential_id,
            issued_at,
            worker_id: WORKER_ID,
        });
    }
    catch (err) {
        console.error(`[${WORKER_ID}] DB error:`, err);
        res.status(500).json({ error: "Internal server error" });
    }
});
export { app };
// ✅ Only start the server if not in test mode
if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
        console.log(`🚀 Issuance Service running on port ${PORT} (${WORKER_ID})`);
    });
}

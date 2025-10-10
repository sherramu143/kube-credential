// src/index.ts
import express from "express";
import cors from "cors";
import { createDB } from "./db.js"; // Make sure this exports a working SQLite DB
const app = express();
const PORT = 4002;
const WORKER_ID = `worker-${Math.floor(Math.random() * 1000)}`;
app.use(express.json());
app.use(cors({
    origin: "*", // Allow any frontend
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
let db;
// Initialize SQLite DB
createDB()
    .then((database) => {
    db = database;
    console.log(`✅ Verification Service DB initialized`);
})
    .catch((err) => {
    console.error(`❌ Failed to initialize DB:`, err);
});
// Health check
app.get("/health", (_req, res) => {
    res.json({ status: "ok", worker_id: WORKER_ID });
});
// POST /verify — Verify a credential by ID
app.post("/verify", async (req, res) => {
    try {
        const { credential_id } = req.body;
        if (!credential_id || typeof credential_id !== "string") {
            return res.status(400).json({ error: "Invalid or missing credential_id" });
        }
        const credential = await db.get("SELECT * FROM credentials WHERE credential_id = ?", credential_id);
        if (!credential) {
            return res.status(404).json({ error: "Credential not found" });
        }
        return res.json({
            message: "Credential verified successfully",
            credential_id: credential.credential_id,
            issued_at: credential.issued_at,
            worker_id: credential.worker_id,
        });
    }
    catch (err) {
        console.error(`[${WORKER_ID}] DB or server error:`, err);
        return res.status(500).json({ error: "Internal server error" });
    }
});
// Start server
app.listen(PORT, () => {
    console.log(`🚀 Verification Service running on port ${PORT} (${WORKER_ID})`);
});
export { app };

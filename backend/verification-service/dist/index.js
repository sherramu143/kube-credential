// src/index.ts
import express from "express";
import { createDB } from './db.js'; // <-- note the `.js` when using ES modules
import cors from "cors";
const app = express();
const PORT = 4002;
const WORKER_ID = `worker-${Math.floor(Math.random() * 1000)}`;
app.use(express.json());
app.use(cors({
    origin: "*", // Allow any frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
let db;
// Initialize DB
createDB().then((database) => {
    db = database;
    console.log("✅ SQLite DB initialized for Verification Service");
}).catch((err) => {
    console.error("❌ DB init error:", err);
});
// POST /verify — Verify a credential
app.post("/verify", async (req, res) => {
    const { credential_id } = req.body;
    if (!credential_id) {
        return res.status(400).json({ error: "credential_id is required" });
    }
    try {
        // Check if credential exists
        const credential = await db.get("SELECT * FROM credentials WHERE credential_id = ?", credential_id);
        if (!credential) {
            return res.status(404).json({ error: "Credential not found" });
        }
        // Return verification info
        res.json({
            message: `Credential verified successfully`,
            credential_id: credential.credential_id,
            issued_at: credential.issued_at,
            worker_id: credential.worker_id
        });
    }
    catch (err) {
        console.error("DB error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});
// Start server
app.listen(PORT, () => {
    console.log(`🚀 Verification Service running on port ${PORT} (${WORKER_ID})`);
});
export { app };

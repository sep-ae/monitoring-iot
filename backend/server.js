import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

// STORAGE MODULES
import { loadWaNumbers, saveWaNumbers } from "./modules/storage.js";

// WHATSAPP MODULES
import { initWa, getQr, waStatus, sendToAll, refreshSession } from "./modules/wa.js";

// WEBSOCKET MODULES
import { createWebSocket, broadcast } from "./modules/websocket.js";

// IOT MODULES
import {
    handleSensorPost,
    getSensorData,
    controlPump,
    controlBuzzer,
    resetOverride
} from "./modules/iot.js";
import fs from "fs";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ================================
// START WHATSAPP GATEWAY
// ================================
await initWa();
let waNumbers = loadWaNumbers();

// ================================
// START HTTP SERVER
// ================================
const server = app.listen(3000, () => {
    console.log("🔥 Server running on http://localhost:3000");
});

// ================================
// START WEBSOCKET SERVER
// ================================
createWebSocket(server);

// ================================
// SENSOR & IOT ROUTES
// ================================
app.post("/sensor", handleSensorPost);
app.get("/sensor/latest", getSensorData);

app.post("/pump", controlPump);
app.post("/buzzer", controlBuzzer);

// Reset manual override → kirim ke ESP32
app.post("/reset-override", (req, res) => {
    broadcast("RESET"); // <- ESP32 butuh string, bukan JSON
    res.json({ success: true, message: "Override reset" });
});

// ================================
// WHATSAPP ROUTES
// ================================

// Status
app.get("/wa/status", (req, res) => {
    res.json({
        success: true,
        connected: waStatus()
    });
});

// QR CODE
app.get("/wa/qr", (req, res) => {
    res.json({
        success: true,
        qr: getQr(),
        connected: waStatus()
    });
});

// Refresh session
app.get("/wa/refresh", async (req, res) => {
    await refreshSession();
    res.json({ success: true, message: "QR session refreshed" });
});

// List
app.get("/wa/list", (req, res) => {
    res.json(waNumbers);
});

// Register number
app.post("/wa/register", (req, res) => {
    const { number } = req.body;

    if (!number) {
        return res.status(400).json({ success: false, message: "Number required" });
    }

    if (!waNumbers.includes(number)) {
        waNumbers.push(number);
        saveWaNumbers(waNumbers);
    }

    res.json({ success: true, message: "Nomor tersimpan" });
});

// Update
app.put("/wa/update/:old", (req, res) => {
    const oldNum = req.params.old;
    const { number: newNum } = req.body;

    const index = waNumbers.indexOf(oldNum);
    if (index === -1) {
        return res.status(404).json({ success: false, message: "Number not found" });
    }

    waNumbers[index] = newNum;
    saveWaNumbers(waNumbers);

    res.json({ success: true, message: "Updated" });
});

// Delete
app.delete("/wa/delete/:number", (req, res) => {
    const num = req.params.number;

    waNumbers = waNumbers.filter(n => n !== num);
    saveWaNumbers(waNumbers);

    res.json({ success: true, message: "Deleted" });
});

// Send message
app.post("/wa/send", async (req, res) => {
    const { message } = req.body;

    if (!waStatus()) {
        return res.status(400).json({
            success: false,
            error: "WhatsApp not connected"
        });
    }

    await sendToAll(waNumbers, message);

    res.json({ success: true, sent: waNumbers.length });
});

app.get("/wa/stats", (req, res) => {
    const file = "./data/message_log.json";

    if (!fs.existsSync(file)) {
        return res.json({
            total_messages: 0,
            success_messages: 0,
            failed_messages: 0
        });
    }

    let logs = [];

    try {
        const raw = fs.readFileSync(file, "utf8");
        logs = JSON.parse(raw);
    } catch (err) {
        console.error("Error parsing WA log file:", err);
        return res.json({
            total_messages: 0,
            success_messages: 0,
            failed_messages: 0
        });
    }

    const total = logs.length;
    const success = logs.filter(l => l.status === "success").length;
    const failed = logs.filter(l => l.status === "failed").length;

    res.json({
        total_messages: total,
        success_messages: success,
        failed_messages: failed
    });
});
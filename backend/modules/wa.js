import pino from "pino";
import qrcode from "qrcode";
import fs from "fs";
import makeWASocket, {
  useMultiFileAuthState,
  Browsers,
  DisconnectReason
} from "@whiskeysockets/baileys";

// =====================
// STATE VARIABLE
// =====================
let sock = null;
let qrCodeData = null;
let isConnected = false;
let waReady = false;   // <-- indikator yang benar

// LOG FILE
const LOG_FILE = "./data/message_log.json";

function saveLog(obj) {
  let logs = [];
  if (fs.existsSync(LOG_FILE)) {
    try {
      logs = JSON.parse(fs.readFileSync(LOG_FILE, "utf8"));
    } catch {}
  }

  logs.push(obj);
  fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
}

// =====================
// INIT WA
// =====================
export async function initWa() {
  const { state, saveCreds } = await useMultiFileAuthState("auth");

  sock = makeWASocket({
    browser: Browsers.macOS("Chrome"),
    logger: pino({ level: "silent" }),
    auth: state,
    printQRInTerminal: false
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      qrCodeData = await qrcode.toDataURL(qr);
      console.log("📸 QR baru tersedia. Scan via /wa/qr");
    }

    if (connection === "open") {
      isConnected = true;
      waReady = true; // <-- WA SIAP KIRIM PESAN
      qrCodeData = null;
      console.log("🔥 WhatsApp Connected & Ready");
    }

    if (connection === "close") {
      isConnected = false;
      waReady = false;

      const code = lastDisconnect?.error?.output?.statusCode;
      console.log("⚠ WhatsApp Disconnected:", code);

      if (code === DisconnectReason.loggedOut) {
        console.log("⚠ Session expired. Menghapus auth...");
        fs.rmSync("./auth", { recursive: true, force: true });
      }

      console.log("🔄 Reconnecting in 2s...");
      setTimeout(initWa, 2000);
    }
  });
}

// =====================
// STATUS
// =====================
export function getQr() {
  return qrCodeData;
}

export function waStatus() {
  return isConnected && waReady;
}

export async function refreshSession() {
  fs.rmSync("./auth", { recursive: true, force: true });
  await initWa();
}

// =====================
// SEND MESSAGE
// =====================
export async function sendToAll(numbers, message) {
  if (!sock) {
    console.log("❌ Socket belum dibuat");
    saveLog({
      time: new Date(),
      status: "failed",
      reason: "socket-null",
      message
    });
    return false;
  }

  if (!waReady) {
    console.log("❌ WhatsApp belum siap (waReady=false)");
    saveLog({
      time: new Date(),
      status: "failed",
      reason: "wa-not-ready",
      message
    });
    return false;
  }

  for (let num of numbers) {
    try {
      await sock.sendMessage(num + "@s.whatsapp.net", { text: message });

      console.log(`✅ Pesan terkirim ke ${num}`);

      saveLog({
        time: new Date(),
        number: num,
        status: "success",
        message
      });

    } catch (err) {
      console.log(`❌ Gagal kirim ke ${num}:`, err.message);

      saveLog({
        time: new Date(),
        number: num,
        status: "failed",
        reason: err.message,
        message
      });
    }
  }

  return true;
}

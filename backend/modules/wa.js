import pino from "pino";
import qrcode from "qrcode";
import fs from "fs";
import makeWASocket, {
  useMultiFileAuthState,
  Browsers,
  DisconnectReason
} from "@whiskeysockets/baileys";

let sock = null;
let qrCodeData = null;
let isConnected = false;

export async function initWa() {
  const { state, saveCreds } = await useMultiFileAuthState("auth");

  sock = makeWASocket({
    browser: Browsers.macOS("Chrome"),
    logger: pino({ level: "silent" }),
    auth: state
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, qr, lastDisconnect } = update;

    if (qr) {
      qrCodeData = await qrcode.toDataURL(qr);
    }

    if (connection === "open") {
      isConnected = true;
      qrCodeData = null;
      console.log("🔥 WhatsApp Connected");
    }

    if (connection === "close") {
      isConnected = false;
      const code = lastDisconnect?.error?.output?.statusCode;

      if (code === DisconnectReason.loggedOut) {
        fs.rmSync("./auth", { recursive: true, force: true });
      }

      console.log("⚠ Reconnecting WhatsApp...");
      setTimeout(initWa, 2000);
    }
  });
}

export function getQr() {
  return qrCodeData;
}

export function waStatus() {
  return isConnected;
}

export async function refreshSession() {
  fs.rmSync("./auth", { recursive: true, force: true });
  await initWa();
}

export async function sendToAll(numbers, message) {
  if (!sock) return false;
  for (let num of numbers) {
    await sock.sendMessage(num + "@s.whatsapp.net", { text: message });
  }
}

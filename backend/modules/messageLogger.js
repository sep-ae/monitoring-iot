import fs from "fs";

const LOG_FILE = "./data/message_logs.json";

export function loadLogs() {
  try {
    if (!fs.existsSync(LOG_FILE)) return [];

    const raw = fs.readFileSync(LOG_FILE, "utf8").trim();
    if (!raw) return [];

    return JSON.parse(raw);
  } catch (err) {
    console.error("❌ Error reading logs:", err);
    return [];
  }
}

export function addLog(entry) {
  try {
    let logs = loadLogs();

    logs.push({
      time: new Date().toISOString(),
      ...entry
    });

    fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
  } catch (err) {
    console.error("❌ Error writing logs:", err);
  }
}

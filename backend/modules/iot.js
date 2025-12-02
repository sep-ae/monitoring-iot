import { broadcast } from "./websocket.js";
import { sendToAll } from "./wa.js";
import { checkFire } from "./fireLogic.js";
import { loadWaNumbers } from "./storage.js";

let sensorData = {
  temperature: 0,
  humidity: 0,
  mq2: 0,
  pump: false,
  buzzer: false,
  fire: false
};

let fireCooldown = false;

export async function handleSensorPost(req, res) {
  const { temperature, humidity, mq2 } = req.body;

  sensorData.temperature = temperature;
  sensorData.humidity = humidity;
  sensorData.mq2 = mq2;

  // ================================
  // BROADCAST REALTIME KE DASHBOARD
  // ================================
  broadcast({
    type: "sensor_update",
    data: sensorData
  });

  // ================================
  // CEK KEBAKARAN
  // ================================
  checkFire(
    sensorData,

    // ========== FIRE DETECTED ==========
    async () => {
      if (!sensorData.fire) {
        sensorData.fire = true;

        broadcast({ type: "fire_detected", data: sensorData });

        // ALERT WA (cooldown 30s)
        if (!fireCooldown) {
          fireCooldown = true;
          const list = loadWaNumbers();
          await sendToAll(list, "🔥 FIRE ALERT! Kebakaran terdeteksi!");
          setTimeout(() => fireCooldown = false, 30000);
        }

        // ============================
        // TURN ON PUMP & BUZZER (ESP32)
        // ============================
        broadcast("PUMP ON");
        broadcast("BUZZER ON");

        // ============================
        // SYNC STATE KE DASHBOARD
        // ============================
        sensorData.pump = true;
        sensorData.buzzer = true;

        broadcast({ type: "pump_control", state: true });
        broadcast({ type: "buzzer_control", state: true });
      }
    },

    // ========== FIRE CLEARED ==========
    () => {
      if (sensorData.fire) {
        sensorData.fire = false;

        broadcast({ type: "fire_cleared", data: sensorData });

        // turn off physical relays di ESP32
        broadcast("PUMP OFF");
        broadcast("BUZZER OFF");

        // sync dashboard juga
        sensorData.pump = false;
        sensorData.buzzer = false;

        broadcast({ type: "pump_control", state: false });
        broadcast({ type: "buzzer_control", state: false });
      }
    }
  );

  res.send("OK");
}

// ================================
// GET SENSOR VALUE NOW
// ================================
export function getSensorData(req, res) {
  res.json(sensorData);
}

// ================================
// MANUAL CONTROL PUMP
// ================================
export function controlPump(req, res) {
  const { state } = req.body;
  sensorData.pump = state;

  // ke ESP32
  broadcast(state ? "PUMP ON" : "PUMP OFF");

  // dashboard
  broadcast({
    type: "pump_control",
    state
  });

  res.send("OK");
}

// ================================
// MANUAL CONTROL BUZZER
// ================================
export function controlBuzzer(req, res) {
  const { state } = req.body;
  sensorData.buzzer = state;

  broadcast(state ? "BUZZER ON" : "BUZZER OFF");

  broadcast({
    type: "buzzer_control",
    state
  });

  res.send("OK");
}

// ================================
// RESET MANUAL OVERRIDE
// ================================
export function resetOverride(req, res) {
  broadcast("RESET");
  res.json({ success: true, message: "Override reset" });
}

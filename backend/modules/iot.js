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

  // broadcast realtime ke dashboard (JSON)
  broadcast({
    type: "sensor_update",
    data: sensorData
  });

  // cek kebakaran
  checkFire(
    sensorData,

    async () => {
      if (!sensorData.fire) {
        sensorData.fire = true;
        broadcast({ type: "fire_detected", data: sensorData });

        if (!fireCooldown) {
          fireCooldown = true;
          const list = loadWaNumbers();
          await sendToAll(list, "🔥 FIRE ALERT! Kebakaran terdeteksi!");
          setTimeout(() => fireCooldown = false, 30000);
        }

        // otomatis ON-kan relay ke ESP32
        broadcast("PUMP ON");
        broadcast("BUZZER ON");
      }
    },

    () => {
      if (sensorData.fire) {
        sensorData.fire = false;
        broadcast({ type: "fire_cleared", data: sensorData });

        broadcast("PUMP OFF");
        broadcast("BUZZER OFF");
      }
    }
  );

  res.send("OK");
}

export function getSensorData(req, res) {
  res.json(sensorData);
}

export function controlPump(req, res) {
  const { state } = req.body;
  sensorData.pump = state;

  // untuk ESP32
  broadcast(state ? "PUMP ON" : "PUMP OFF");

  // untuk dashboard
  broadcast({
    type: "pump_control",
    state
  });

  res.send("OK");
}

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

export function resetOverride(req, res) {
  broadcast("RESET");
  res.json({ success: true, message: "Override reset" });
}

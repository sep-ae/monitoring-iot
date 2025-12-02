README.md
# 🛰️ Monitoring IoT

Project ini adalah sistem Monitoring IoT yang menggunakan:

- **ESP32** untuk mengirim data sensor (Suhu, Kelembaban, MQ2)
- **Backend Node.js** untuk menerima data, deteksi kebakaran, dan mengirim notifikasi WhatsApp
- **Frontend Vue.js** sebagai dashboard realtime

---

## 📦 Instalasi

### 1. Backend (Node.js)
Masuk ke folder backend:

```sh
cd backend
npm install
node server.js
```


Jika berhasil akan muncul:

```Server running on http://localhost:3000```


## 2. Frontend (Vue.js Dashboard)

Masuk ke folder frontend:

```sh cd frontend
npm install
npm run dev
```


Akses dashboard:

```http://localhost:5173```

📡 ESP32 → Backend

ESP32 harus mengirim data ke backend:

```POST http://<ip-backend>:3000/sensor```

Body JSON:

```sh {
  "temperature": 30,
  "humidity": 65,
  "mq2": 200
}
```

🔥 Fitur Utama

- Monitoring sensor realtime
- Deteksi kebakaran otomatis
- Broadcast WebSocket ke dashboard
- WhatsApp Alert menggunakan Baileys
- Kontrol Pump & Buzzer dari dashboard
- Auto reconnect WhatsApp

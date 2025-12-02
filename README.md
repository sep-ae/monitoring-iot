Monitoring IoT – Simple README

Project ini adalah sistem monitoring IoT yang terdiri dari:

Backend (Node.js) → menerima data sensor, deteksi kebakaran, kirim broadcast WS, dan kirim notifikasi WhatsApp (Baileys).

Frontend (Vue.js) → dashboard untuk menampilkan data sensor secara realtime.

ESP32 → mengirim data suhu, kelembaban, dan MQ2 ke backend.

📦 Cara Install
1. Clone Project (opsional jika dari GitHub)
git clone <repo-url>
cd MONITORING-IOT

📡 Backend Setup

Masuk ke folder backend:

cd backend
npm install


Jalankan backend:

node server.js


Jika berhasil:

🔥 Server running on http://localhost:3000


Untuk login WhatsApp, buka:

http://localhost:3000/wa/qr


Scan QR via WA agar backend bisa mengirim alert.

🖥 Frontend Setup

Masuk ke folder frontend:

cd frontend
npm install
npm run dev


Akses dashboard:

http://localhost:5173

📡 Integrasi ESP32

ESP32 harus mengirim data ke backend:

POST http://<ip-backend>:3000/sensor


Body JSON:

{
  "temperature": 30,
  "humidity": 65,
  "mq2": 210
}

🔥 Fitur Utama

Monitoring suhu, kelembaban, MQ2 realtime

Deteksi kebakaran otomatis

Broadcast WebSocket ke dashboard

Kirim WhatsApp Alert

Kontrol Pump & Buzzer dari dashboard

Auto-reconnect WhatsApp

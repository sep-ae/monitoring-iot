const API_ROOT = import.meta.env.VITE_API_ROOT;   // contoh: http://localhost:3000
const WS_ROOT  = import.meta.env.VITE_WS_ROOT;    // contoh: ws://localhost:3000

export const API_ENDPOINTS = {
    // ================================
    // SENSOR & FIRE MONITORING
    // ================================
    SENSOR_POST:        `${API_ROOT}/sensor`,
    SENSOR_LATEST:      `${API_ROOT}/sensor/latest`,

    // ================================
    // CONTROL ENDPOINTS
    // ================================
    PUMP_CONTROL:       `${API_ROOT}/pump`,
    BUZZER_CONTROL:     `${API_ROOT}/buzzer`,
    RESET_OVERRIDE:     `${API_ROOT}/reset-override`,

    // ================================
    // WA MESSAGE STATS (BARU)
    // ================================
    WA_COUNT:           `${API_ROOT}/wa/stats`,   // <---- TAMBAHKAN INI BRO

    // ================================
    // WEBSOCKET SERVER
    // ================================
    WS: WS_ROOT,
};
export const WA_API = {
    QR: `${API_ROOT}/wa/qr`,
    LIST: `${API_ROOT}/wa/list`,
    REGISTER: `${API_ROOT}/wa/register`,
    UPDATE: `${API_ROOT}/wa/update`,
    DELETE: `${API_ROOT}/wa/delete`,
    SEND: `${API_ROOT}/wa/send`,
    STATUS: `${API_ROOT}/wa/status`,

    // Tambahan untuk statistik pesan
    STATS: `${API_ROOT}/wa/stats`,  // opsional, kalau mau WA_API juga punya
};



<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import Chart from "primevue/chart";
import { API_ENDPOINTS } from "@/config/api";

const MAX_POINTS = 20;

// Raw arrays (NOT reactive) untuk performa
let labels = Array(MAX_POINTS).fill("");
let temp = Array(MAX_POINTS).fill(null);
let hum = Array(MAX_POINTS).fill(null);

// RAW GAS (optional jika mau tampilin tooltip)
let rawGas = Array(MAX_POINTS).fill(null);

// GAS yang sudah di-scale (untuk chart)
let scaledGas = Array(MAX_POINTS).fill(null);

// fungsi scaling MQ2 biar tidak terlalu tinggi
function scaleMQ2(value) {
    // Kamu bisa adjust rumus scaling ini
    return (value - 300) / 3; 
}

// reactive chart object
const chartData = ref({});

function updateChart() {
    chartData.value = {
        labels: [...labels],
        datasets: [
            {
                label: "Temperature (°C)",
                data: [...temp],
                borderColor: "#0ea5e9",
                backgroundColor: "rgba(14,165,233,0.15)",
                fill: true,
                tension: 0.35,
                borderWidth: 2
            },
            {
                label: "Humidity (%)",
                data: [...hum],
                borderColor: "#8b5cf6",
                backgroundColor: "transparent",
                fill: false,
                tension: 0.35,
                borderWidth: 2
            },
            {
                label: "Gas MQ-2 (scaled)",
                data: [...scaledGas], // gunakan gas yang sudah dikecilkan
                borderColor: "#22c55e",
                backgroundColor: "rgba(34,197,94,0.25)",
                fill: true,
                tension: 0.35,
                borderWidth: 2
            }
        ]
    };
}

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    transitions: { active: { animation: { duration: 0 } } },

    plugins: {
        legend: { labels: { color: "#475569" } },
        tooltip: {
            callbacks: {
                // tampilkan nilai GAS asli (tidak di-scale)
                label: function (context) {
                    if (context.dataset.label.includes("Gas")) {
                        const original = rawGas[context.dataIndex];
                        return `Gas MQ-2: ${original}`;
                    }
                    return `${context.dataset.label}: ${context.parsed.y}`;
                }
            }
        }
    },

    scales: {
        x: { ticks: { color: "#94a3b8" }, grid: { color: "#e2e8f0" }},
        y: { ticks: { color: "#94a3b8" }, grid: { color: "#e2e8f0" }}
    }
};

let ws = null;

onMounted(() => {
    updateChart();

    ws = new WebSocket(API_ENDPOINTS.WS);

    ws.onmessage = (msg) => {
        const p = JSON.parse(msg.data);
        if (p.type !== "sensor_update") return;

        const T = p.data.temperature;
        const H = p.data.humidity;
        const G = p.data.mq2;
        const Gscaled = scaleMQ2(G);

        // push data baru
        labels.push("");
        temp.push(T);
        hum.push(H);
        rawGas.push(G);
        scaledGas.push(Gscaled);

        // limit max point
        if (labels.length > MAX_POINTS) {
            labels.shift();
            temp.shift();
            hum.shift();
            rawGas.shift();
            scaledGas.shift();
        }

        updateChart();
    };
});

onBeforeUnmount(() => ws && ws.close());
</script>

<template>
    <div class="card mt-6">
        <h2 class="text-xl font-semibold mb-4">Realtime Sensor Chart</h2>
        <Chart type="line" :data="chartData" :options="chartOptions" class="h-[28rem]" />
    </div>
</template>

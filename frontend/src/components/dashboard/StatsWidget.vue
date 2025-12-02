<template>
    <!-- Temperature -->
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4">Temperature</span>
                    <div
                        class="text-xl font-bold"
                        :class="temperature >= 60 ? 'text-red-500' : 'text-surface-900 dark:text-surface-0'"
                    >
                        {{ temperature }}°C
                    </div>
                </div>

                <div
                    class="flex items-center justify-center bg-red-100 dark:bg-red-400/10 rounded-border"
                    style="width: 2.5rem; height: 2.5rem"
                >
                    <i class="pi pi-sun text-red-500 !text-xl"></i>
                </div>
            </div>

            <span :class="temperature >= 60 ? 'text-red-500 font-bold' : 'text-primary'">
                {{ temperature >= 60 ? 'High Temperature!' : 'Normal' }}
            </span>
        </div>
    </div>

    <!-- Humidity -->
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4">Humidity</span>
                    <div class="text-xl font-bold">{{ humidity }}%</div>
                </div>

                <div
                    class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border"
                    style="width: 2.5rem; height: 2.5rem"
                >
                    <i class="pi pi-cloud text-blue-500 !text-xl"></i>
                </div>
            </div>

            <span class="text-muted-color">DHT22 Sensor</span>
        </div>
    </div>

    <!-- Gas MQ2 -->
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4">Gas Level (MQ2)</span>
                    <div
                        class="text-xl font-bold"
                        :class="mq2 >= 1000 ? 'text-red-500' : 'text-surface-900 dark:text-surface-0'"
                    >
                        {{ mq2 }}
                    </div>
                </div>

                <div
                    class="flex items-center justify-center bg-green-100 dark:bg-green-400/10 rounded-border"
                    style="width: 2.5rem; height: 2.5rem"
                >
                    <i class="pi pi-chart-line text-green-500 !text-xl"></i>
                </div>
            </div>

            <span :class="mq2 >= 1000 ? 'text-red-500 font-bold' : 'text-primary'">
                {{ mq2 >= 1000 ? 'High Gas Level!' : 'Normal' }}
            </span>
        </div>
    </div>

    <!-- WhatsApp Status -->
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color font-medium mb-4">WhatsApp Status</span>
                    <div
                        class="text-xl font-bold"
                        :class="waConnected ? 'text-green-500' : 'text-red-500'"
                    >
                        {{ waConnected ? "Connected" : "Disconnected" }}
                    </div>
                </div>

                <div
                    class="flex items-center justify-center bg-green-100 dark:bg-green-400/10 rounded-border"
                    style="width: 2.5rem; height: 2.5rem"
                >
                    <i class="pi pi-whatsapp text-green-500 !text-xl"></i>
                </div>
            </div>

            <span :class="waConnected ? 'text-primary' : 'text-red-500 font-bold'">
                {{ waConnected ? 'Notifications Active' : 'Reconnect Required' }}
            </span>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { API_ENDPOINTS, WA_API } from "@/config/api";

const temperature = ref(0);
const humidity   = ref(0);
const mq2        = ref(0);
const waConnected = ref(false);

let ws = null;

// === LOAD WA STATUS SEKALI DI AWAL ===
async function loadWaStatus() {
    try {
        const res = await fetch(WA_API.STATUS);
        const data = await res.json();
        waConnected.value = data.connected;
    } catch (err) {
        console.error("WA status error:", err);
    }
}

onMounted(() => {
    // === CONNECT WEBSOCKET ===
    ws = new WebSocket(API_ENDPOINTS.WS);

    ws.onopen = () => console.log("WS connected");

    ws.onmessage = (msg) => {
        const payload = JSON.parse(msg.data);

        if (payload.type === "sensor_update") {
            temperature.value = payload.data.temperature;
            humidity.value    = payload.data.humidity;
            mq2.value         = payload.data.mq2;
        }
    };

    ws.onclose = () => console.log("WS disconnected");

    loadWaStatus();
});

onBeforeUnmount(() => {
    if (ws) ws.close();
});
</script>


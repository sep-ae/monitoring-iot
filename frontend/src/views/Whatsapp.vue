<script setup>
import { ref, onMounted } from "vue";
import { WA_API } from "@/config/api";

// COMPONENTS
import WhatsappStats from "@/components/whatsapp/WhatsappStats.vue";
import WhatsappQR from "@/components/whatsapp/WhatsappQrCard.vue";

const connected = ref(false);
const connectionStatus = ref("Memeriksa...");

async function loadStatus() {
    try {
        const res = await fetch(WA_API.STATUS);
        const data = await res.json();

        connected.value = data.connected;
        connectionStatus.value = data.connected
            ? "Terhubung ke WhatsApp"
            : "Tidak terhubung ke WhatsApp";

    } catch {
        connectionStatus.value = "Gagal memeriksa status WhatsApp";
    }
}

onMounted(() => {
    loadStatus();
    setInterval(loadStatus, 20000);
});
</script>

<template>
    <div class="card p-6 space-y-6">

        <h1 class="text-2xl font-bold mb-2">WhatsApp Gateway</h1>
        <p class="text-gray-500 dark:text-gray-300">{{ connectionStatus }}</p>

        <!-- Stats -->
        <WhatsappStats />

        <!-- QR Login -->
        <WhatsappQR />

    </div>
</template>

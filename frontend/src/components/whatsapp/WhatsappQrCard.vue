<template>
    <div
        class="p-6 border-2 border-dashed rounded-lg shadow-sm
               bg-white dark:bg-gray-900 dark:border-gray-700 transition"
    >

        <div class="flex flex-col md:flex-row items-center md:items-start md:justify-between">

            <!-- QR IMAGE -->
            <div class="flex justify-center md:justify-start md:w-1/3 mb-4 md:mb-0">

                <!-- Jika QR tersedia -->
                <img
                    v-if="qr"
                    :src="qr"
                    class="w-[230px] h-[230px] border rounded bg-gray-50 shadow-sm
                           dark:bg-gray-800 dark:border-gray-700"
                />

                <!-- Jika QR tidak tersedia -->
                <div
                    v-else
                    class="w-[230px] h-[230px] border rounded bg-gray-50 dark:bg-gray-800
                           flex items-center justify-center text-gray-500 dark:text-surface-0
                           text-center px-4 dark:border-gray-700"
                >
                    {{ statusText }}
                </div>

            </div>

            <!-- RIGHT DESCRIPTION -->
            <div class="md:w-2/3 md:pl-6 text-center md:text-left">

                <h5 class="text-lg font-bold text-gray-800 dark:text-surface-0 mb-2">
                    QR Code Sesi WhatsApp
                </h5>

                <!-- Teks panduan kondisi BELUM TERHUBUNG -->
                <template v-if="!connected">
                    <p class="text-gray-600 text-sm dark:text-gray-300 mb-2">
                        Untuk menghubungkan gateway WhatsApp, buka aplikasi <strong>WhatsApp</strong>,
                        pilih <strong>Perangkat Tertaut</strong>, lalu pindai QR di samping.
                    </p>

                    <p class="text-gray-500 text-sm dark:text-gray-400 mb-4">
                        Pastikan koneksi internet stabil agar proses pairing berhasil.
                    </p>
                </template>

                <!-- Teks panduan kondisi SUDAH TERHUBUNG -->
                <template v-else>
                    <p class="text-green-600 text-sm dark:text-green-400 font-medium mb-2">
                        Perangkat berhasil terhubung dengan WhatsApp.
                    </p>

                    <p class="text-gray-500 text-sm dark:text-gray-400 mb-4">
                        Anda dapat menekan tombol <strong>Reload QR</strong> untuk memastikan status terbaru.
                    </p>
                </template>

                <!-- Status realtime -->
                <p class="text-sm text-gray-500 dark:text-gray-300 italic mb-4">
                    {{ statusText }}
                </p>

                <!-- BUTTON -->
                <button
                    @click="refreshQR"
                    :disabled="loading"
                    class="inline-flex items-center gap-2 px-4 py-2 border border-gray-600 dark:border-gray-300
                           text-gray-700 dark:text-surface-0 rounded-lg hover:bg-gray-700 hover:text-white
                           dark:hover:bg-gray-300 dark:hover:text-black transition disabled:opacity-60"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9M20 20v-5h-.581m-15.357-2a8.003 8.003 0 0115.356-2"/>
                    </svg>

                    {{ loading ? "Memuat..." : "Reload QR" }}
                </button>

            </div>

        </div>

    </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { WA_API } from "@/config/api";

const qr = ref(null);
const loading = ref(false);
const statusText = ref("Memuat QR...");
const connected = ref(false);

async function loadQR() {
    try {
        const res = await fetch(WA_API.QR);
        const data = await res.json();

        connected.value = data.connected;

        if (data.connected) {
            qr.value = null;
            statusText.value = "WhatsApp sudah terhubung.";
            return;
        }

        if (!data.qr) {
            statusText.value = "Menunggu QR dari server...";
            return;
        }

        qr.value = data.qr;
        statusText.value = "Scan QR dengan WhatsApp Anda.";

    } catch {
        statusText.value = "Gagal memuat QR";
    }
}

async function refreshQR() {
    loading.value = true;
    await loadQR();
    loading.value = false;
}

onMounted(() => {
    loadQR();

    // Auto refresh QR tiap 5 detik sampai connected
    setInterval(() => {
        if (!connected.value) loadQR();
    }, 5000);
});
</script>

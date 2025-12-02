<template>
    <div class="grid grid-cols-12 gap-4">

        <!-- TOTAL PESAN -->
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-2">Total Pesan</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
                            {{ total }}
                        </div>
                    </div>

                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border"
                        style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-comments text-blue-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">{{ total }}</span>
                <span class="text-muted-color"> Pesan tercatat</span>
            </div>
        </div>

        <!-- BERHASIL -->
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-2">Pesan Berhasil</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
                            {{ success }}
                        </div>
                    </div>

                    <div class="flex items-center justify-center bg-green-100 dark:bg-green-400/10 rounded-border"
                        style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-check-circle text-green-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">{{ success }}</span>
                <span class="text-muted-color"> sukses terkirim</span>
            </div>
        </div>

        <!-- GAGAL -->
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-2">Pesan Gagal</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
                            {{ failed }}
                        </div>
                    </div>

                    <div class="flex items-center justify-center bg-red-100 dark:bg-red-400/10 rounded-border"
                        style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-times-circle text-red-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-red-600 font-medium">{{ failed }}</span>
                <span class="text-muted-color"> gagal terkirim</span>
            </div>
        </div>

        <!-- STATUS WA -->
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-2">Status WhatsApp</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
                            {{ connected ? 'Online' : 'Offline' }}
                        </div>
                    </div>

                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border"
                        style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-whatsapp text-green-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">
                    {{ connected ? 'Terhubung' : 'Terputus' }}
                </span>
                <span class="text-muted-color"> Gateway WhatsApp</span>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { API_ENDPOINTS, WA_API } from "@/config/api";

const total = ref(0);
const success = ref(0);
const failed = ref(0);
const connected = ref(false);

async function loadWAStats() {
    try {
        const resStatus = await fetch(WA_API.STATUS);
        const status = await resStatus.json();
        connected.value = status.connected;

        const resStats = await fetch(API_ENDPOINTS.WA_COUNT);
        const data = await resStats.json();

        total.value = data.total_messages ?? 0;
        success.value = data.success_messages ?? 0;
        failed.value = data.failed_messages ?? 0;

    } catch (err) {
        console.error("Gagal load WA stats:", err);
    }
}

onMounted(() => {
    loadWAStats();
    setInterval(loadWAStats, 15000);
});
</script>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { API_ENDPOINTS } from "@/config/api";
import Button from "primevue/button";

const pump = ref(false);
const buzzer = ref(false);

let ws = null;

async function togglePump() {
    pump.value = !pump.value;
    await fetch(API_ENDPOINTS.PUMP_CONTROL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state: pump.value })
    });
}

async function toggleBuzzer() {
    buzzer.value = !buzzer.value;
    await fetch(API_ENDPOINTS.BUZZER_CONTROL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state: buzzer.value })
    });
}

onMounted(() => {
    ws = new WebSocket(API_ENDPOINTS.WS);

    ws.onmessage = (msg) => {
        let data;
        try { data = JSON.parse(msg.data); } catch { return; }

        if (data.type === "pump_control") pump.value = data.state;
        if (data.type === "buzzer_control") buzzer.value = data.state;
    };
});

onBeforeUnmount(() => ws && ws.close());
</script>
<template>
    <div class="card p-6 space-y-6">

        <h2 class="text-2xl font-bold mb-2">Manual Controls</h2>
        <p class="text-gray-500 dark:text-gray-400">
            Kontrol manual untuk pompa dan alarm buzzer.
        </p>

        <div class="grid grid-cols-12 gap-6">

            <!-- POMPA -->
            <div class="col-span-12 lg:col-span-6">
                <div class="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md 
                            border border-gray-200 dark:border-gray-700 transition">

                    <div class="flex items-center justify-between">
                        
                        <!-- LEFT: Icon + Text -->
                        <div class="flex items-center gap-4">
                            <div class="w-14 h-14 flex items-center justify-center rounded-xl 
                                        bg-blue-100 dark:bg-blue-900/40 text-blue-600 
                                        dark:text-blue-300 text-2xl">
                                <i class="pi pi-filter"></i>
                            </div>

                            <div>
                                <h3 class="font-bold text-lg">Pompa Air</h3>
                                <p class="text-gray-500 dark:text-gray-400 text-sm">
                                    Mengaktifkan pompa pemadam kebakaran.
                                </p>
                                <p class="mt-2 text-sm">
                                    Status:
                                    <span :class="pump ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'">
                                        {{ pump ? 'ON' : 'OFF' }}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <!-- RIGHT: BUTTON -->
                        <Button 
                            :label="pump ? 'Matikan' : 'Nyalakan'"
                            :icon="pump ? 'pi pi-stop' : 'pi pi-play'"
                            :class="pump ? 'p-button-danger' : 'p-button-success'"
                            class="w-auto"
                            @click="togglePump"
                        />
                    </div>

                </div>
            </div>


            <!-- BUZZER -->
            <div class="col-span-12 lg:col-span-6">
                <div class="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md 
                            border border-gray-200 dark:border-gray-700 transition">

                    <div class="flex items-center justify-between">

                        <!-- LEFT -->
                        <div class="flex items-center gap-4">
                            <div class="w-14 h-14 flex items-center justify-center rounded-xl 
                                        bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 
                                        dark:text-yellow-300 text-2xl">
                                <i class="pi pi-bell"></i>
                            </div>

                            <div>
                                <h3 class="font-bold text-lg">Alarm</h3>
                                <p class="text-gray-500 dark:text-gray-400 text-sm">
                                    Mengeluarkan suara peringatan bahaya.
                                </p>
                                <p class="mt-2 text-sm">
                                    Status:
                                    <span :class="buzzer ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'">
                                        {{ buzzer ? 'ON' : 'OFF' }}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <!-- RIGHT BUTTON -->
                        <Button 
                            :label="buzzer ? 'Matikan' : 'Nyalakan'"
                            :icon="buzzer ? 'pi pi-stop' : 'pi pi-volume-up'"
                            :class="buzzer ? 'p-button-danger' : 'p-button-warning'"
                            class="w-auto"
                            @click="toggleBuzzer"
                        />
                    </div>

                </div>
            </div>

        </div>

    </div>
</template>

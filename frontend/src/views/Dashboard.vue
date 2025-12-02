<script setup>
import StatsWidget from '@/components/dashboard/StatsWidget.vue';
import ControlWidget from '@/components/dashboard/ControlWidget.vue';
import NotificationsWidget from '@/components/dashboard/ChartWidget.vue';
</script>

<template>
    <div class="grid grid-cols-12 gap-8">

        <!-- SENSOR STATUS REALTIME -->
        <StatsWidget />

        <!-- MANUAL CONTROL PUMP & BUZZER -->
        <div class="col-span-12">
            <ControlWidget />
        </div>

        <div class="col-span-12">
            <ChartWidget />
        </div>

    </div>
</template>

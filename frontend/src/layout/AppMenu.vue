<script setup>
import { ref } from 'vue';
import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'MAIN',
        items: [
            {
                label: 'Dashboard',
                icon: 'pi pi-fw pi-home',
                to: '/'
            }
        ]
    },
    {
        label: 'NOTIFIKASI',
        items: [
            {
                label: 'WhatsApp Gateway',
                icon: 'pi pi-fw pi-whatsapp',
                to: '/wa'
            },
            {
                label: 'Number List',
                icon: 'pi pi-fw pi-list',
                to: '/wa/numbers'  
            }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="i">
            <app-menu-item :item="item" :index="i" />
        </template>
    </ul>
</template>

<style scoped></style>

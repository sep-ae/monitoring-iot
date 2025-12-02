<script setup>
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Button from "primevue/button";

import { defineProps, defineEmits } from "vue";

const props = defineProps({
    visible: Boolean,
    number: Object,
    isSaving: Boolean,
});

const emit = defineEmits(["update:visible", "save"]);

function closeDialog() {
    emit("update:visible", false);
}
</script>

<template>
    <Dialog 
        :visible="props.visible"
        modal
        :style="{ width: '25rem' }"
        @hide="closeDialog"
    >
        <template #header>
            <h3 class="font-bold">
                {{ props.number.number ? "Edit Nomor" : "Tambah Nomor" }}
            </h3>
        </template>

        <div class="mb-4">
            <label class="font-semibold block mb-1">Nomor WhatsApp</label>
            <InputText 
                v-model="props.number.display"
                placeholder="08xxxx"
                class="w-full"
            />
        </div>

        <template #footer>
            <Button label="Batal" class="p-button-text" @click="closeDialog" />

            <Button 
                label="Simpan"
                icon="pi pi-check"
                :loading="props.isSaving"
                @click="emit('save')"
            />
        </template>
    </Dialog>
</template>

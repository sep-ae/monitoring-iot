<script setup>
import { ref, onMounted } from "vue";
import { WA_API } from "@/config/api";

import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import ConfirmDialog from "primevue/confirmdialog";
import Toast from "primevue/toast";

import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

import NumberDialog from "@/components/whatsapp/NumberDialog.vue";

const confirm = useConfirm();
const toast = useToast();

const numbers = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);

const editingNumber = ref({ number: "", display: "" });
const isSaving = ref(false);
const isEditing = ref(false);

// Load numbers from backend
async function loadNumbers() {
    loading.value = true;

    const res = await fetch(WA_API.LIST);
    const list = await res.json(); // ["62812345", "62898765"]

    numbers.value = list.map(n => ({
        number: n,
        display: "0" + n.substring(2),
    }));

    loading.value = false;
}

// OPEN ADD
function openNewDialog() {
    isEditing.value = false;
    editingNumber.value = { number: "", display: "" };
    dialogVisible.value = true;
}

// OPEN EDIT
function openEditDialog(data) {
    isEditing.value = true;
    editingNumber.value = { ...data }; // { number: 628xx, display: 08xx }
    dialogVisible.value = true;
}

// SAVE (ADD or UPDATE)
async function saveNumber() {
    isSaving.value = true;

    // Convert 08xxxxx → 628xxxxx
    const formatted = editingNumber.value.display
        .replace(/^0/, "62")
        .replace(/\D/g, "");

    if (isEditing.value) {
        // UPDATE
        await fetch(`${WA_API.UPDATE}/${editingNumber.value.number}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ number: formatted })
        });

        toast.add({
            severity: "success",
            summary: "Diubah",
            detail: "Nomor berhasil diperbarui.",
            life: 1500,
        });
    } else {
        // ADD
        await fetch(WA_API.REGISTER, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ number: formatted }),
        });

        toast.add({
            severity: "success",
            summary: "Ditambahkan",
            detail: "Nomor berhasil ditambahkan.",
            life: 1500,
        });
    }

    isSaving.value = false;
    dialogVisible.value = false;
    loadNumbers();
}

// DELETE
function confirmDelete(num) {
    confirm.require({
        message: `Hapus nomor ${num}?`,
        header: "Konfirmasi",
        icon: "pi pi-exclamation-triangle",
        acceptLabel: "Hapus",
        rejectLabel: "Batal",
        acceptClass: "p-button-danger",

        accept: async () => {
            await fetch(`${WA_API.DELETE}/${num}`, { method: "DELETE" });

            toast.add({
                severity: "success",
                summary: "Dihapus",
                detail: "Nomor berhasil dihapus.",
                life: 1500,
            });

            loadNumbers();
        },
    });
}

onMounted(loadNumbers);
</script>

<template>
    <div class="card">

        <div class="flex justify-between items-center mb-5">
            <h1 class="text-sm font-bold text-gray-200">
                Daftar Nomor WhatsApp
            </h1>

            <Button 
                label="Tambah Nomor"
                icon="pi pi-plus"
                class="p-button-success p-button-rounded shadow-2"
                @click="openNewDialog"
            />
        </div>

        <DataTable
            :value="numbers"
            :paginator="true"
            :rows="10"
            responsiveLayout="scroll"
        >
            <Column field="display" header="Nomor WhatsApp" headerClass="table-header" />
            
            <Column header="Aksi" headerClass="table-header" bodyClass="text-center">
                <template #body="{ data }">
                    <div class="flex gap-2 justify-center">
                        <Button 
                            label="Edit"
                            icon="pi pi-pencil"
                            class="p-button-rounded p-button-info p-button-sm"
                            @click="openEditDialog(data)"
                        />

                        <Button 
                            label="Hapus"
                            icon="pi pi-trash"
                            class="p-button-rounded p-button-danger p-button-sm"
                            @click="confirmDelete(data.number)"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>

        <NumberDialog
            :visible="dialogVisible"
            :number="editingNumber"
            :isSaving="isSaving"
            @update:visible="dialogVisible = $event"
            @save="saveNumber"
        />

        <ConfirmDialog />
        <Toast />
    </div>
</template>

<style scoped>
.table-header {
    font-weight: 600;
    font-size: 14px;
    text-align: center;
}
</style>

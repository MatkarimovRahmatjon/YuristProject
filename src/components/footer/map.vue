<template>
    <div class="flex items-center">
        <div v-for="item in data" :key="item.id">
            <div class="w-[350px] sm:w-[600px]" v-html="item.source"></div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { URL } from "../../auth/url";

const data = ref([]);
const getData = async () => {
    try {
        const response = await fetch(`${URL}/map`);
        if (response.ok) {
            const result = await response.json();
            data.value = result;
        } else {
            console.error("Ma'lumotlarni olishda xatolik:", response.statusText);
        }
    } catch (error) {
        console.error("Xatolik:", error);
    }
};
getData();
</script>

<style scoped></style>

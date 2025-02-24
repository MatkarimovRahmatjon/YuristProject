<template>
    <div class="flex items-center justify-center mt-20 bg-white p-4">
        <div class="bg-white p-8 rounded-xl shadow-xl w-[450px] border border-gray-300">
            <h2 class="text-3xl font-bold mb-6 text-gray-900 text-center">
                To'lov qilinadigan mahsulotlar
            </h2>
            <div v-for="(item, index) in paymentItems" :key="item.name" class="flex justify-between items-center p-4 mb-4 border border-gray-300 rounded-lg cursor-pointer 
                 transition duration-300 shadow-sm bg-white hover:bg-gray-100 hover:shadow-md">
                <div>
                    <h1 class="text-lg font-bold text-gray-900">
                        {{ item.name }}
                    </h1>
                    <h1 class="text-sm text-gray-800">
                        {{ item.info }}
                    </h1>
                </div>

                <a :href="item.link" class="text-sm font-semibold bg-blue-600 text-white px-4 py-2 rounded-md shadow-md 
                   hover:bg-blue-700 transition duration-300">
                    To'lov qilish
                </a>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const paymentItems = ref([
    { name: "eskiz.uz", link: "https://eskiz.uz/", info:"SMS habarlar uchun to'lov" },
    { name: "beget.com", link: "https://beget.com/", info:"Server uchun to'lov" },
]);
</script>
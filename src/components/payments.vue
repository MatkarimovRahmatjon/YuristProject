<template>
    <div class="flex items-center justify-center mt-20 bg-white p-4">
        <div class="bg-white p-8 rounded-xl shadow-xl w-[450px] border border-gray-300">
            <h2 class="text-3xl font-bold mb-6 text-gray-900 text-center">
                {{ formattedTitle }}
            </h2>
            <div v-for="(item, index) in localizedPaymentItems" :key="item.name" class="flex justify-between items-center p-4 mb-4 border border-gray-300 rounded-lg cursor-pointer 
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
                    {{ formattedButtonText }}
                </a>
            </div>
        </div>
    </div>
</template>

<script setup>
import { inject, computed } from 'vue';

const dat = inject('dat');

const formattedTitle = computed(() => {
    if (dat.value === 'datalotin') {
        return "To'lov qilinadigan mahsulotlar"; 
    } else if (dat.value === 'datakril') {
        return "Тўлов қилинадиган маҳсулотлар";
    } else {
        return "To'lov qilinadigan mahsulotlar"; 
    }
});

const formattedButtonText = computed(() => {
    return dat.value === 'datakril' ? "Тўлов қилиш" : "To'lov qilish";
});

const paymentItems = [
    { 
        name: "eskiz.uz", 
        link: "https://eskiz.uz/", 
        infoLat: "SMS habarlar uchun to'lov", 
        infoKril: "SMS хабарлар учун тўлов" 
    },
    { 
        name: "beget.com", 
        link: "https://beget.com/", 
        infoLat: "Server uchun to'lov", 
        infoKril: "Сервер учун тўлов" 
    }
];

const localizedPaymentItems = computed(() => {
    return paymentItems.map(item => ({
        name: item.name,
        link: item.link,
        info: dat.value === 'datakril' ? item.infoKril : item.infoLat
    }));
});
</script>

<template>
  <Navbar />
  <div class="flex flex-col items-center py-10">
    <div class="flex flex-col items-center mt-6 px-4">
      <h1 class="text-2xl sm:text-4xl font-bold text-center text-blue-800 mb-6">
        O'zbekiston Respublikasi hududida sud tizimiga murojaat qilish tartibi
      </h1>
      <div class="w-full  bg-gray-200 rounded-lg p-6 sm:p-10">
        <h2 class="text-xl sm:text-2xl font-semibold text-blue-800 text-center mb-6">
          Siz o'zingizga kerak bo'lgan sudni tanlang!
        </h2>
        <div class="grid grid-cols-1 justify-center items-center sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="item in data.applications" :key="item.id" @click="goToPath(item.id)"
            class="relative   bg-white border-4 border-blue-800 rounded-lg p-6">
            <div class="flex items-center gap-4">
              <img v-if="item.img" :src="getImageUrl(item.img)" alt="Image" class="w-14 h-14 rounded-md" />
              <h3 class="text-lg font-medium text-center text-black">{{ item.name }}</h3>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { URL } from "../../auth/url.js";
import Navbar from "@/components/header.vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
const data = ref([]);
const Id = ref(null);
const imageBaseUrl = `${URL}/upload`;
const router = useRouter();
const route = useRoute();
const id1 = ref(route.params.id)

const goToPath = (id) => {
  router.push(`/ServiceAdmin/${id}`); // Fix: Corrected the path with backticks
};

const getData = async () => {
  try {
    const response = await fetch(`${URL}/service/${id1.value}`);
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
const getImageUrl = (filename) => `${imageBaseUrl}/${filename}`;
</script>

<style scoped></style>

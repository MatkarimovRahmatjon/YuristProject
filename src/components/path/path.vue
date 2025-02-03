<template>
  <ParticlesHeader />
    <div class="flex flex-col items-center py-10">
      <div class="flex flex-col items-center mt-6 px-4">
        <h1 class="text-2xl sm:text-4xl font-bold text-center text-blue-800 mb-6">
          O'zbekiston Respublikasi hududida sud tizimiga murojaat qilish tartibi
        </h1>
        <div class="w-full  bg-gray-200 rounded-lg p-6 sm:p-10">
          <h2 class="text-xl sm:text-2xl font-semibold text-blue-800 text-center mb-6">
            Siz o'zingizga kerak bo'lgan sudni tanlang!
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="item in data" :key="item.id" @click="goToPath(item.id)" class="relative   bg-white border-4 border-blue-800 rounded-lg p-6">
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
  import { ref, onMounted } from "vue";
  import { watch } from "vue";
  import { useRoute } from "vue-router";
  import { useRouter } from "vue-router";
  import uploadpathadmin from "@/components/path/uploadpathadmin.vue";
  import { URL } from "../../auth/url";
  import axios from "axios";
  import ParticlesHeader from "@/components/header.vue";
  
  const PutId = ref(null);
  const router = useRouter();
  const route = useRoute();
  const url = `${URL}/courts`;
  const imageBaseUrl = `${URL}/upload`;
  const data = ref([]);
  const showModal = ref(false);
  const PutModal = ref(false);
  const asd = ref(false);
  const selectedId = ref(null);
  const id1 = ref(route.params.id)
  
  const getData = async () => {
    try {
      const response = await fetch(`${url}/${id1.value}`);
      if (response.ok) {
        const result = await response.json();
        data.value = result.services.sort((a, b) => a.id - b.id); // Tartiblash
  
      } else {
        console.error("Ma'lumotlarni olishda xatolik:", response.statusText);
      }
    } catch (error) {
      console.error("Xatolik:", error);
    }
  };
  
  const getImageUrl = (filename) => `${imageBaseUrl}/${filename}`;
  
  const goToPath = (id) => {
    router.push(`/aplications/${id}`);
  };
  onMounted(() => {
    getData();
  });
  </script>
  
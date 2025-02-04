<template>
  <div>
    <div class="w-full fixed mb-32 top-0 z-40 mx-auto">
      <!-- Loading State -->
      <div v-if="loading" class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-profile-blue mx-auto"></div>
        <p class=" text-gray-600">Loading profile data...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ error }}
      </div>

      <!-- Profile Content -->
      <div v-else-if="userInfo" class="max-h-[200px] bg-blue-800 flex p-2">
        <!-- Profile Header -->
        <div class="flex gap-6 mb-8">
          <!-- Profile Image -->
          <div class="w-44 h-44 border-2 border-profile-blue rounded-lg overflow-hidden">
            <img
                :src="getImageUrl(userInfo.img)"/>
          </div>

          <!-- Status Section -->
          <div class="flex-1 bg-profile-blue text-white p-5 rounded-lg">
            <div class="mb-4">
              <span class="font-medium">Fuqaroning lavozimi :</span>
              <span class="ml-2">{{ userInfo.role }}</span>
            </div>
            <div class="flex items-center">
              <span class="font-medium">Fuqaroning holati :</span>
              <div class="flex items-center ml-2">
                <span class="mr-2">{{ userInfo.status }}</span>
                <div class="flex gap-1">
                  <div class="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <div class="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                  <div class="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class=" h-[180px] flex flex-col flex-wrap">
          <h1 class="p-2 pr-10 m-2 border">foydalanuvchini
          {{ userInfo.name }} {{ userInfo.surname }} {{ userInfo.dadname }}</h1>
          <h1 class="p-2 pr-10 m-2 border">foydalanuvchini telefon raqami: {{ userInfo.phone }}</h1>
          <h1 class="p-2 pr-10 m-2 border">foydalanuvchini JSHSHR: {{ userInfo.userCode }}</h1></div>
      </div>
    </div>

    <div class="flex">
      <Aside class="fixed left-0 top-0 h-full w-64"/>
      <main class="flex-1 ml-[420px] p-4 mt-64">
        <router-view/>
      </main>
    </div>
  </div>
</template>
<script setup>
import {ref, onMounted} from "vue";
import Aside from "../aside.vue";
import axios from "axios";
import {URL} from "@/auth/url.js";


const id = localStorage.getItem("id");
const newId = id ? parseInt(id) : null;
const loading = ref(false)
const error = ref(false)

if (!newId || isNaN(newId)) {
  console.error("ID topilmadi yoki noto'g'ri formatda.");
}


const userInfo = ref([]);

const getData = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token topilmadi. Foydalanuvchi avtorizatsiyadan o'tmagan.");
      return;
    }

    const response = await axios.get(`${URL}/admin/${newId}`, {
      headers: {Authorization: ` Bearer ${token}`},
    });
    userInfo.value = response.data
    console.log(response)
  } catch (error) {
    console.error("Xatolik:", error.response?.data || error.message);
  }
};
const getImageUrl = (img) => {
  return img ? `${URL}/upload/${img}` : "/default-avatar.png";
};


// Komponent yuklanganda ma'lumotlarni olish
onMounted(() => {
  if (newId) {
    getData();
  }
});
</script>

<style scoped>
.flex {
  display: flex;
}

.h-screen {
  height: 100vh;
}

.ml-64 {
  margin-left: 16rem; /* Aside width */
}

.p-4 {
  padding: 1rem;
}

.overflow-y-auto {
  overflow-y: auto;
}
</style>
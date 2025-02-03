<template>
  <div>
    <div class="w-full  fixed mb-32 top-0 mx-auto p-6">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-profile-blue mx-auto"></div>
        <p class=" text-gray-600">Loading profile data...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ error }}
      </div>

      <!-- Profile Content -->
      <div v-else-if="userInfo" class="max-h-[200px] bg-blue-800 flex rounded-lg shadow-md p-6">
        <!-- Profile Header -->
        <div class="flex gap-6 mb-8">
          <!-- Profile Image -->
          <div class="w-48 h-48 border-2 border-profile-blue rounded-lg overflow-hidden">
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

        <!-- Profile Details -->
        <div class="flex-wrap flex items-start space-y-3">
          <div v-for="(value, key) in {
          'Ism va familya': userInfo.name,
          'Passport raqami': userInfo.passportNumber,
          'Fuqaroning JSHSHIR raqami': userInfo.usercode,
          'Fuqaroning logini': userInfo.username,
          'Fuqaroning mobil telefon raqami': userInfo.phone
        }" :key="key"
               class="flex p-3 w-[300px] hover:bg-white group duration-500 border  rounded-md">
            <span class=" group-hover:text-black min-w-[200px] font-medium duration-500">{{ key }} :</span>
            <span class="flex-1 group-hover:text-black duration-500 ">{{ value }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex mt-[300px] h-screen">
      <!-- Aside komponenti -->
      <Aside class="fixed left-0 top-0 h-full w-64" />

      <!-- Asosiy kontent -->
      <main class="flex-1 ml-64 p-4 overflow-y-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Aside from "../aside.vue";
import axios from "axios";
import { URL } from "@/auth/url.js";


const id = localStorage.getItem("id");
const newId = id ? parseInt(id) : null;


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
      headers: {Authorization:` Bearer ${token}`},
    });
    userInfo.value=response.data
    console.log(data.value)
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
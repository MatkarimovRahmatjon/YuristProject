<script setup>
import {ref, onMounted} from 'vue'
import {useRoute} from "vue-router";
import axios from 'axios'
import {URL} from "@/auth/url.js";

const userInfo = ref(null)
const loading = ref(true)
const error = ref(null)
const route = useRoute()
const qwe = true
const partners = null
const offering = null
const courts = null
const id = ref(route.params.id)
const fetchUserData = async () => {
  try {
    const token = localStorage.getItem("token");
    loading.value = true
    const response = await axios.get(`http://45.146.166.100:3000/admin/${id.value}`, {
      headers: {Authorization: `Bearer ${token}`},
    })
    console.log(response.data)
    userInfo.value = response.data

    console.log(userInfo.value)
  } catch (err) {
    error.value = 'Failed to load user data'
    console.error('Error fetching user data:', err)
  } finally {
    loading.value = false
  }
}
const getImageUrl = (img) => {
  return img ? `${URL}/upload/${img}` : "/default-avatar.png";
};
onMounted(() => {
  fetchUserData()
})
console.log(userInfo)
</script>

<template>

  <div v-if="qwe" class="fixed z-10 inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded-lg">
      <h1 class="text-black text-[20px]">courts</h1>
      <h1 class="text-black text-[20px]">offering</h1>
      <h1 class="text-black text-[20px]">partners</h1>
      <p class="text-red-600 text-sm">{{ err }}</p>
      <button @click="post"
              class="bg-green-600 text-white px-4 py-2 rounded-lg mt-3 w-full\ hover:bg-green-800 transition">
        ✅ Yuborish
      </button>
    </div>
  </div>

  <div class="max-w-4xl mx-auto p-6">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-profile-blue mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading profile data...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>

    <!-- Profile Content -->
    <div v-else-if="userInfo" class="bg-blue-800 rounded-lg shadow-md p-6">
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
      <div class="space-y-3">
        <div v-for="(value, key) in {
          'Ism va familya': userInfo.name,
          'Passport raqami': userInfo.passportNumber,
          'Fuqaroning JSHSHIR raqami': userInfo.usercode,
          'Fuqaroning logini': userInfo.username,
          'Fuqaroning mobil telefon raqami': userInfo.phone
        }" :key="key"
             class="flex p-3 hover:bg-white group duration-500 border  rounded-md">
          <span class=" group-hover:text-black min-w-[200px] font-medium duration-500">{{ key }} :</span>
          <span class="flex-1 group-hover:text-black duration-500 ">{{ value }}</span>
        </div>
      </div>
    </div>

  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { io } from 'socket.io-client';
import { formatDistanceToNow } from 'date-fns';
import { uz } from 'date-fns/locale';
import { URL } from '@/auth/url.js';

const userInfo = ref(null);
const loading = ref(true);
const error = ref(null);
const route = useRoute();
const router = useRouter();
const id = ref(route.params.id);
const onlineAdmins = ref([]);
const socket = io(URL);

const fetchUserData = async () => {
  try {
    const token = localStorage.getItem('token');
    loading.value = true;
    const response = await axios.get(`${URL}/admin/${id.value}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    userInfo.value = response.data;
  } catch (err) {
    error.value = 'Failed to load user data';
    console.error('Error fetching user data:', err);
  } finally {
    loading.value = false;
  }
};

const getImageUrl = (img) => {
  return img ? `${URL}/upload/${img}` : '/default-avatar.png';
};
const getAdminStatus = (admin) => {
  if (onlineAdmins.value.includes(admin.id.toString())) {
    return { status: "Onlayn", color: "text-green-500", dotColor: "bg-green-500" };
  } else if (admin.lastSeen) {
    return {
      status: `${formatDistanceToNow(new Date(admin.lastSeen), {
        addSuffix: true,
        locale: uz,
      })} tarmoqda edi`,
      color: "text-red-500",
      dotColor: "bg-red-500",
    };
  } else {
    return { status: "Oflayn", color: "text-red-500", dotColor: "bg-red-500" };
  }
};

const checkOnlineStatus = (onlineAdminIds) => {
  onlineAdmins.value = onlineAdminIds.map((id) => id.toString());
};

onMounted(() => {
  fetchUserData();
  socket.on('adminOnlineUpdate', checkOnlineStatus);
});

onUnmounted(() => {
  socket.off('adminOnlineUpdate');
  socket.disconnect();
});
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-profile-blue mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading profile data...</p>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>

    <div v-else-if="userInfo" class="bg-blue-800 rounded-lg shadow-md p-6">
      <div class="flex gap-6 mb-8">
        <div class="w-48 h-48 border-2 border-profile-blue rounded-lg overflow-hidden">
          <img :src="getImageUrl(userInfo.img)" />
        </div>

        <div class="flex-1 bg-profile-blue text-white p-5 rounded-lg">
          <div class="mb-4">
            <span class="font-medium">Fuqaroning lavozimi :</span>
            <span class="ml-2">{{ userInfo.lavozimi }}</span>
          </div>
          <div class="flex items-center" v-if="userInfo">
            <span :class="getAdminStatus(userInfo).color">
              {{ getAdminStatus(userInfo).status }}
            </span>
            <div class="w-5 h-5 ml-2 rounded-full" :class="getAdminStatus(userInfo).dotColor"></div>
          </div>

        </div>
      </div>

      <div class="space-y-3">
        <div v-for="(value, key) in {
          'Ism va familya': userInfo.name,
          'Passport raqami': userInfo.userCode,
          'Fuqaroning JSHSHIR raqami ': userInfo.uniqueCode,
          'Fuqaroning logini': userInfo.username,
          'Fuqaroning mobil telefon raqami': userInfo.phone
        }" :key="key" class="flex p-3 hover:bg-lime-500 group duration-500 border rounded-md">
          <span class="group-hover:text-black mr-3 text-[20px] font-medium duration-500">{{ key }} :</span>
          <span class="flex-1 group-hover:text-black text-[20px] duration-500">{{ value }}</span>
        </div>
        <button @click="router.push(`/AdminCon/${id}`)" class="border hover:bg-lime-500 hover:text-black duration-500 flex justify-center gap-4 text-[20px] w-full py-2 rounded-md">
          Tizimga kirish huquqini berish
          <img src="../../../public/settings.png" width="34px" alt="">
          <img src="../../../public/settings3.png" width="34px" alt="">
        </button>
        <button @click="router.push(`/UserTasksFiles/${id}`)" class="border hover:bg-lime-500 duration-500 hover:text-black text-[20px] w-full py-2 rounded-md">Hodim Vazifalari</button>
        <button @click="router.push(`/UserObligationsFiles/${id}`)" class="border hover:bg-lime-500 duration-500 hover:text-black text-[20px] w-full py-2 rounded-md">Hodim Majburiyatlari</button>
        <button @click="router.push(`/UserInfoFiles/${id}`)" class="border hover:bg-lime-500 duration-500 hover:text-black text-[20px] w-full py-2 rounded-md">Hodim Ma'lumotlari</button>
      </div>
    </div>
  </div>
</template>

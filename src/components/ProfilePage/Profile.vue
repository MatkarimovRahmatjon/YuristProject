<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { io } from 'socket.io-client';
import { formatDistanceToNow, differenceInMinutes } from 'date-fns';
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
  if (!admin || !admin.id) {
    return { status: "Noma'lum", color: "text-gray-500", dotColor: "bg-gray-500" };
  }
  const currentAdminId = id.value.toString();
  if (onlineAdmins.value.includes(currentAdminId)) {
    return { status: "Onlayn", color: "text-green-500", dotColor: "bg-green-500" };
  }
  if (admin.lastSeen) {
    const lastSeenDate = new Date(admin.lastSeen);
    const minutesDifference = differenceInMinutes(new Date(), lastSeenDate);
    if (minutesDifference < 1) {
      return { status: "Onlayn", color: "text-green-500", dotColor: "bg-green-500" };
    } else {
      return {
        status: `${formatDistanceToNow(lastSeenDate, { addSuffix: true, locale: uz })} tarmoqda edi`,
        color: "text-red-500",
        dotColor: "bg-red-500",
      };
    }
  }
  return { status: "Oflayn", color: "text-red-500", dotColor: "bg-red-500" };
};

const adminStatus = computed(() => {
  return userInfo.value ? getAdminStatus(userInfo.value) : { status: "Noma'lum", color: "text-gray-500", dotColor: "bg-gray-500" };
});

const checkOnlineStatus = (onlineAdminIds) => {
  onlineAdmins.value = onlineAdminIds.map((adminId) => adminId.toString());
};

onMounted(() => {
  fetchUserData();

  socket.emit('joinAdmin', id.value);

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
          <img :src="getImageUrl(userInfo.img)" alt="Profile Image" />
        </div>

        <div class="flex-1 bg-profile-blue text-white p-5 rounded-lg">
          <div class="mb-4">
            <span class="font-medium">Fuqaroning lavozimi :</span>
            <span class="ml-2">{{ userInfo.lavozimi }}</span>
          </div>
          <div class="flex items-center">
            <span :class="adminStatus.color">
              {{ adminStatus.status }}
            </span>
            <div class="w-5 h-5 ml-2 rounded-full" :class="adminStatus.dotColor"></div>
          </div>
        </div>
      </div>

      <div class="space-y-3">
        <div 
          v-for="(value, key) in {
            'Ism va familya': userInfo.name,
            'Passport raqami': userInfo.userCode,
            'Fuqaroning JSHSHIR raqami': userInfo.uniqueCode,
            'Fuqaroning logini': userInfo.username,
            'Fuqaroning mobil telefon raqami': userInfo.phone
          }" 
          :key="key" 
          class="flex p-3 hover:bg-lime-500 group duration-500 border rounded-md"
        >
          <span class="group-hover:text-black mr-3 text-[20px] font-medium duration-500">{{ key }} :</span>
          <span class="flex-1 group-hover:text-black text-[20px] duration-500">{{ value }}</span>
        </div>
        <button @click="router.push(`/AdminCon/${id}`)" class="border hover:bg-lime-500 hover:text-black duration-500 flex justify-center gap-4 text-[20px] w-full py-2 rounded-md">
          Tizimga kirish huquqini berish
          <img src="../../../public/settings.png" width="34px" alt="settings"/>
          <img src="../../../public/settings3.png" width="34px" alt="settings"/>
        </button>
        <button @click="router.push(`/tasks/${id}`)" class="border hover:bg-lime-500 duration-500 hover:text-black text-[20px] w-full py-2 rounded-md">
          Hodim Vazifalari
        </button>
        <button @click="router.push(`/obligations/${id}`)" class="border hover:bg-lime-500 duration-500 hover:text-black text-[20px] w-full py-2 rounded-md">
          Hodim Majburiyatlari
        </button>
        <button @click="router.push(`/info/${id}`)" class="border hover:bg-lime-500 duration-500 hover:text-black text-[20px] w-full py-2 rounded-md">
          Hodim Ma'lumotlari
        </button>
      </div>
    </div>
  </div>
</template>

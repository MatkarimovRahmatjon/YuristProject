<template>
  <div v-if="modal" class="fixed flex justify-center items-center w-full h-full inset-0 bg-black bg-opacity-80">
    <div class="absolute bg-slate-800 p-10">
      <input v-model="sms" type="text" class="rounded-xl p-3 text-black outline-none" placeholder="SMSni kiriting" />
    </div>
  </div>
  <div>
    <div class="flex flex-col items-center justify-center">
      <div class="min-h-[450px] max-w-[650px] shadow-2xl text-center m-5 p-9 w-full bg-blue-500 rounded-[25px]">
        <h1 class="text-[45px]">Tizimga kirish</h1>
        <form @submit.prevent="setData">
          <input v-model="username" class="rounded-[10px] shadow-2xl w-full text-black my-2 p-2 mt-7 outline-none" placeholder="username" type="text" required />
          <div class="relative">
            <input v-model="password" :type="showPassword ? 'text' : 'password'" class="w-full text-black p-2 my-2 border rounded-lg pr-10" placeholder="Parol" />
            <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-3 flex items-center">
              <img :src="showPassword ? '/eyes.png' : '/eye.png'" alt="Ko'rinishni almashtirish" class="w-5 h-5" />
            </button>
          </div>
          <input v-model="tell" class="rounded-[10px] shadow-2xl w-full text-black my-2 p-2 outline-none" placeholder="telefon raqam" type="number" required />
          <input v-model="jshshr" class="rounded-[10px] shadow-2xl w-full text-black my-2 p-2 outline-none" placeholder="JSHSHR" type="number" required />
        </form>
        <button @click="setData" class="bg-lime-600 shadow-2xl hover:bg-lime-700 duration-500 px-14 rounded-[25px] mt-12 py-3">Tizimga Kirish</button>
        <p v-if="error" class="text-red-500 mt-4">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { URL } from "../auth/url";

const password = ref("");
const username = ref("");
const jshshr = ref("");
const tell = ref("");
const sms = ref("");
const modal = ref(false);
const error = ref("");
const router = useRouter();
const url = `${URL}/login`;
const id = ref(null);
const showPassword = ref(false);

const isMobileDevice = () => {
  return /iphone|ipad|android|mobile/i.test(navigator.userAgent.toLowerCase());
};

const setData = async () => {
  if (isMobileDevice()) {
    error.value = "Telefon orqali tizimga kirish taqiqlangan!";
    return;
  }
  try {
    const res = await axios.post(url, {
      username: username.value.trim(),
      password: password.value.trim(),
    });
    id.value = res.data.data.user.id;
    localStorage.setItem("id", res.data.data.user.id);
    
    if (res.data.statusCode === 200) {
      const token = res.data.data.token;
      const role = res.data.data.user.role;
      const expirationTime = new Date().getTime() + 3600000;
      localStorage.setItem("token", token);
      localStorage.setItem("tokenExpiration", expirationTime.toString());
      localStorage.setItem("role", role);

      if (!role) {
        error.value = "Foydalanuvchi roli aniqlanmadi.";  
      } else if (typeof role !== "string") {
        error.value = "Noto‘g‘ri rol formati.";
      } else if (["admin", "bigAdmin", "yurist","manager"].includes(role.trim())) {
        router.push(`/admin`);
      } else {
        error.value = "Bu rolda tizimga kirish taqiqlangan.";
      }
    }
  } catch (err) {
    error.value = err.response?.data?.message || "Login yoki parol noto'g'ri.";
  }
};

onMounted(isMobileDevice);
</script>
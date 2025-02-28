<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { URL } from "@/auth/url.js";

const id = localStorage.getItem("id");
const newId = parseInt(id);
const data = ref({});

const fetchAdminData = async () => {
  try {
    const response = await axios.get(`${URL}/${localStorage.getItem("role")}/${newId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    data.value = response.data.permissions[response.data.permissions.length - 1];
  } catch (error) {
    console.error("Xatolik yuz berdi:", error);
  }
};

onMounted(fetchAdminData);

const menuItems = [
  { to: "/yurists", label: "Hujjatlarni imzolashga tayyorligini tekshiruvchi yuristlarni yaratish", condition: () => data.value?.yurists },
  { to: "/admin", label: "Sud hujjatlarini yozish", condition: true },
  { to: "/appealAdmin", label: "Interaktiv xizmatlar ro'yxati", condition: true },
  { to: "/admins", label: "Ishchi hodimlarni yaratish ( Admin yaratish )", condition: () => data.value?.admins },
  { to: "/operators", label: "ishchilarni hujjatini yaratuvchi devonxona mudiri", condition: () => data.value?.call_centres },
  { to: "/partners", label: "Hamkorlar ro'yxati", condition: true },
  { to: "/archive", label: "Arxivlar ro'yxati", condition: true },
  { to: "/Requirefiles", label: "Imzolanishi kerak bo'lgan filelar", condition: () => data.value?.userFiles },
  { to: "/payments", label: "Tizim to'lovlari", condition: true },
  { to: "/smile", label: "Stikker qo'shish", condition: true },
  { to: "/screen", label: "Shaxsiy kabinet", condition: true },
];
function open() {
  window.open("https://github.com/")
}
const filteredMenu = computed(() => {
  return menuItems.filter(item => {
    return typeof item.condition === 'function' ? item.condition() : item.condition;
  });
});
</script>

<template>
  <aside class="aside-nav bg-blue-800">
    <router-link :to="item.to" v-for="(item, index) in filteredMenu" :key="index" class="mb-1 li">
      <b class="text-black block w-[30px]">{{ index + 1 }}</b>
      <h1 class="text-black">
        {{ item.label }}
      </h1>
    </router-link>
    <div @click="open()" class="text-black block li">
      <b class="text-black block w-[30px]">{{ menuItems.length + 1 }}</b>
      <h1 class="text-black">
        GitHub
      </h1>
    </div>
  </aside>
</template>

<style scoped>
.aside-nav {
  width: 420px;
  height: 100vh;
  color: black;
  position: fixed;
  top: 200px;
}

.li {
  padding: 15px 20px;
  background-color: #f0d73a;
  transition: background-color 0.3s ease-in-out;
  display: flex;
}

.li:hover {
  background-color: rgba(229, 231, 235, 0.1);
  cursor: pointer;
}
</style>

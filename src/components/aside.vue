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
  { to: "/admin", label: "Asosiy", condition: true },
  { to: "/admin", label: "Sudlar ro'yxati", condition: true },
  { to: "/appealAdmin", label: "Interaktiv xizmatlar ro'yxati", condition: true },
  { to: "/yurists", label: "Yuristlar ro'yxati", condition: () => data.value?.yurists },
  { to: "/admins", label: "Adminlar ro'yxati", condition: () => data.value?.admins },
  { to: "/operators", label: "Mudirlar ro'yxati", condition: () => data.value?.call_centres },
  { to: "/partners", label: "Hamkorlar ro'yxati", condition: true },
  { to: "/archive", label: "Arxivlar ro'yxati", condition: true },
  { to: "/Requirefiles", label: "Filelar", condition: () => data.value?.userFiles },
  { to: "/payments", label: "Tizim to'lovlari", condition: true },
];

const filteredMenu = computed(() => {
  return menuItems.filter(item => {
    return typeof item.condition === 'function' ? item.condition() : item.condition;
  });
});
</script>

<template>
  <aside class="aside-nav bg-blue-800">
    <nav>
      <ul>
        <li v-for="(item, index) in filteredMenu" :key="index" class="my-1">
          <router-link :to="item.to">
            <b class="text-black mr-5">{{ index + 1 }}</b> {{ item.label }}
          </router-link>
        </li>
      </ul>
    </nav>
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

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  padding: 15px 20px;
  background-color: #f0d73a;
  transition: background-color 0.3s ease-in-out;
}

::v-deep(a) {
  color: black !important;
  text-decoration: none;
  font-size: 1.1rem;
  display: block;
}

li:hover {
  background-color: rgba(229, 231, 235, 0.1);
  cursor: pointer;
  color: white;
}
</style>

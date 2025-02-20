<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { URL } from "@/auth/url.js";

const id = localStorage.getItem("id");
const newId = parseInt(id);
const data = ref({});
const fetchAdminData = async () => {
  try {
    const response = await axios.get(`${URL}/admin/${newId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    data.value = response.data.permissions[0];
  } catch (error) {
    console.error("Xatolik yuz berdi:", error);
  }
};

onMounted(fetchAdminData);
</script>

<template>
  <aside class="aside-nav bg-blue-800">
    <nav>
      <ul>
        <li class="mb-1">
          <router-link to="/admin"><b class="text-black mr-5">1</b> Asosiy</router-link>
        </li>
        <li class="my-1">
          <router-link to="/admin"><b class="text-black mr-5">2</b> Sudlar ro'yxati</router-link>
        </li>
        <li class="my-1">
          <router-link to="/appealAdmin"><b class="text-black mr-5">3</b> Interaktiv xizmatlar ro'yxati</router-link>
        </li>
        <li v-if="data.yurists || false" class="my-1">
          <router-link to="/yurists"><b class="text-black mr-5">4</b> Yuristlar ro'yxati</router-link>
        </li>
        <li v-if="data.admins || false" class="my-1">
          <router-link to="/admins"><b class="text-black mr-5">5</b> Adminlar ro'yxati</router-link>
        </li>
        <li v-if="data.call_centres || false" class="my-1">
          <router-link to="/operators"><b class="text-black mr-5">6</b> Operatorlar ro'yxati</router-link>
        </li>
        <li class="my-1">
          <router-link to="/partners"><b class="text-black mr-5">7</b> Hamkorlar ro'yxati</router-link>
        </li>
        <li class="my-1">
          <router-link to="/archive"><b class="text-black mr-5">8</b> Arxivlar ro'yxati</router-link>
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
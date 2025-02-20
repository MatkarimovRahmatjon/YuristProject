<template>
  <div v-if="qwe" class="fixed z-10 inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-blue-600 p-6 rounded-lg w-11/12 max-w-md">
      <div v-for="item in admins" :key="item.id" class="flex items-center border-b-2 mb-2 justify-between">
        <h1 class="text-[20px]">{{ item.name }} {{ item.surname }}</h1>
        <input type="radio" name="admin" :value="item.id" @change="() => handleCheckbox(item.id)"
          :checked="selectedAdminId === item.id" class="rounded-md" />
      </div>
      <button @click="addUserToAllowed" class="mt-4 px-4 py-2 bg-white text-black rounded">Yuborish</button>
    </div>
  </div>

  <div class="mt-36 flex justify-end">
    <button class="border text-black m-2 py-2 px-5 rounded-lg bg-[#09FF52]" @click="qwe = true">Admin qo'shish</button>
  </div>

  <div>
    <ul>
      <li v-for="admin in admins" :key="admin.id" class="flex items-center justify-between bg-[#223B9E] p-4 rounded-md">
        <div class="flex gap-4">
          <h1>{{ admin.name }} {{ admin.surname }}</h1>
          <h1>Lavozimi: {{ admin.role }}</h1>
        </div>
        <div class="flex gap-2">
          <h1>On</h1>
          <label class="switch">
            <input type="checkbox" :checked="admin.isAllowed" @change="() => toggleAdminAccess(admin)">
            <span class="slider round"></span>
          </label>
          <h1>Off</h1>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import { URL } from "@/auth/url.js";
import axios from "axios";

const route = useRoute();
const id = ref(null);
const admins = ref([]);
const allowedUsers = ref([]);
const qwe = ref(false);

const getAdmins = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${URL}/admin`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    admins.value = response.data;
    updateAdminStatuses();
  } catch (error) {
    console.error("Xatolik (getAdmins):", error);
  }
};

const getAllowedUsers = async (courtId) => {
  try {
    const response = await axios.get(`${URL}/allowed-users/${courtId}`);
    allowedUsers.value = response.data;
    updateAdminStatuses();
  } catch (error) {
    console.error("Xatolik (getAllowedUsers):", error);
  }
};

const updateAdminStatuses = () => {
  admins.value.forEach(admin => {
    admin.isAllowed = allowedUsers.value.some(user => user.userId === admin.id);
  });
};

const addUserToAllowed = async (admin) => {
  try {
    await axios.post(`${URL}/allowed-users/${id.value}/${admin.id}`);
    getAllowedUsers(id.value);
  } catch (error) {
    console.error("Xatolik (addUserToAllowed):", error);
  }
};

const removeUserFromAllowed = async (admin) => {
  try {
    await axios.delete(`${URL}/allowed-users/${id.value}/${admin.id}`);
    getAllowedUsers(id.value);
  } catch (error) {
    console.error("Xatolik (removeUserFromAllowed):", error);
  }
};

const toggleAdminAccess = async (admin) => {
  try {
    if (admin.isAllowed) {
      await removeUserFromAllowed(admin);
    } else {
      await addUserToAllowed(admin);
    }
  } catch (error) {
    console.error("Xatolik (toggleAdminAccess):", error);
  }
};

onMounted(() => {
  id.value = route.params.id;
  if (id.value) {
    getAdmins();
    getAllowedUsers(id.value);
  }
});
</script>

<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 25px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 20px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 19px;
  width: 19px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked+.slider {
  background-color: #09FF52;
}

input:checked+.slider:before {
  transform: translateX(24px);
}
</style>

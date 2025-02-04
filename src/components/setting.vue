<script setup>
import {useRoute} from "vue-router";
import {ref, onMounted} from "vue";
import {URL} from "@/auth/url.js";
import axios from "axios";

const route = useRoute();
const id = ref(null);
const admins = ref([]);
const allowedUsers = ref([]);
const matchedAdmins = ref([]);
const selectedAdminId = ref(null);
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
  } catch (error) {
    console.error("Xatolik (getAdmins):", error);
  }
};

const getAllowedUsers = async (courtId) => {
  try {
    const response = await axios.get(`${URL}/allowed-users/${courtId}`);
    allowedUsers.value = response.data;
    matchUsers();
  } catch (error) {
    console.error("Xatolik (getAllowedUsers):", error);
  }
};

const matchUsers = () => {
  matchedAdmins.value = admins.value.filter((admin) =>
      allowedUsers.value.some((allowedUser) => allowedUser.userId === admin.id)
  );
};

const addUserToAllowed = async () => {
  if (!selectedAdminId.value) {
    console.error("Hech qanday admin tanlanmadi!");
    return;
  }

  try {
    const response = await axios.post(
        `${URL}/allowed-users/${id.value}/${selectedAdminId.value}`
    );
    console.log("User muvaffaqiyatli qo‘shildi:", response.data);
    getAllowedUsers(id.value);
  } catch (error) {
    console.error("Xatolik:", error);
  }
};

const removeUserFromAllowed = async (courtId, userId) => {
  try {
    const response = await axios.delete(`${URL}/allowed-users/${courtId}/${userId}`);
    console.log("User muvaffaqiyatli o‘chirildi:", response.data);
    getAllowedUsers(courtId);
  } catch (error) {
    console.error("Xatolik:", error);
  }
};

const handleCheckbox = (adminId) => {
  selectedAdminId.value = selectedAdminId.value === adminId ? null : adminId;
};

const deleteAllowed = (userId) => {
  removeUserFromAllowed(id.value, userId);
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
ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>

<template>
  <div v-if="qwe" class="fixed z-10 inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-blue-600 p-6 rounded-lg w-11/12 max-w-md">
      <div v-for="item in admins" :key="item.id" class="flex items-center border-b-2 mb-2 justify-between">
        <h1 class="text-[20px]">{{ item.name }} {{ item.surname }}</h1>
        <input
            type="radio"
            name="admin"
            :value="item.id"
            @change="() => handleCheckbox(item.id)"
            :checked="selectedAdminId === item.id"
            class="  rounded-md"
        />
      </div>
      <button @click="addUserToAllowed" class="mt-4 px-4 py-2 bg-white text-black rounded">Yuborish</button>
    </div>
  </div>

  <div class="mt-36 flex justify-end">
    <button class="border text-black m-2 py-2 px-5 rounded-lg bg-[#09FF52]" @click="qwe = true">Admin qo'shish</button>
  </div>

  <div>
    <ul>
      <li v-for="admin in matchedAdmins" :key="admin.id" class="flex items-center justify-between bg-[#223B9E]">
        <div class="flex gap-4">
        <h1>{{ admin.name }} {{ admin.surname }}</h1>
          <h1>Lavozimi: {{admin.role}}</h1>
        </div>
        <button class="bg-[#D90E0E] px-4 py-2 rounded-md" @click="deleteAllowed(admin.id)">O'chirish</button>
      </li>
    </ul>
  </div>
</template>

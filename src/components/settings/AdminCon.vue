<template>
  <div>
    <ul>
      <li class="flex mb-2 items-center justify-between bg-[#223B9E] p-4 rounded-md">
        <div class="flex gap-4">
          <h1>Adminlar ro'yxatini ko'rish uchun ruxsat</h1>
        </div>
        <div class="flex gap-2">
          <h1>On</h1>
          <label class="switch">
            <input type="checkbox" :checked="data.admins" @change="() => togglePermission('admins')">
            <span class="slider round"></span>
          </label>
          <h1>Off</h1>
        </div>
      </li>
      <li class="flex mb-2 items-center justify-between bg-[#223B9E] p-4 rounded-md">
        <div class="flex gap-4">
          <h1>Yuristlar ro'yxatini ko'rish uchun ruxsat</h1>
        </div>
        <div class="flex gap-2">
          <h1>On</h1>
          <label class="switch">
            <input type="checkbox" :checked="data.yurists" @change="() => togglePermission('yurists')">
            <span class="slider round"></span>
          </label>
          <h1>Off</h1>
        </div>
      </li>
      <li class="flex mb-2 items-center justify-between bg-[#223B9E] p-4 rounded-md">
        <div class="flex gap-4">
          <h1>Mudirlar ro'yxatini ko'rish uchun ruxsat</h1>
        </div>
        <div class="flex gap-2">
          <h1>On</h1>
          <label class="switch">
            <input type="checkbox" :checked="data.call_centres" @change="() => togglePermission('call_centres')">
            <span class="slider round"></span>
          </label>
          <h1>Off</h1>
        </div>
      </li>
      <li class="flex mb-2 items-center justify-between bg-[#223B9E] p-4 rounded-md">
        <div class="flex gap-4">
          <h1>Filelar ro'yxatini ko'rish uchun ruxsat</h1>
        </div>
        <div class="flex gap-2">
          <h1>On</h1>
          <label class="switch">
            <input type="checkbox" :checked="data.userFiles" @change="() => togglePermission('userFiles')">
            <span class="slider round"></span>
          </label>
          <h1>Off</h1>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { URL } from "@/auth/url.js";

const route = useRoute();
const id = route.params.id;
const newId = parseInt(id);

const data = ref({
  admins: false,
  yurists: false,
  call_centres: false,
  userFiles: false
});

const fetchPermissions = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${URL}/permissions/user/${newId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.length > 0) {
      data.value = response.data[0];
    } else {
      data.value = { admins: false, yurists: false, call_centres: false, userFiles: false };
    }
  } catch (error) {
    console.error('Failed to fetch permissions:', error);
  }
};

const togglePermission = async (permission) => {
  try {
    const updatedValue = !data.value[permission];

    const response = await axios.put(`${URL}/permissions/${newId}`,
      { [permission]: updatedValue },
      { headers: { Authorization: ` Bearer ${localStorage.getItem("token")}` } }
    );

    if (response.status === 200) {
      data.value[permission] = updatedValue;
    }
  } catch (error) {
    console.error(`Failed to update ${permission}:`, error);
  }
};

onMounted(fetchPermissions);
</script>

<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 34px;
  height: 20px;
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
  height: 14px;
  width: 14px;
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
  transform: translateX(14px);
}
</style>
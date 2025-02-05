<template>
  <div class="min-h-screen flex flex-col items-center p-4">
    <div v-if="qwe" class="fixed z-10 inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg w-11/12 max-w-md">
        <img @click="qwe = false" class="w-6 cursor-pointer absolute top-4 right-4"
             src="../../../public/reject.png" alt="Close" />
        <h2 class="text-xl font-semibold mb-4">Yangi Admin qo‘shish</h2>
        <input v-model="name" class="w-full text-black p-2 mb-3 border rounded-lg" placeholder="Ism" />
        <input v-model="surname" class="w-full text-black p-2 mb-3 border rounded-lg" placeholder="Familiya" />
        <input v-model="fatherName" class="w-full text-black p-2 mb-3 border rounded-lg"
               placeholder="Otasining Ismi" />
        <input v-model="username" class="w-full text-black p-2 mb-3 border rounded-lg" placeholder="Username" />
        <input v-model="passport" class="w-full text-black p-2 mb-3 border rounded-lg"
               placeholder="Passport Seriya Raqami" />
        <input v-model="jshhr" class="w-full text-black p-2 mb-3 border rounded-lg" placeholder="JSHHR" />
        <input v-model="phone" class="w-full text-black p-2 mb-3 border rounded-lg"
               placeholder="Telefon Raqami" />
        <input v-model="password1" type="password" class="w-full text-black p-2 mb-3 border rounded-lg"
               placeholder="Parol" />
        <input v-model="password2" type="password" class="w-full text-black p-2 mb-3 border rounded-lg"
               placeholder="Parolni takrorlang" />

        <!-- Image Upload Field -->
        <input type="file" @change="handleImageUpload" class="w-full text-black p-2 mb-3 border rounded-lg" />

        <p class="text-red-600 text-sm">{{ err }}</p>
        <button @click="post"
                class="bg-green-600 text-white px-4 py-2 rounded-lg mt-3 w-full hover:bg-green-800 transition">
          ✅ Yuborish
        </button>
      </div>
    </div>

    <div v-if="PutModal" class="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg w-11/12 max-w-md">
        <img @click="PutModal = false" class="w-6 cursor-pointer absolute top-4 right-4"
             src="../../../public/reject.png" alt="Close" />
        <h2 class="text-xl font-semibold mb-4">Adminni yangilash</h2>
        <input v-model="updatedName" class="w-full p-2 mb-3 border text-black rounded-lg"
               placeholder="ism" />
        <input v-model="updatedSurname" class="w-full p-2 mb-3 border text-black rounded-lg"
               placeholder="familiya" />
        <input v-model="updatedFatherName" class="w-full p-2 mb-3 border text-black rounded-lg"
               placeholder="otasining ismi" />
        <input v-model="updatedUsername" class="w-full p-2 mb-3 border text-black rounded-lg"
               placeholder="username" />
        <input v-model="updatedPassport" class="w-full p-2 mb-3 border text-black rounded-lg"
               placeholder="passport seriya raqami" />
        <input v-model="updatedJshhr" class="w-full p-2 mb-3 border text-black rounded-lg"
               placeholder="JSHHR" />
        <input v-model="updatedPhone" class="w-full p-2 mb-3 border text-black rounded-lg"
               placeholder="telefon raqami" />

        <!-- Image Upload Field for Edit -->
        <input type="file" @change="handleImageUploadUpdate"
               class="w-full text-black p-2 mb-3 border rounded-lg" />
        <button @click="updateAdmin"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg mt-3 w-full hover:bg-blue-800 transition">
          🔄 Yangilash
        </button>
      </div>
    </div><!-- Delete Modal -->
    <div v-if="asd" class="fixed inset-0 flex items-center z-10 justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg w-11/12 max-w-sm text-center">
        <h2 class="text-lg font-semibold">Haqiqatan ham o‘chirishni xohlaysizmi?</h2>
        <div class="flex justify-center items-center gap-4 mt-4">
          <button @click="removeAdmin"
                  class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition">
            ❌ O'chirish
          </button>
          <button @click="asd = false" class="bg-gray-400 px-4 py-2 rounded-lg hover:bg-gray-600 transition">
            Bekor qilish
          </button>
        </div>
      </div>
    </div>

    <div class="flex justify-end w-full max-w-4xl">
      <button @click="qwe = true"
              class="bg-blue-600 hover:bg-blue-800 text-white px-6 py-2 rounded-full text-lg transition">
        ➕ Admin yaratish
      </button>
    </div>

    <!-- Admin List -->
    <div class="w-full max-w-4xl mt-8">
      <div v-for="item in data" @click="path(item.id)" :key="item.id"
           class="relative flex flex-col md:flex-row items-center justify-between p-4 bg-white shadow-md mb-4 rounded-lg border border-gray-200">
        <div class="w-16 h-16 flex-shrink-0 rounded-full overflow-hidden border border-gray-300">
          <img :src="getImageUrl(item.img)" class="w-full  h-full object-cover" alt="Admin Image" />
        </div>

        <div class="ml-4 flex-grow">
          <h1 class="text-lg font-semibold text-gray-700">Ism: {{ item.name }}</h1>
          <h1 class="text-lg text-gray-500">Username: {{ item.username }}</h1>
          <h1 class="text-sm text-gray-500">Role: {{ item.role }}</h1>
        </div>

        <div class="relative">
          <button @click="toggleModal(item.id)"
                  class="text-gray-500 bg-red-500 z-30  hover:text-gray-700 text-2xl p-2">
            ⋮
          </button>

          <div v-if="modalOpen === item.id"
               class="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border border-gray-200 z-10">
            <button @click="openEditModal(item)"
                    class="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100">
              ✏️ Tahrirlash
            </button>
            <button @click="openDeleteModal(item.id)"
                    class="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-100">
              🗑 O'chirish
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed} from "vue";
import axios from "axios";
import Header from "../components/header.vue";
import Time from "@/components/time/time.vue";
import {URL} from "@/auth/url";
import router from "@/router/index.js";
const path =(id)=>{
  // router.push(`/profile/${id}`)
}
const modalOpen = ref(null); // Modal ochiq bo'lgan adminni
const data = ref([]);
const qwe = ref(false);
const PutModal = ref(false);
const asd = ref(false);
const name = ref("");
const surname = ref("");
const fatherName = ref("");
const username = ref("");
const passport = ref("");
const jshhr = ref("");
const phone = ref("");
const password1 = ref("");
const password2 = ref("");
const image = ref(null);
const updatedName = ref("");
const updatedSurname = ref("");
const updatedFatherName = ref("");
const updatedUsername = ref("");
const updatedPassport = ref("");
const updatedJshhr = ref("");
const updatedPhone = ref("");
const updatedImage = ref(null);
const selectedId = ref(null);
const err = ref("");

// Modalni ochish/yopish
const toggleModal = (id) => {
  modalOpen.value = modalOpen.value === id ? null : id;
};

const openEditModal = (item) => {
  selectedId.value = item.id;
  updatedName.value = item.name;
  updatedSurname.value = item.surname;
  updatedFatherName.value = item.dadname;
  updatedUsername.value = item.username;
  updatedPassport.value = item.userCode;
  updatedJshhr.value = item.uniqueCode;
  updatedPhone.value = item.phone;
  PutModal.value = true;
};const openDeleteModal = (id) => {
  selectedId.value = id;
  asd.value = true;
};

const getData = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${URL}/admin`, {
    headers: {Authorization:` Bearer ${token}`},
  });
    console.log(response.data);
  data.value = response.data.sort((a, b) => a.id - b.id);
} catch (error) {
  console.error("Xatolik:", error);
}
};

const sortedData = computed(() => data.value);

async function post() {
  if (password1.value !== password2.value) {
    err.value = "Parollar bir xil emas!";
    return;
  }

  const formData = new FormData();
  formData.append("name", name.value);
  formData.append("surname", surname.value);
  formData.append("dadname", fatherName.value);
  formData.append("username", username.value);
  formData.append("userCode", passport.value);
  formData.append("uniqueCode", jshhr.value);
  formData.append("phone", phone.value);
  formData.append("password", password2.value);
  if (image.value) formData.append("image", image.value);

  try {
    const token = localStorage.getItem("token");
    await axios.post(`${URL}/admin`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  getData();
  qwe.value = false;
} catch (error) {
  console.error("Xatolik:", error);
  err.value = "Admin yaratishda xatolik!";
}
}

async function updateAdmin() {
  const formData = new FormData();
  formData.append("name", updatedName.value);
  formData.append("surname", updatedSurname.value);
  formData.append("dadname", updatedFatherName.value);
  formData.append("username", updatedUsername.value);
  formData.append("userCode", updatedPassport.value);
  formData.append("uniqueCode", updatedJshhr.value);
  formData.append("phone", updatedPhone.value);
  if (updatedImage.value) formData.append("image", updatedImage.value);

  try {
    const token = localStorage.getItem("token");
    await axios.put(`${URL}/admin/${selectedId.value}`, formData, {
      headers: {
        Authorization:` Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    getData();
    PutModal.value = false;
  } catch (error) {
    err.value = error.response?.data?.message || "Yangilashda xatolik!";
    console.error("Xatolik:", error);
  }
}


async function removeAdmin() {
  const token = localStorage.getItem("token");
  await axios.delete(`${URL}/admin/${selectedId.value}`, {
    headers: {
      Authorization:` Bearer ${token}`,
    },
  });
  getData();
  asd.value = false;
}

function handleImageUpload(event) {
  image.value = event.target.files[0];
}

function handleImageUploadUpdate(event) {
  updatedImage.value = event.target.files[0];
}

const getImageUrl = (img) => {
  return img ?` ${URL}/upload/${img}` : "/default-avatar.png";
};

getData();
</script>
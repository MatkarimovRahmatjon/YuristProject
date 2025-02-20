<template>
  <div v-if="isUploadModalOpen" class="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="absolute bg-black flex flex-col opacity-90 items-center justify-center p-10 px-16 rounded-lg">
      <h1 class="text-center text-xl text-white">Fayl yuklash</h1>
      <input type="text" class="text-black w-full p-2 rounded-lg my-5" placeholder="Fayl nomi" v-model="selectedName"/>
      <label for="fileInput" class="cursor-pointer text-white bg-gray-700 px-4 py-2 rounded-md">Fayl tanlash</label>
      <input type="file" id="fileInput" @change="handleFileChange" class="hidden"/>
      <div class="mt-4">
        <button @click="closeUploadModal" class="bg-red-500 text-white px-6 py-2 rounded-lg mr-3">Bekor qilish</button>
        <button @click="uploadFile" class="bg-blue-500 text-white px-6 py-2 rounded-lg">Yuklash</button>
      </div>
    </div>
  </div>

  <div v-if="isDeleteModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="absolute bg-black flex flex-col opacity-90 items-center justify-center p-10 rounded-lg">
      <h2 class="text-white text-lg mb-4">O'chirmoqchimisiz?</h2>
      <div class="flex justify-center">
        <button @click="removeSelectedItem" class="bg-green-500 text-white px-6 py-2 rounded-lg mr-3">O'chirish</button>
        <button @click="closeDeleteModal" class="bg-red-500 text-white px-6 py-2 rounded-lg">Bekor qilish</button>
      </div>
    </div>
  </div>
  <div class="flex mr-[315px] justify-center items-center">
    <h1
        style="text-shadow: 0 0 5px #fff,0 0 10px #fff;"
        class="text-black text-[40px] font-bold text-center bg-lime-500 border-[3px] border-black rounded-lg py-2 px-[100px]">Hodim Majburiyatlari</h1>
  </div>

  <div class="flex absolute right-[21rem] top-[275px] justify-end p-4">
    <button style="text-shadow: 0 0 5px #fff,0 0 10px #fff;" @click="openUploadModal" class="text-xl px-6 py-2 rounded-lg bg-lime-600 text-black">Fileni tizimga yuklash</button>
  </div>

  <div class="flex flex-col items-center mt-6">
    <div class="p-6 rounded-lg border-gray-50 shadow-lg w-[95%]">
      <div v-for="(item, index) in files" :key="item.id"
           :class="[index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200', 'flex items-center border justify-between p-2 mb-2 hover:bg-lime-600 transition']">
        <div class="flex items-center b cursor-pointer" @click="goToFile(item.id)">
          <span class="text-black font-semibold mr-2">{{ index + 1 }}</span>
          <span class="text-black">{{ item.name }}</span>
        </div>
        <div class="flex">
          <button class="bg-blue-500 px-4 py-2 rounded-lg text-white mr-2" @click="downloadFile(item)">Yuklab olish
          </button>
          <button class="bg-red-500 px-4 py-2 rounded-lg text-white" @click="openDeleteModal(item.id)">O'chirish
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from "vue";
import {useRouter} from "vue-router";
import axios from "axios";
import {URL} from "../../../auth/url";

const files = ref([]);
const selectedFile = ref(null);
const selectedName = ref("");
const isUploadModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const deleteItemId = ref(null);
const router = useRouter();
const userId = ref(localStorage.getItem("id") ? parseInt(localStorage.getItem("id")) : null);

const goToFile = (id) => {
  router.push(`/UserFilePage/${id}`);
};

const getFiles = async () => {
  if (!userId.value) return;
  try {
    const response = await axios.get(`${URL}/userFiles/${userId.value}`);
    files.value = response.data.userFiles.filter(file => file.type === "obligations");
  } catch (error) {
    console.error("Xatolik yuz berdi:", error);
  }
};

const downloadFile = async (file) => {
  try {
    const response = await axios({
      url: `${URL}/userFiles/download/${file.id}`,
      method: "GET",
      responseType: "blob", // Blob formatida olish
    });

    // Fayl turi uchun avtomatik MIME olish
    const fileType = response.headers["content-type"];
    const blob = new Blob([response.data], {type: fileType});

    // Faylni yuklash
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", file.name || file - `${file.id}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Faylni yuklashda xatolik:", error);
    alert("Faylni yuklashda xatolik yuz berdi!");
  }
};
onMounted(() => {
  getFiles();
});

const handleFileChange = (event) => {
  if (event.target.files.length) {
    selectedFile.value = event.target.files[0];
  }
};

const uploadFile = async () => {
  if (!selectedFile.value) {
    alert("Fayl tanlanmagan!");
    return;
  }

  const formData = new FormData();
  formData.append("file", selectedFile.value);
  formData.append("name", selectedName.value);
  formData.append("userId", userId.value);
  formData.append("type", "obligations");

  try {
    const response = await axios.post(`${URL}/userFiles`, formData, {
      headers: {"Content-Type": "multipart/form-data"},
    });
    if (response.status === 201) {
      closeUploadModal();
      getFiles();
    }
  } catch (error) {
    console.error("Fayl yuklashda xatolik:", error);
    alert("Server bilan bog‘lanishda xatolik yuz berdi!");
  }
};

const openUploadModal = () => {
  isUploadModalOpen.value = true;
};

const closeUploadModal = () => {
  isUploadModalOpen.value = false;
  selectedFile.value = null;
  selectedName.value = "";
};

const openDeleteModal = (id) => {
  deleteItemId.value = id;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
};

const removeSelectedItem = async () => {
  try {
    await axios.delete(`${URL}/userFiles/${deleteItemId.value}`);
    closeDeleteModal();
    getFiles();
  } catch (error) {
    console.error("Xatolik:", error);
    alert("O'chirishda xatolik yuz berdi!");
  }
};
</script>
<template>
  <div class="edit-page">
    <h1 class="text-[25px] text-center mb-6">ID: {{ id }}</h1>
    <div v-if="htmlContent" v-html="htmlContent" class="text-black"></div>
    <div v-else class="text-center mt-10">
      <p class="text-red-500">Faylni olishda xatolik yuz berdi!</p>
    </div>
    <div class="text-center mt-6">
      <button @click="goBack" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Orqaga
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import mammoth from "mammoth";
import { URL } from "../../../auth/url.js";

const route = useRoute();
const router = useRouter();
const id = ref(route.params.id);
const htmlContent = ref("");

const fetchWordFile = async () => {
  try {
    const response = await fetch(`${URL}/files/${id.value}`);
    if (!response.ok) throw new Error(`HTTP xato! Status: ${response.status}`);

    const resData = await response.json();
    const fileResponse = await fetch(`${URL}/uploads${resData.filePath}`);
    if (!fileResponse.ok)
      throw new Error(`HTTP xato! Status: ${fileResponse.status}`);

    const arrayBuffer = await fileResponse.arrayBuffer(); // ArrayBuffer'ga o'zgartiring

    const result = await mammoth.convertToHtml({ arrayBuffer }); // Faylni HTML'ga tahlil qilish
    htmlContent.value = result.value; // Tahlil qilingan HTML'ni saqlash
  } catch (error) {
    console.error("Faylni olishda xatolik yuz berdi:", error.message);
    htmlContent.value =
      "<p class='text-red-500'>Faylni olishda xatolik yuz berdi!</p>";
  }
};
const goBack = () => {
  router.push("/"); // Asosiy sahifaga qaytish
};
onMounted(() => {
  fetchWordFile();
});
</script>

<style scoped>
.edit-page {
  margin: 2rem auto;
  max-width: 800px;
  padding: 1rem;
  border-radius: 10px;
  font-family: Arial, sans-serif;
}

.word-content {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f4f4f4;
  font-family: Arial, sans-serif;
  line-height: 1.6;
}

button:hover {
  transition: background-color 0.2s ease-in-out;
}
</style>
<script setup>
import { ref, onMounted, inject } from 'vue';
import axios from "axios";
import { URL } from '@/auth/url';

const file = ref(null);
const uploadSuccess = ref(null);
const uploadError = ref(null);
const smileys = ref([]);
const isUploadModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const selectedSmiley = ref(null);
const dat = inject('dat');

const handleFileChange = (event) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    file.value = selectedFile;
    uploadError.value = null;
  }
};
const translitMap = {
  "ch": "ч", "sh": "ш", "yo": "ё", "yu": "ю", "ya": "я", "ye": "е", "oʻ": "ў", "g‘": "ғ",
  "a": "а", "b": "б", "d": "д", "e": "э", "f": "ф", "g": "г", "h": "ҳ", "i": "и", "j": "ж",
  "k": "к", "l": "л", "m": "м", "n": "н", "o": "о", "p": "п", "q": "қ", "r": "р", "s": "с",
  "t": "т", "u": "у", "v": "в", "x": "х", "y": "й", "z": "з", "'": "ў"
};

const translateText = (text) => {
  let translated = text.toLowerCase();
  for (const key in translitMap) {
    const regex = new RegExp(key, "g");
    translated = translated.replace(regex, translitMap[key]);
  }
  return translated;
};

const uploadFile = async () => {
  if (!file.value) {
    uploadError.value = 'Iltimos, fayl tanlang!';
    return;
  }

  const formData = new FormData();
  formData.append('file', file.value);

  try {
    const response = await axios.post(`${URL}/smileys`, formData);
    if (response.status === 201 || 200) {
      uploadSuccess.value = 'Fayl muvaffaqiyatli yuklandi!';
      uploadError.value = null;
      file.value = null;
      fetchSmileys();
      closeUploadModal();
    } else {
      throw new Error('Yuklashda xatolik yuz berdi');
    }
  } catch (error) {
    uploadError.value = error.message;
    uploadSuccess.value = null;
  }
};

const fetchSmileys = async () => {
  try {
    const response = await axios.get(`${URL}/smileys`);
    smileys.value = response.data;
  } catch (error) {
    console.error('Smileylarni yuklashda xatolik:', error);
  }
};

const openUploadModal = () => {
  isUploadModalOpen.value = true;
};

const closeUploadModal = () => {
  isUploadModalOpen.value = false;
  uploadSuccess.value = null;
  uploadError.value = null;
};

const openDeleteModal = (smiley) => {
  selectedSmiley.value = smiley;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  selectedSmiley.value = null;
};

const deleteSmiley = async () => {
  if (!selectedSmiley.value) return;
  try {
    await axios.delete(`${URL}/smileys/${selectedSmiley.value.id}`);
    fetchSmileys();
    closeDeleteModal();
  } catch (error) {
    console.error('Smileyni o‘chirishda xatolik:', error);
  }
};

onMounted(fetchSmileys);
</script>

<template>
  <div
    class="p-6 max-w-3xl mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg text-white space-y-4">
    <h2 v-if="dat === 'datalotin'" class="text-2xl font-bold text-center">😊 Smile qo'shish</h2>
    <h3 v-if="dat === 'datakril'" class="text-2xl font-bold text-center">😊 {{ translateText('Smile qo\'shish') }}:</h3>

    <button v-if="dat === 'datakril'" @click="openUploadModal"
    class="w-full bg-white text-blue-500 px-4 py-2 z-50 rounded-lg mt-2 font-semibold hover:bg-gray-200 transition">
    {{ translateText('+ Yangi smiley qo\'shish') }}
  </button>
  <button v-if="dat === 'datalotin'" @click="openUploadModal"
  class="w-full bg-white text-blue-500 px-4 py-2 z-50 rounded-lg mt-2 font-semibold hover:bg-gray-200 transition">
  + Yangi smiley qo'shish
</button>

<div v-if="isUploadModalOpen"
class="fixed inset-0 z-50  -top-10 flex items-center justify-center bg-black bg-opacity-50">
<div class="bg-white p-6 rounded-lg shadow-xl w-96 text-gray-800">
  <h3 class="text-2xl font-semibold text-gray-700  mb-4">Fayl yuklash</h3>
  
  <input type="file" @change="handleFileChange"
  class="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg p-2" />
  
  <div class="flex justify-end space-x-2 mt-4">
    <button @click="closeUploadModal" class="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500">{{
      $t('Bekor_qilish') }}</button>
          <button @click="uploadFile" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">{{
            $t('yuklash') }}</button>
        </div>
        
        <p v-if="uploadSuccess" class="text-green-500 text-center font-medium mt-2">{{ uploadSuccess }}</p>
        <p v-if="uploadError" class="text-red-500 text-center font-medium mt-2">{{ uploadError }}</p>
      </div>
    </div>
    
    <div class="mt-6">
      <h3 v-if="dat === 'datalotin'" class="text-lg font-semibold mb-2">🎭 Yuklangan smiley'lar:</h3>
      <h3 v-if="dat === 'datakril'" class="text-lg font-semibold mb-2">🎭 {{ translateText('Yuklangan smiley\'lar') }}:</h3>
      <div v-if="smileys.length === 0" class="text-gray-300">Hozircha smiley yo‘q</div>
      <div v-else class="grid grid-cols-4 gap-4">
        <div v-for="smiley in smileys" :key="smiley.id" class="relative bg-white p-2 rounded-lg shadow-md">
          <img :src="`${URL}/${smiley.filePath}`" alt="Smile" class="rounded-lg">
          <img src="../../../public/reject.png" @click="openDeleteModal(smiley)"
            class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-6 shadow-md" />
        </div>
      </div>
    </div>
  </div>

  <div v-if="isDeleteModalOpen" class="fixed inset-0 flex items-center z-50 justify-center bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded-lg shadow-xl w-80 text-center text-gray-800">
      <div class="flex justify-center space-x-2">
        <button @click="closeDeleteModal" class="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500">{{
          $t('Bekor_qilish') }}</button>
        <button @click="deleteSmiley" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">{{
          $t('remove') }}</button>
      </div>
    </div>
  </div>
</template>
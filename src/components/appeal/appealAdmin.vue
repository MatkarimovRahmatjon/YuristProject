<template>
  <div class="text-white">
    <!-- Modal for Uploading -->
    <div v-if="showModal"
      class="fixed inset-0 top-0 z-30 w-full h-full flex items-center bg-black bg-opacity-50 justify-center">
      <div class="absolute w-96 bg-slate-500 flex flex-col opacity-90 items-center justify-center p-10 rounded-2xl">
        <img @click="toggleModal" class="w-14 -mr-[320px] absolute -mt-[270px]" src="../../../public/reject.png"
          alt="" />
        <form @submit.prevent="handleSubmit" class="flex flex-col gap-4 max-w-sm mx-auto">
          <div>
            <input v-model="courtName" class="text-black w-full outline-none p-3 mt-5 rounded-lg" type="text"
              placeholder="Bo'lim nomini kiriting" required />
          </div>
          <div>
            <input v-model="url" class="text-black w-full outline-none p-3 rounded-lg" type="text"
              placeholder="Link kiriting" required />
          </div>
          <div>
            <input @change="onFileChange" type="file" id="file" accept="image/*" required
              class="block w-full border border-gray-300 rounded-lg p-2.5" />
          </div>
          <button class="w-full rounded-full bg-lime-600 hover:bg-lime-900 text-lg text-white py-2"
            type="submit">Yuklash</button>
        </form>
        <p v-if="successMessage" class="text-green-500 mt-4">{{ successMessage }}</p>
        <p v-if="errorMessage" class="text-red-500 mt-4">{{ errorMessage }}</p>
      </div>
    </div>

    <!-- Modal for Edit/Delete -->
    <div v-if="asd" class="fixed inset-0 z-50 w-full h-full flex items-center bg-black bg-opacity-50 justify-center">
      <div class="absolute w-96 bg-[#D9D9D9] flex flex-col items-center justify-center p-10 rounded-[15px]">
        <img @click="func(null)" class="w-14 -mr-[300px] absolute -mt-44" src="../../../public/reject.png" alt="" />
        <div class="mt-4 flex flex-col justify-center items-center">
          <div class="flex flex-col justify-between h-40 items-center">
            <button @click="Modal"
              class="py-4 rounded-[15px] h-[70px] items-center text-black w-full min-w-[250px] flex duration-500 text-[20px] px-10 bg-[#15FF09] hover:bg-lime-600">
              <img class="w-8 mr-5" src="../../../public/pen.png" alt="">
              O’zgartirish
            </button>
            <button @click="removeSelectedItems"
              class="py-4 rounded-[15px] h-[70px] items-center text-black flex w-full min-w-[250px] duration-500 text-[20px] px-10 bg-[#FF0C0C] hover:bg-red-700">
              <img class="w-10 mr-5" src="../../../public/remove.png" alt="">
              O'chirish
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for Update -->
    <div v-if="PutModal"
      class="fixed inset-0 z-50 w-full h-full flex items-center bg-black bg-opacity-50 justify-center">
      <div class="absolute bg-slate-500 flex flex-col opacity-[90%] items-center justify-center p-10 rounded-[15px]">
        <img @click="Modal" class="w-10 top-2 right-2 absolute" src="../../../public/reject.png" alt="" />
        <div>
          <form @submit.prevent="updateCourt">
            <input v-model="courtName" class="text-black w-full outline-none p-3 mt-5 rounded-lg" type="text"
              placeholder="Bo'lim nomini kiriting" />
            <input v-model="url" class="text-black w-full outline-none p-3 my-3 rounded-lg" type="text"
              placeholder="Link kiriting" />
            <input @change="onFileChange" type="file" id="file" accept="image/*"
              class="block w-full border border-gray-300 rounded-lg p-2.5" />
            <button class="w-full mt-3 rounded-[30px] bg-lime-600 hover:bg-lime-900 text-[20px] py-2"
              type="submit">Yuklash</button>
          </form>
          <p v-if="successMessage" style="color: green">{{ successMessage }}</p>
          <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
        </div>
      </div>
    </div>
    <!-- Main Content -->
    <div class="flex flex-col items-center py-10">
      <div class="w-full flex justify-end px-6">
        <button @click="toggleModal" class="text-lg font-medium py-2 px-4 bg-lime-500 hover:bg-lime-600 rounded-lg">
          Add +
        </button>
      </div>
      <div class="flex flex-col items-center mt-6 px-4">
        <h1 class="text-2xl sm:text-4xl font-bold text-center text-blue-800 mb-6"
          style="text-shadow: 10px 10px  30px black;">
          {{ $t('interaktiv') }}
        </h1>
        <div class="w-full  bg-gray-200 rounded-lg p-6 sm:p-10">
          <b style="text-shadow: 10px 10px  30px black;"
            class="text-xl block font-extrabold sm:text-2xl text-blue-800 text-center mb-6">
            {{ $t('bolim') }}
          </b>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-if="dat === 'datakril'" v-for="item in datakril" :key="item.id"
              class="relative bg-white border-4 hover:bg-lime-500 duration-500 border-blue-800 rounded-lg p-6">
              <img @click.stop="func(item.id)" class="absolute top-2 right-2 w-6 h-6 cursor-pointer"
                src="../../../public/ellipsis.png" alt="Options" />
              <div class="flex items-center gap-4">
                <img v-if="item.img" :src="getImageUrl(item.img)" alt="Image" class="w-14 h-14 rounded-md" />
                <h3 class="text-lg font-medium text-center text-black">{{ item.translatedName }}</h3>
              </div>
            </div>
            <div v-if="dat === 'datalotin'" v-for="item in data" :key="item.id"
              class="relative bg-white border-4 hover:bg-lime-500 duration-500 border-blue-800 rounded-lg p-6">
              <img @click.stop="func(item.id)" class="absolute top-2 right-2 w-6 h-6 cursor-pointer"
                src="../../../public/ellipsis.png" alt="Options" />
              <div class="flex items-center gap-4">
                <img v-if="item.img" :src="getImageUrl(item.img)" alt="Image" class="w-14 h-14 rounded-md" />
                <h3 class="text-lg font-medium text-center text-black">{{ item.name }}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, ref, watch } from "vue";
import { URL } from "../../auth/url.js";
import axios from "axios";
const PutId = ref(null);
const PutModal = ref(false);
const showModal = ref(false);
const asd = ref(false);
const url = ref("");
const courtName = ref("");
const file = ref(null);
const successMessage = ref("");
const errorMessage = ref("");
const data = ref([]);
const imageBaseUrl = `${URL}/upload`;
const toggleModal = () => {
  showModal.value = !showModal.value;
};
const Modal = () => {
  PutModal.value = !PutModal.value;
  asd.value = !asd.value
};
const func = (id) => {
  PutId.value = id;
  asd.value = !asd.value;
};

const onFileChange = (event) => {
  file.value = event.target.files[0];
};

const handleSubmit = async () => {
  if (PutModal.value) {
    await updateCourt();
  } else {
    await uploadCourt();
  }
};

const uploadCourt = async () => {
  const formData = new FormData();
  formData.append("name", courtName.value);
  formData.append("file", file.value);
  formData.append("url", url.value);

  try {
    await axios.post(`${URL}/appeal`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    successMessage.value = "Appeal muvaffaqiyatli yuklandi!";
    errorMessage.value = "";
    courtName.value = "";
    file.value = null;
    getData();
    showModal.value = false;
  } catch (error) {
    errorMessage.value = "Xatolik yuz berdi!";
  }
};


const datakril = ref([]);
const dat = inject('dat');

const translitMap = {
  "ch": "ч", "sh": "ш", "yo": "ё", "yu": "ю", "ya": "я", "ye": "е", "oʻ": "ў", "g‘": "ғ",
  "a": "а", "b": "б", "d": "д", "e": "э", "f": "ф", "g": "г", "h": "ҳ", "i": "и", "j": "ж",
  "k": "к", "l": "л", "m": "м", "n": "н", "o": "о", "p": "п", "q": "қ", "r": "р", "s": "с",
  "t": "т", "u": "у", "v": "в", "x": "х", "y": "й", "z": "з", "'": "ъ"
};

const translateText = (text) => {
  let translated = text.toLowerCase();
  for (const key in translitMap) {
    const regex = new RegExp(key, "g");
    translated = translated.replace(regex, translitMap[key]);
  }
  return translated;
};

const getData = async () => {
  try {
    const response = await fetch(`${URL}/appeal`);
    if (response.ok) {
      const result = await response.json();
      datakril.value = result
      .filter(item => item.statu=='active')
        .sort((a, b) => a.id - b.id)
        .map(item => ({
          ...item,
          translatedName: translateText(item.name) 
        }));
        data.value = result
        .filter(item => item.statu=='active')
        .sort((a, b) => a.id - b.id)
        ;
    } else {
      console.error("Ma'lumotlarni olishda xatolik:", response.statusText);
    }
  } catch (error) {
    console.error("Xatolik:", error);
  }
};

const updateCourt = async () => {
  const formData = new FormData();
  formData.append("name", courtName.value);
  formData.append("file", file.value);
  formData.append("url", url.value);

  try {
    const response = await axios.put(`${URL}/appeal/${PutId.value}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.status === 200) {
      const updatedCourt = response.data;
      const index = data.value.findIndex((item) => item.id === PutId.value);
      if (index !== -1) {
        data.value[index] = updatedCourt;
      }

      successMessage.value = "Court muvaffaqiyatli yangilandi!";
      courtName.value = "";
      file.value = null;
      PutModal.value = false;
    }
  } catch (error) {
    errorMessage.value = "Xatolik yuz berdi: " + error.message;
  }
};

const removeSelectedItems = async () => {
  if (!PutId.value) return;

  try {
    const response = await fetch(`${URL}/appeal/${PutId.value}`, { method: "DELETE" });

    if (response.ok) {
      asd.value = false;
      await getData();
    } else {
      console.error("O'chirishda xatolik:", response.statusText);
    }
  } catch (error) {
    console.error("Xatolik:", error);
  }
};

watch([showModal, PutModal, asd], ([modalOpen, putModalOpen, deleteModalOpen]) => {
  if (modalOpen || putModalOpen || deleteModalOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});
const goToPath = (id) => {
  window.open(id)
};


const getImageUrl = (filename) => `${imageBaseUrl}/${filename}`;
getData();
</script>

<style scoped>
/* Add any custom styles for your modal here */
</style>

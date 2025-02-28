<template>
  <div v-if="showModal" class="fixed inset-0 z-50  h-full flex items-center bg-black bg-opacity-50 justify-center">
    <div class=" bg-slate-800 flex flex-col opacity-[90%] items-center justify-center p-10 rounded-[15px]">
      <img @click="toggleModal" class="w-14 -mr-[290px] absolute -mt-44" src="../../../public/reject.png" alt="" />
      <Upload />
    </div>
  </div>
  <div v-if="PutModal" class="fixed inset-0 z-50 w-full h-full flex items-center bg-black bg-opacity-50 justify-center">
    <div class="absolute  bg-slate-800 flex flex-col opacity-[90%] items-center justify-center p-10 rounded-[15px]">
      <img @click="Modal" class="w-14 -mr-[290px] absolute -mt-44" src="../../../public/reject.png" alt="" />
      <div>
        <form @submit.prevent="updateCourt">
          <div>
            <input v-model="courtName" class="text-black w-full outline-none p-3 mt-9 rounded-[15px]" type="text"
              id="name" required />
          </div>
          <div>
            <input @change="onFileChange" type="file" id="file" accept="image/*" />
          </div>
          <button class="w-full rounded-[30px] bg-lime-600 hover:bg-lime-900 text-[20px] py-2" type="submit">
            Yuklash
          </button>
        </form>
        <p v-if="successMessage" style="color: green">{{ successMessage }}</p>
        <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
  <div v-if="asd" class="fixed inset-0 z-50 w-full h-full flex items-center bg-black bg-opacity-50 justify-center">
    <div class="absolute w-96 bg-[#D9D9D9] flex flex-col items-center justify-center p-10 rounded-[15px]">
      <img @click="func(null)" class="w-10 m-2 absolute top-0 right-0" src="../../../public/reject.png" alt="" />
      <div class="mt-4 flex flex-col justify-center items-center">
        <div class="flex flex-col justify-between gap-2 items-center">
          <button @click="Modal"
            class="py-4 rounded-[15px] h-[70px] items-center text-black w-full min-w-[250px] flex duration-500 text-[20px] px-10 bg-[#15FF09] hover:lime-600">
            <img class="w-8 mr-5" src="../../../public/pen.png" alt="">
            O’zgartirish
          </button>
          <button @click="removeSelectedItems"
            class="py-4 rounded-[15px] h-[70px] items-center text-black flex w-full min-w-[250px] duration-500 text-[20px] px-10 bg-[#FF0C0C] hover:red-700">
            <img class="w-10 mr-5" src="../../../public/remove.png" alt="">
            O'chirish
          </button>

          <button @click="push"
            class="py-4 rounded-[15px] h-[70px] items-center text-black flex w-full min-w-[250px] duration-500 text-[20px] px-10 bg-gray-400 hover:red-700">
            <img class="w-10 mr-5" src="../../../public/settings3.png" alt="">
            setting
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="flex flex-col text-white items-center py-10">
    <div class="w-full flex justify-end px-6">
      <button @click="toggleModal" class="text-lg font-medium py-2 px-4 bg-lime-500 hover:bg-lime-600  rounded-lg">
        Add +
      </button>
    </div>
    <div class="flex flex-col items-center mt-6 px-4">
      <h1 class="text-2xl sm:text-4xl font-bold text-center text-blue-800 mb-6"
        style="text-shadow: 10px 10px  30px black;">
        {{ $t('murojaat') }}
      </h1>
      <div class="w-full  bg-gray-200 rounded-lg p-6 sm:p-10">
        <b style="text-shadow: 10px 10px  30px black;"
          class="text-xl sm:text-2xl block  font-extrabold text-blue-800 text-center mb-6">
          {{ $t('sud') }}
        </b>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-if="dat === 'datakril'" v-for="item in datakril" :key="item.id" @click="goToPath(item.id)"
            class="relative hover:bg-lime-500 duration-500 bg-white border-4 border-blue-800 rounded-lg p-6">
            <img @click.stop="func(item.id)" class="absolute top-2 right-2 w-6 h-6 cursor-pointer"
              src="../../../public/ellipsis.png" alt="Options" />
            <div class="flex items-center gap-4">
              <img v-if="item.img" :src="getImageUrl(item.img)" alt="Image" class="w-14 h-14 rounded-md" />
              <h3 class="text-lg font-medium text-center text-black capitalize">{{ item.translatedName }}</h3>
            </div>
          </div>
          <div v-if="dat === 'datalotin'" v-for="item in data" :key="item.id" @click="goToPath(item.id)"
            class="relative hover:bg-lime-500 duration-500 bg-white border-4 border-blue-800 rounded-lg p-6">
            <img @click.stop="func(item.id)" class="absolute top-2 right-2 w-6 h-6 cursor-pointer"
              src="../../../public/ellipsis.png" alt="Options" />
            <div class="flex items-center gap-4">
              <img v-if="item.img" :src="getImageUrl(item.img)" alt="Image" class="w-14 h-14 rounded-md" />
              <h3 class="text-lg font-medium text-center text-black capitalize">{{ item.name }}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, inject } from "vue";
import { watch } from "vue";
import { useRouter } from "vue-router";
import Upload from "./upload.vue";
import { URL } from "../../auth/url";
import axios from "axios";

const PutId = ref(0);
const router = useRouter();
const url = `${URL}/courts`;
const imageBaseUrl = `${URL}/upload`;
const showModal = ref(false);
const PutModal = ref(false);
const asd = ref(false);
const selectedId = ref(null);
const toggleModal = () => {
  showModal.value = !showModal.value;
};

const id = localStorage.getItem("id")
const adminId = parseInt(id)

const Modal = () => {
  PutModal.value = !PutModal.value;
  
  asd.value = !asd.value
};
function push() {
  router.push(`/setting/${selectedId.value}`);
}
const func = async (id) => {
  selectedId.value = id;
  PutId.value = id;
  asd.value = !asd.value;
  try {
    const response = await axios.get(`${URL}/courts/${id}`);
    if (response.status === 200) {
      courtName.value = response.data.name;
    }
  } catch (error) {
    console.error("Xatolik:", error);
  }
};
const data = ref([]);
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
    const response = await fetch(url);
    if (!response.ok) throw new Error(response.statusText);

    const result = await response.json();
    const filteredData = result
      .filter(item => item.status=='active')
      .sort((a, b) => a.id - b.id);

    datakril.value = filteredData.map(item => ({
      ...item,
      translatedName: translateText(item.name),
    }));

    data.value = filteredData;
  } catch (error) {
    console.error("Xatolik:", error);
  }
};

const removeSelectedItems = async () => {
  if (!selectedId.value) return;
  try {
    const response = await fetch(`${url}/${selectedId.value}`, {
      method: "DELETE",
    });
    if (response.ok) {
      data.value = data.value.filter((item) => item.id !== selectedId.value);
      asd.value = false;
    } else {
      console.error("O'chirishda xatolik:", response.statusText);
    }
  } catch (error) {
    console.error("Xatolik:", error);
  }
};
const getImageUrl = (filename) => `${imageBaseUrl}/${filename}`;
const goToPath = (id) => {
  router.push(`/AdminPath/${id}`);
};

const courtName = ref("");
const file = ref(null);
const successMessage = ref("");
const errorMessage = ref("");
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
  try {
    const response = await axios.post(`${URL}/courts`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.status === 201) {
      data.value.push(response.data); 
      successMessage.value = "Court muvaffaqiyatli yuklandi!";
      errorMessage.value = "";
      courtName.value = "";
      file.value = null;
      showModal.value = false;
    }
  } catch (error) {
    errorMessage.value = "Xatolik yuz berdi: " + error.message;
  }
};
const updateCourt = async () => {
  const formData = new FormData();
  formData.append("name", courtName.value);
  formData.append("file", file.value);

  try {
    const response = await axios.patch(`${URL}/courts/${PutId.value}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
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
watch([showModal, PutModal, asd], ([modalOpen, asdOpen, deleteModalOpen]) => {

  if (modalOpen || deleteModalOpen || asdOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});
onMounted(() => {
  getData();
});
</script>

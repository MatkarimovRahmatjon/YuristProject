<template>
  <div>
    <!-- Upload Form -->
    <div v-if="showModal"
      class="fixed z-30 top-0 inset-0 w-full h-full flex items-center bg-black bg-opacity-50 justify-center">
      <img @click="toggleModal" class="w-10 -mt-[220px] -mr-[325px] absolute z-10" src="../../../public/reject.png"
        alt="" />
      <div class="absolute  w-96 bg-slate-500 flex flex-col opacity-90 items-center justify-center p-10 rounded-lg">
        <form @submit.prevent="uploadCourt" class="flex flex-col gap-4 max-w-sm mx-auto">
          <div>
            <input v-model="courtName" class="text-black w-full mt-5 outline-none p-3 rounded-lg" type="text" id="name"
              placeholder="Bo'lim nomini kiriting" required />
          </div>
          <div>
            <input @change="onFileChange" type="file" id="file" accept="image/*" required
              class="block w-full border border-gray-300 rounded-lg p-2.5" />
          </div>
          <button class="w-full rounded-full bg-lime-600 hover:bg-lime-900 text-lg text-white py-2" type="submit">
            Yuklash
          </button>
        </form>
        <p v-if="successMessage" class="text-green-500 mt-4">{{ successMessage }}</p>
        <p v-if="errorMessage" class="text-red-500 mt-4">{{ errorMessage }}</p>
      </div>
    </div>
    <div class="w-full flex justify-end px-6">
      <button @click="toggleModal" class="text-lg font-medium py-2 px-4 bg-lime-500 hover:bg-lime-600 rounded-lg">
        Add +
      </button>
    </div>
    <!-- Display Uploaded Items -->
    <div class="w-full flex flex-col justify-center items-center mt-10">
      <div class="rounded-2xl w-full max-w-[110rem] p-10 mb-16 bg-gray-200">
        <div class="flex justify-center">
          <b class="mb-10 block text-center text-[30px] sm:[35px] md:text-[40px] uppercase text-[#223B9E]">{{
            $t('hamkor') }}</b>
        </div>
        <div class="my-16 flex justify-center flex-wrap gap-16">
          <!-- Kirillcha ma'lumotlar -->
          <div v-if="dat === 'datakril'" v-for="item in datakril" :key="item.id"
            class="bg-white border-[#223B9E] border-[5px] break-words w-96 h-96 rounded-xl hover:-translate-y-3 duration-500 hover:shadow-[0px_0px_50px_5px_rgba(255,255,255,1)] p-6">
            <div class="">
              <div class="mb-5 flex justify-center mt-3">
                <img v-if="item.img" :src="getImageUrl(item.img)" alt="Image" class="w-[150px]" />
              </div>
              <!-- Tarjima qilingan nomni ko'rsatish -->
              <h3 class="text-lg font-medium text-center text-black">{{ item.translatedName }}</h3>
            </div>
          </div>
          <div v-if="dat === 'datalotin'" v-for="item in data" :key="item.id"
            class="bg-white border-[#223B9E] border-[5px] break-words w-96 h-96 rounded-xl hover:-translate-y-3 duration-500 hover:shadow-[0px_0px_50px_5px_rgba(255,255,255,1)] p-6">
            <div class="flex justify-end -mr-3 -mt-4">
              <span @click.stop="func(item.id)" class="cursor-pointer w-6 h-6 flex items-center justify-center">
                <img width="20px" src="../../../public/ellipsis.png" alt="" />
              </span>
            </div>
            <div class="mb-5 flex justify-center mt-3">
              <img v-if="item.img" :src="getImageUrl(item.img)" alt="Image" class="w-[150px]" />
            </div>
            <!-- Tarjima qilingan nomni ko'rsatish -->
            <h3 class="text-lg font-medium text-center text-black">{{ item.name }}</h3>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div v-if="PutModal"
        class="fixed inset-0 z-50 w-full h-full flex items-center bg-black bg-opacity-50 justify-center">
        <div
          class="absolute h-64 w-96 bg-slate-800 flex flex-col opacity-[90%] items-center justify-center p-10 rounded-[15px]">
          <img @click="Modal" class="w-14 -mr-[290px] absolute -mt-44" src="../../../public/reject.png" alt="" />
          <div>
            <form @submit.prevent="updateCourt">
              <div>
                <input v-model="courtName" class="text-black w-full outline-none p-3 mt-9 rounded-[15px]" type="text"
                  id="name" required />
              </div>
              <div>
                <input @change="onFileChange" type="file" id="file" accept="image/*" required />
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
    </div>
  </div>
</template>

<script setup>
import { inject, ref, watch } from "vue";
import axios from "axios";
import { URL } from "../../auth/url";

const PutId = ref(null);
const PutModal = ref(false);
const data = ref([]);
const showModal = ref(false);
const courtName = ref("");
const file = ref(null);
const successMessage = ref("");
const errorMessage = ref("");
const asd = ref(false);
const Id = ref(null);
const imageBaseUrl = `${URL}/upload`;

const toggleModal = () => {
  showModal.value = !showModal.value;
};

const Modal = () => {
  PutModal.value = !PutModal.value;
  asd.value = !asd.value;
};

const func = (id) => {
  PutId.value = id;
  asd.value = !asd.value;

};

const onFileChange = (event) => {
  file.value = event.target.files[0];
};

const uploadCourt = async () => {
  const formData = new FormData();
  formData.append("name", courtName.value);
  formData.append("file", file.value);

  try {
    await axios.post(`${URL}/partners`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    successMessage.value = "Court muvaffaqiyatli yuklandi!";
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
    const response = await fetch(`${URL}/partners`);
    if (response.ok) {
      const result = await response.json();
      datakril.value = result
        .sort((a, b) => a.id - b.id)
        .map(item => ({
          ...item,
          translatedName: translateText(item.name) 
        }));
      data.value = result; di
    } else {
      console.error("Ma'lumotlarni olishda xatolik:", response.statusText);
    }
  } catch (error) {
    console.error("Xatolik:", error);
  }
};

const removeSelectedItems = async () => {
  if (!Id.value) return;

  try {
    const response = await fetch(`${URL}/partners/${Id.value}`, {
      method: "DELETE",
    });

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

const handleSubmit = async () => {
  if (PutModal.value) {
    await updateCourt();
  } else {
    await uploadCourt();
  }
};

const updateCourt = async () => {
  const formData = new FormData();
  formData.append("name", courtName.value);
  formData.append("file", file.value);

  try {
    const response = await axios.put(`${URL}/partners/${PutId.value}`, formData, {
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

const getImageUrl = (filename) => `${imageBaseUrl}/${filename}`;

watch([showModal, PutModal, asd], ([modalOpen, asdOpen, deleteModalOpen]) => {
  if (modalOpen || deleteModalOpen || asdOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

getData();
</script>


<style scoped></style>

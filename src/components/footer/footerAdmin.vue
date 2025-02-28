<template>
  <div>
    <div v-if="showModal"
      class="fixed z-30 top-0 w-full h-full flex items-center bg-black bg-opacity-50 justify-center">
      <img @click="toggleModal" class="w-10 -mt-[300px] -mr-[325px] absolute z-40 cursor-pointer"
        src="../../../public/reject.png" alt="Close" />
      <div class="absolute w-96 bg-slate-500 flex flex-col opacity-90 items-center justify-center p-10 rounded-lg">
        <form @submit.prevent="uploadCourt" class="flex flex-col gap-4 max-w-sm mx-auto">
          <div>
            <input v-model="courtName" class="text-black w-full mt-5 outline-none p-3 rounded-lg" type="text" id="name"
              placeholder="nomini kiriting" required />
          </div>
          <div>
            <input v-model="description" class="text-black w-full mt-5 outline-none p-3 rounded-lg" type="text"
              id="name" placeholder="ma'lumot kiriting" required />
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
            <button @click="removeSelectedItem"
              class="py-4 rounded-[15px] h-[70px] items-center text-black flex w-full min-w-[250px] duration-500 text-[20px] px-10 bg-[#FF0C0C] hover:bg-red-700">
              <img class="w-10 mr-5" src="../../../public/remove.png" alt="">
              O'chirish
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full flex text-white  justify-center flex-col p-10 items-center mt-10 bg-blue-700">
      <div class="my-16 flex items- justify-between xl:flex-row flex-col w-full">
        <div class="flex flex-col items-start">
          <button @click="toggleModal" id="add"
            class="mb-10 text-[25px] w-[100px] rounded-[25px] text-black duration-500 bg-lime-500 hover:bg-lime-600">
            Add +
          </button>
          <div v-for="item in data" :key="item.id"
            class="my-1 w-[330px] sm:w-[430px] md:w-[530px] border-[3px] rounded-xl p-[10px]">
            <div class="flex relative justify-end">
              <span @click.stop="func(item.id)" class="absolute top-0 right-0">
                <img width="20px" src="../../../public/ellipsis.png" alt="Options" />
              </span>
            </div>
            <div class="flex items-center">
              <img v-if="item.img" :src="getImageUrl(item.img)" alt="Image" class="w-[50px] h-auto rounded-md mr-5" />
              <div>
                <b>{{ item.name }}</b>
                <p>{{ item.desc }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-center my-10 items-center">
          <ul>
            <li class="mb-2"><a class="text-3xl" href="">offering</a></li>
            <li class="mb-2"><a class="text-3xl" href="">offering</a></li>
            <li class="mb-2"><a class="text-3xl" href="">offering</a></li>
            <li class="mb-2"><a class="text-3xl" href="">offering</a></li>
            <li class="mb-2"><a class="text-3xl" href="">offering</a></li>
            <li><a class="text-3xl" href="">offering</a></li>
          </ul>
        </div>
        <MapAdmin />
      </div>
      <div>
        <h1 class="lg:text-4xl sm:text-xl md:text-2xl text-center">
          Yurist consul consalting.uz sayti OAB sahifasida 2025-yil 15-fevral kuni O’zbekiston Respublikasi Prezidenti
          adminstratsiyasi huzuridagi axborot va ommaviy kommunikatsiyasi agentligidan No00 raqami bilan ro’yxatga
          olingan
          Materialdan foydalanilgan taqdirda Yurist consul consalting.uz saytiga havola qilish majburiydir
        </h1>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import axios from "axios";
import MapAdmin from "./mapAdmin.vue";
import { URL } from "../../auth/url";

const PutModal = ref(false);
const PutId = ref(null);
const data = ref([]);
const showModal = ref(false);
const asd = ref(false);
const courtName = ref("");
const description = ref("");
const file = ref(null);
const successMessage = ref("");
const errorMessage = ref("");
const selectedItemId = ref(null);

const toggleModal = () => {
  showModal.value = !showModal.value;
};

const Modal = () => {
  PutModal.value = !PutModal.value;
  asd.value = !asd.value;
};

const func = (id) => {
  PutId.value = id;
  selectedItemId.value = id;
  asd.value = !asd.value;
};

const onFileChange = (event) => {
  file.value = event.target.files[0];
};

const uploadCourt = async () => {
  const formData = new FormData();
  formData.append("name", courtName.value);
  formData.append("desc", description.value);
  formData.append("file", file.value);

  try {
    await axios.post(`${URL}/connection`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    successMessage.value = "Ma'lumot muvaffaqiyatli yuklandi!";
    courtName.value = "";
    description.value = "";
    file.value = null;
    fetchData();
    toggleModal();
  } catch {
    errorMessage.value = "Xatolik yuz berdi!";
  }
};

const fetchData = async () => {
  try {
    const response = await fetch(`${URL}/connection`);
    if (response.ok) {
      data.value = await response.json();
    } else {
      console.error("Ma'lumotlarni olishda xatolik:", response.statusText);
    }
  } catch (error) {
    console.error("Xatolik:", error);
  }
};

const removeSelectedItem = async () => {
  try {
    await fetch(`${URL}/connection/${selectedItemId.value}`, { method: "DELETE" });
    fetchData();
    toggleDeleteModal(null);
  } catch (error) {
    console.error("O'chirishda xatolik:", error);
  }
};

const updateCourt = async () => {
  const formData = new FormData();
  formData.append("name", courtName.value);
  formData.append("file", file.value);

  try {
    const response = await axios.put(`${URL}/connection/${PutId.value}`, formData, {
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

watch([showModal, PutModal, asd], ([modalOpen, asdOpen, deleteModalOpen]) => {
  if (modalOpen || deleteModalOpen || asdOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

const getImageUrl = (filename) => `${URL}/upload/${filename}`;
fetchData();
</script>
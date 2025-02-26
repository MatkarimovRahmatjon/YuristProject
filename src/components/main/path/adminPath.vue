<template>
  <!-- Add Modal -->
  <div v-if="showModal"
       class="fixed inset-0 z-50 w-full h-full flex items-center bg-black bg-opacity-50 justify-center">
    <div
        class="absolute h-auto  bg-slate-500 flex flex-col opacity-90 items-center justify-center p-6 sm:p-10 rounded-lg">
      <img @click="toggleModal" class="w-10 absolute top-4 right-4 cursor-pointer"
           src="../../../../public/reject.png" alt="Close" />
      <uploadpathadmin />
    </div>
  </div>

  <!-- Update Modal -->
  <div v-if="PutModal" class="fixed inset-0 z-50 w-full h-full flex items-center bg-black bg-opacity-50 justify-center">
    <div
        class="absolute h-auto bg-slate-800 flex flex-col opacity-90 items-center justify-center p-6 sm:p-10 rounded-lg">
      <img @click="Modal" class="w-10 absolute top-4 right-4 cursor-pointer" src="../../../../public/reject.png"
           alt="Close" />
      <form @submit.prevent="updateCourt" class="w-full">
        <input v-model="courtName" class="w-full text-black outline-none p-3 mt-6 rounded-lg" type="text" id="name"
               placeholder="Court Name" required />
        <input @change="onFileChange" type="file" id="file" accept="image/*" class="w-full mt-4" required />
        <button class="w-full mt-6 py-2 text-lg font-medium text-white bg-lime-600 rounded-lg hover:bg-lime-900"
                type="submit">
          Yuklash
        </button>
        <p v-if="successMessage" class="mt-2 text-center text-green-500">{{ successMessage }}</p>
        <p v-if="errorMessage" class="mt-2 text-center text-red-500">{{ errorMessage }}</p>
      </form>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div v-if="asd" class="fixed inset-0 z-50 w-full h-full flex items-center bg-black bg-opacity-50 justify-center">
    <div class="absolute w-[400px] bg-gray-300 flex flex-col items-center justify-center p-6 sm:p-10 rounded-lg">
      <img @click="func(null)" class="w-10 absolute top-4 right-4 cursor-pointer"
           src="../../../../public/reject.png" alt="Close" />
      <div class="mt-4 flex flex-col w-full items-center">
        <button @click="Modal"
                class="w-full py-4 px-6 mb-4 text-lg font-medium text-black bg-lime-500 rounded-lg hover:bg-lime-600">
          <img class="w-6 sm:w-8 inline-block mr-2" src="../../../../public/pen.png" alt="Edit" />
          O’zgartirish
        </button>
        <button @click="removeSelectedItems"
                class="w-full py-4 text-lg px-6 font-medium text-white bg-red-500 rounded-lg hover:bg-red-700">
          <img class="w-6 sm:w-8 inline-block mr-2" src="../../../../public/remove.png" alt="Delete" />
          O'chirish
        </button>
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
      <h1 class="text-2xl sm:text-4xl font-bold text-center text-blue-800 mb-6">
        O'zbekiston Respublikasi hududida sud tizimiga murojaat qilish tartibi
      </h1>
      <div class="w-full  bg-gray-200 rounded-lg p-6 sm:p-10">
        <h2 class="text-xl sm:text-2xl font-semibold text-blue-800 text-center mb-6">
          Siz o'zingizga kerak bo'lgan sudni tanlang!
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="item in data" :key="item.id" @click="goToPath(item.id)"
               class="relative   bg-white border-4 border-blue-800 rounded-lg p-6">
            <img @click.stop="func(item.id)" class="absolute top-2 right-2 w-6 h-6 cursor-pointer"
                 src="../../../../public/ellipsis.png" alt="Options" />
            <div class="flex items-center gap-4">
              <img v-if="item.img" :src="getImageUrl(item.img)" alt="Image" class="w-14 h-14 rounded-md" />
              <h3 class="text-lg font-medium text-center text-black">{{ item.name }}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>




<script setup>
import { ref, onMounted } from "vue";
import { watch } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import uploadpathadmin from "@/components/main/path/uploadpathadmin.vue";
import { URL } from "../../../auth/url.js";
import axios from "axios";
import Navbar from "@/components/header.vue";

const PutId = ref(null);
const router = useRouter();
const route = useRoute();
const url = `${URL}/courts`;
const imageBaseUrl = `${URL}/upload`;
const data = ref([]);
const showModal = ref(false);
const PutModal = ref(false);
const asd = ref(false);
const selectedId = ref(null);
const id1 = ref(route.params.id)



const toggleModal = () => {
  showModal.value = !showModal.value;
};

const Modal = () => {
  PutModal.value = !PutModal.value;
  asd.value = !asd.value
};

const func = (id) => {
  PutId.value = id;
  selectedId.value = id;
  asd.value = !asd.value;

  const selectedItem = data.value.find(item => item.id === id);
  if (selectedItem) {
    courtName.value = selectedItem.name;
  }
};


const getData = async () => {
  try {
    const response = await fetch(`${url}/${id1.value}`);
    if (response.ok) {
      const result = await response.json();
      data.value = result.services.sort((a, b) => a.id - b.id);

    } else {
      console.error("Ma'lumotlarni olishda xatolik:", response.statusText);
    }
  } catch (error) {
    console.error("Xatolik:", error);
  }
};

const removeSelectedItems = async () => {
  if (!selectedId.value) return;
  try {
    const response = await fetch(`${URL}/service/${selectedId.value}`, {
      method: "DELETE",
    });

    if (response.ok) {
      asd.value = false;
      getData()
    } else {
      console.error("O'chirishda xatolik:", response.statusText);
    }
  } catch (error) {
    console.error("Xatolik:", error);
  }
};

const getImageUrl = (filename) => `${imageBaseUrl}/${filename}`;

const goToPath = (id) => {
  router.push(`/aplicationsAdmin/${id}`);
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
    const response = await axios.post(`${URL}/service`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 201) {
      data.value.push(response.data);
      successMessage.value = "muvaffaqiyatli yuklandi!";
      errorMessage.value = "";
      courtName.value = "";
      file.value = null;
      getData()
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
    const response = await axios.put(`${URL}/service/${PutId.value}`, formData, {
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
<template>

  <div v-if="togle" class="fixed inset-0 z-50 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
    <div class="absolute bg-black flex flex-col opacity-[90%] items-center justify-center p-10 px-16 rounded-[15px]">
      <div class="file-upload-container">
        <h1 class="text-center text-[25px]">Fayl yuklash</h1>
        <div class="file-upload-area flex justify-center items-center">
          <input type="text" class="text-black w-full p-2 rounded-[25px] my-5" placeholder="Name"
            v-model="selectedName" />
          <input type="file" id="fileInput" @change="handleFileChange" />
          <div>
            <button @click="back()" class="upload-button mr-5 mt-6">Bekor Qilish</button>
            <button @click="uploadFile" class="bg-[#2196f3] border-none rounded-[5px] cursor-pointer px-9 py-[10px]">
              Yuklash
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="asd" class="fixed inset-0 top-0 w-full z-50 h-full flex items-center justify-center bg-black bg-opacity-50">
    <div class="absolute bg-black flex flex-col opacity-[90%] items-center justify-center p-10 rounded-[15px]">
      <h2 class="text-white text-[20px] mb-4">O'chirmoqchimisiz?</h2>
      <div class="mt-4 w-[300px] justify-evenly flex">
        <button @click="removeSelectedItems"
          class="py-2 px-7 rounded-[25px] text-black duration-500 bg-lime-500 hover:bg-lime-600">
          O'chirish
        </button>
        <button @click="func(null)"
          class="py-2 rounded-[25px] text-black duration-500 px-6 bg-red-500 hover:bg-red-600">
          Bekor qilish
        </button>
      </div>
    </div>
  </div>


  <div class="flex justify-end">
    <div>
      <button @click="back" id="add"
        class="mr-6 text-[25px] w-[100px] rounded-[25px] text-black duration-500 bg-lime-500 hover:bg-lime-600">
        Add +
      </button>
    </div>
  </div>
  <div class="text-black flex flex-col justify-center mt-16 items-center">
    <div class="">
      <div class="rounded-[20px] max-w-[110rem] p-10 mb-16 opacity-[98%] w-[900px] shadow-2xl bg-slate-400">
        <!-- <h1 class=" mb-10 text-center text-[25px]">O'zbekistom Republikasi hududida sud tizimiga murojaat</h1> -->
        <div v-for="item in ServiceData.files" :key="item.id"
          class="flex items-center justify-between mb-1 p-2 shadow-2xl rounded-[10px] bg-slate-700 cursor-pointer"
          @click="goToCard(item.id)">
          <img width="25px" class="mr-5" src="../../../public/word.png" alt="" />
          <h1 class="text-white">{{ item.name }}</h1>
          <img @click.stop="func(item.id)" class="w-4 h-4 cursor-pointer" src="../../../public/reject.png" alt="" />
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { URL } from "../../auth/url.js";
import Aside from "@/components/aside.vue";

const ServiceId = ref(null);
const ServiceData = ref([]);
const selectedFile = ref(null);
const selectedName = ref('');
const togle = ref(false);
const asd = ref(false);
const route = useRoute();
const router = useRouter();
const numericId = ref(parseInt(route.params.id));

onMounted(async () => {
  ServiceId.value = numericId.value;
  await getCourtsData();
});

const getCourtsData = async () => {
  try {
    const response = await fetch(`${URL}/applications/${ServiceId.value}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    ServiceData.value = data;
  } catch (error) {
    console.error("Xatolik yuz berdi:", error.message);
    alert("Ma'lumotni olishda xatolik yuz berdi!");
  }
};

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0];
};

const uploadFile = async () => {
  if (!selectedFile.value) {
    alert("Fayl tanlanmagan!");
    return;
  }

  const formData = new FormData();
  formData.append("file", selectedFile.value);
  formData.append("applicationsId", numericId.value);
  formData.append("name", selectedName.value);

  try {
    const response = await fetch(`${URL}/files`, {
      method: "POST",
      body: formData,
    });
    togle.value = false
    getCourtsData()
  } catch (error) {
    console.error("Fayl yuklashda xatolik:", error);
  }
};

const back = () => {
  togle.value = !togle.value;
};

const func = (id) => {
  numericId.value = id;
  asd.value = id !== null;
};

const removeSelectedItems = async () => {
  try {
    const response = await fetch(`${URL}/files/${numericId.value}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Bo'lim muvaffaqiyatli o'chirildi!");
      asd.value = false;
      await getCourtsData();
    } else {
      const errorText = await response.text();
      console.error("O'chirishda xatolik:", errorText);
      alert(`Xatolik: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    console.error("Xatolik:", error);
    alert("Server bilan bog‘lanishda xatolik yuz berdi!");
  }
};

const goToCard = (id) => {
  router.push(`/edit/${id}`);
};
</script>

<style lang="scss" scoped>
.file-upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.file-upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-label {
  display: inline-block;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
}

.upload-label:hover {
  background-color: #45a049;
}

.upload-button {
  padding: 10px 20px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.upload-button:disabled {
  background-color: #90caf9;
  cursor: not-allowed;
}

.upload-button:hover:enabled {
  background-color: #1e88e5;
}
</style>

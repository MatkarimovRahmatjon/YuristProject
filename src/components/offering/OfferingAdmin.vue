<template>
  <div>
    <div v-if="asd" class="fixed z-30 w-full h-full flex items-center bg-black bg-opacity-50 justify-center">
      <div
        class="absolute h-[200px] w-96 bg-slate-800 flex flex-col opacity-[90%] items-center justify-center p-10 rounded-[15px]">
        <img @click="func(null)" class="w-14 -mr-[290px] absolute -mt-28" src="../../../public/reject.png" alt="">
        <div class="mt-4 flex flex-col justify-center items-center">
          <div>
            <button @click="removeSelectedItems"
              class="py-4 rounded-[25px] text-black duration-500 text-[20px] px-16 bg-lime-500 hover:bg-lime-600">
              O'chirish
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showModal"
      class="fixed top-0 z-30 w-full h-full flex items-center bg-black bg-opacity-50 justify-center">
      <div
        class="absolute h-64 w-96 bg-black flex flex-col opacity-[90%] items-center justify-center p-10 rounded-[15px]">
        <h1 class="text-[20px] text-center">offering nomini kiriting</h1>
        <input v-model="desc" @keyup.enter="setData()"
          class="mt-3 outline-none border-none text-black w-full p-3 rounded-[25px]" type="text"
          placeholder="ma'lumot kiriting" />
        <div class="mt-4 flex gap-4">
          <button @click="setData()"
            class="py-2 rounded-[25px] text-black duration-500 px-4 bg-lime-500 hover:bg-lime-600">Qo'shish</button>
          <button @click="toggleModal()"
            class="py-2 rounded-[25px] text-black duration-500 px-4 bg-red-500 hover:bg-red-600">Bekor
            qilish</button>
        </div>
      </div>
    </div>
    <div class="asd h-[410px] flex justify-center items-center  ">
      <h1 class="text-[40px] -mt-16">Ommaviy oferta</h1>
    </div>
    <div class="flex justify-end">
      <div>
        <button @click="toggleModal()" id="add"
          class="mr-6 text-[25px] w-[100px] rounded-[25px] text-black duration-500 bg-lime-500 hover:bg-lime-600">Add
          +</button>
      </div>
    </div>
    <div class="flex justify-center h-auto   break-words">

      <div class="container h-auto">
        <div v-for="item, index of data"
          class="flex h-auto break-words items-center justify-between bg-slate-400 p-3 rounded-[20px] mb-5"
          :key="index">
          <div class="flex">
            <h1 class="mr-4 text-[20px] text-black">{{ index + 1 }}</h1>
            <h1 class=" text-[20px] break-words text-black">{{ item.desc }}</h1>
          </div>
          <img @click="func(item.id)" class="w-8" src="../../../public/reject.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { URL } from "../../auth/url";
import axios from "axios";

const data = ref([]);

const showModal = ref(false);
const desc = ref("");
const asd = ref(false);
const Id = ref(null);

function toggleModal() {
  showModal.value = !showModal.value;
}

function func(id) {
  Id.value = id;
  asd.value = !asd.value;
}

const setData = async () => {
  const res = await axios.post(`${URL}/offering`, {
    desc: desc.value,
  });

  toggleModal();
  getData();
};

const getData = async () => {
  try {
    const response = await fetch(`${URL}/offering`);
    if (response.ok) {
      const result = await response.json();
      data.value = result;
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
    const response = await fetch(`${URL}/offering/${Id.value}`, {
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

getData();
</script>

<style scoped>
.asd {
  background: no-repeat url(../../../public/OOOO-removebg-preview.png);
  background-size: cover;

}
</style>
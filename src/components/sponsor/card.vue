<template>
  <div>
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
            <div class="">
              <div class="mb-5 flex justify-center mt-3">
                <img v-if="item.img" :src="getImageUrl(item.img)" alt="Image" class="w-[150px]" />
              </div>
              <!-- Tarjima qilingan nomni ko'rsatish -->
              <h3 class="text-lg font-medium text-center text-black">{{ item.name }}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, ref } from "vue";
import { URL } from "../../auth/url";

const data = ref([]);
const datakril = ref([]);
const imageBaseUrl = `${URL}/upload`;
const dat = inject('dat');

// Transliteration map
const translitMap = {
  "ch": "ч", "sh": "ш", "yo": "ё", "yu": "ю", "ya": "я", "ye": "е", "oʻ": "ў", "g‘": "ғ",
  "a": "а", "b": "б", "d": "д", "e": "э", "f": "ф", "g": "г", "h": "ҳ", "i": "и", "j": "ж",
  "k": "к", "l": "л", "m": "м", "n": "н", "o": "о", "p": "п", "q": "қ", "r": "р", "s": "с",
  "t": "т", "u": "у", "v": "в", "x": "х", "y": "й", "z": "з", "'": "ъ"
};

// Translate function
const translateText = (text) => {
  let translated = text.toLowerCase();
  for (const key in translitMap) {
    const regex = new RegExp(key, "g");
    translated = translated.replace(regex, translitMap[key]);
  }
  return translated;
};

// Fetch data and translate names
const getData = async () => {
  try {
    const response = await fetch(`${URL}/partners`);
    if (response.ok) {
      const result = await response.json();
      // Kirillcha tarjima qilish
      datakril.value = result
        .sort((a, b) => a.id - b.id)
        .map(item => ({
          ...item,
          translatedName: translateText(item.name) // Kirillchaga o'girib qo'shish
        }));
      data.value = result; // Asl ma'lumotlar saqlanadi
    } else {
      console.error("Ma'lumotlarni olishda xatolik:", response.statusText);
    }
  } catch (error) {
    console.error("Xatolik:", error);
  }
};

// Generate image URL
const getImageUrl = (filename) => `${imageBaseUrl}/${filename}`;

// Fetch data on component mount
getData();
</script>

<style scoped></style>
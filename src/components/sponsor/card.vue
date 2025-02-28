<template>
  <div>
    <div class="w-full flex flex-col justify-center items-center mt-10">
      <div class="rounded-2xl w-full max-w-[110rem] p-10 mb-16 bg-gray-200">
        <div class="flex justify-center">
          <b class="mb-10 block text-center text-[30px] sm:[35px] md:text-[40px] uppercase text-[#223B9E]">{{
            $t('hamkor') }}</b>
        </div>
        <div class="my-16 flex justify-center flex-wrap gap-16">
          <div v-if="dat === 'datakril'" v-for="item in datakril" :key="item.id"
            class="bg-white border-[#223B9E] border-[5px] break-words w-96 h-96 rounded-xl hover:-translate-y-3 duration-500 hover:shadow-[0px_0px_50px_5px_rgba(255,255,255,1)] p-6">
            <div class="mb-5 flex justify-center mt-3">
              <img v-if="item.img" :src="getImageUrl(item.img)" alt="Image" class="w-[150px]" />
            </div>
            <h3 class="text-lg font-medium text-center text-black">{{ item.translatedName }}</h3>
          </div>
          <div v-if="dat === 'datalotin'" v-for="item in data" :key="item.id"
            class="bg-white border-[#223B9E] border-[5px] break-words w-96 h-96 rounded-xl hover:-translate-y-3 duration-500 hover:shadow-[0px_0px_50px_5px_rgba(255,255,255,1)] p-6">
            <div class="mb-5 flex justify-center mt-3">
              <img v-if="item.img" :src="getImageUrl(item.img)" alt="Image" class="w-[150px]" />
            </div>
            <h3 class="text-lg font-medium text-center text-black">{{ item.name }}</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { URL } from "../../auth/url";

const data = ref([]);
const datakril = ref([]);
const dat = ref(localStorage.getItem('til') || 'datalotin');
const imageBaseUrl = `${URL}/upload`;

const translitMap = {
  "ch": "ч", "sh": "ш", "yo": "ё", "yu": "ю", "ya": "я", "ye": "е", "oʻ": "ў", "g‘": "ғ",
  "a": "а", "b": "б", "d": "д", "e": "э", "f": "ф", "g": "г", "h": "ҳ", "i": "и", "j": "ж",
  "k": "к", "l": "л", "m": "м", "n": "н", "o": "о", "p": "п", "q": "қ", "r": "р", "s": "с",
  "t": "т", "u": "у", "v": "в", "x": "х", "y": "й", "z": "з", "'": "ъ"
};

const translateText = (text) => {
  let translated = text.toLowerCase();
  for (const key in translitMap) {
    translated = translated.replace(new RegExp(key, "g"), translitMap[key]);
  }
  return translated;
};

const getData = async () => {
  try {
    const response = await fetch(`${URL}/partners`);
    if (response.ok) {
      const result = await response.json();
      const sortedItems = result.sort((a, b) => a.id - b.id);
      datakril.value = sortedItems.map(item => ({ ...item, translatedName: translateText(item.name) }));
      data.value = sortedItems;
    }
  } catch (error) {
    console.error("Xatolik:", error);
  }
};

const getImageUrl = (filename) => `${imageBaseUrl}/${filename}`;

let intervalId = null;
const checkLanguageChange = () => {
  const currentLang = localStorage.getItem('til') || 'datalotin';
  if (currentLang !== dat.value) dat.value = currentLang;
};

onMounted(() => {
  getData();
  intervalId = setInterval(checkLanguageChange, 500);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<style scoped></style>
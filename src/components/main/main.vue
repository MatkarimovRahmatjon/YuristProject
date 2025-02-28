<template>
  <div class="flex text-white flex-col items-center py-10">
    <div class="flex flex-col items-center mt-6 px-4">
      <h1 class="text-2xl sm:text-4xl font-bold text-center text-blue-800 mb-6" style="text-shadow: 10px 10px 30px black;">
        {{ $t('murojaat') }}
      </h1>
      <div class="w-full bg-gray-200 rounded-lg p-6 sm:p-10">
        <b style="text-shadow: 10px 10px 30px black;"
          class="text-xl sm:text-2xl block font-extrabold text-blue-800 text-center mb-6">
          {{ $t('sud') }}
        </b>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-if="dat === 'datakril'" v-for="item in datakril" :key="item.id" @click="goToPath(item.id)"
            class="hover:bg-lime-500 duration-500 active:duration-500 bg-white border-4 border-blue-800 rounded-lg p-6">
            <div class="flex items-center gap-4">
              <img v-if="item.img" :src="getImageUrl(item.img)" alt="Image" class="w-14 h-14 rounded-md" />
              <h3 class="text-lg font-medium text-center text-black capitalize">{{ item.translatedName }}</h3>
            </div>
          </div>
          <div v-if="dat === 'datalotin'" v-for="item in data" :key="item.id" @click="goToPath(item.id)"
            class="hover:bg-lime-500 duration-500 active:duration-500 bg-white border-4 border-blue-800 rounded-lg p-6">
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
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { URL } from "../../auth/url.js";

const router = useRouter();
const url = `${URL}/courts`;
const imageBaseUrl = `${URL}/upload`;
const data = ref([]);
const datakril = ref([]);
const dat = ref(localStorage.getItem('til') || 'datalotin');

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
    const response = await fetch(url);
    if (response.ok) {
      const result = await response.json();
      const activeItems = result.filter(item => item.status === "active");
      datakril.value = activeItems
        .sort((a, b) => a.id - b.id)
        .map(item => ({ ...item, translatedName: translateText(item.name) }));
      data.value = activeItems;
    }
  } catch (error) {
    console.error("Xatolik:", error);
  }
};

const getImageUrl = (filename) => `${imageBaseUrl}/${filename}`;

const goToPath = (id) => {
  router.push(`/path/${id}`);
};

let intervalId = null;
const checkLanguageChange = () => {
  const currentLang = localStorage.getItem('til') || 'datalotin';
  if (currentLang !== dat.value) {
    dat.value = currentLang;
  }
};

onMounted(() => {
  getData();
  intervalId = setInterval(checkLanguageChange, 0);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>
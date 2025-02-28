<template>
  <ParticlesHeader />
  <div class="flex flex-col items-center py-10">
    <div class="flex flex-col items-center mt-6 px-4">
      <h1 class="text-2xl sm:text-4xl font-bold text-center text-blue-800 mb-6">
        O'zbekiston Respublikasi hududida sud tizimiga murojaat qilish tartibi
      </h1>
      <div class="w-full bg-gray-200 rounded-lg p-6 sm:p-10">
        <h2 class="text-xl sm:text-2xl font-semibold text-blue-800 text-center mb-6">
          Siz o'zingizga kerak bo'lgan sudni tanlang!
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center items-center">
          <div v-if="dat === 'datakril'" v-for="item in datakril" :key="item.id" @click="goToPath(item.id)"
               class="relative hover:bg-lime-500 duration-500 bg-white border-4 border-blue-800 rounded-lg p-6">
            <div class="flex items-center gap-4">
              <img v-if="item.img" :src="getImageUrl(item.img)" alt="Image" class="w-14 rounded-md" />
              <h3 class="text-lg font-medium text-center text-black capitalize">{{ item.translatedName }}</h3>
            </div>
          </div>
          <div v-if="dat === 'datalotin'" v-for="item in data" :key="item.id" @click="goToPath(item.id)"
               class="relative hover:bg-lime-500 duration-500 bg-white border-4 border-blue-800 rounded-lg p-6">
            <div class="flex items-center gap-4">
              <img v-if="item.img" :src="getImageUrl(item.img)" alt="Image" class="w-14 rounded-md" />
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
import { useRoute, useRouter } from "vue-router";
import ParticlesHeader from "@/components/header.vue";
import { URL } from "../../../auth/url.js";

const dat = ref(localStorage.getItem('til') || 'datalotin');
const datakril = ref([]);
const data = ref([]);
const imageBaseUrl = `${URL}/upload`;
const router = useRouter();
const route = useRoute();
const id1 = route.params.id;

const translitMap = {
  ch: "ч", sh: "ш", yo: "ё", yu: "ю", ya: "я", ye: "е", "oʻ": "ў", "g‘": "ғ",
  a: "а", b: "б", d: "д", e: "э", f: "ф", g: "г", h: "ҳ", i: "и", j: "ж",
  k: "к", l: "л", m: "м", n: "н", o: "о", p: "п", q: "қ", r: "р", s: "с",
  t: "т", u: "у", v: "в", x: "х", y: "й", z: "з", "'": "ъ"
};

const translateText = (text) => {
  if (!text) return "";
  let translated = text.toLowerCase();
  for (const [key, value] of Object.entries(translitMap)) {
    translated = translated.replace(new RegExp(key, "g"), value);
  }
  return translated;
};

const getData = async () => {
  try {
    const response = await fetch(`${URL}/service/${id1}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const result = await response.json();

    if (Array.isArray(result)) {
      datakril.value = result.map(item => ({ ...item, translatedName: translateText(item.name) }));
      data.value = result;
    } else if (result?.applications && Array.isArray(result.applications)) {
      datakril.value = result.applications.map(item => ({ ...item, translatedName: translateText(item.name) }));
      data.value = result.applications;
    }
  } catch (error) {
    console.error("Xatolik:", error);
  }
};

const getImageUrl = (filename) => `${imageBaseUrl}/${filename}`;

const goToPath = (id) => {
  router.push(`/ServiceAdmin/${id}`);
};

let intervalId = null;
const checkLanguageChange = () => {
  const currentLang = localStorage.getItem('til') || 'datalotin';
  if (currentLang !== dat.value) dat.value = currentLang;
};

onMounted(() => {
  getData();
  intervalId = setInterval(checkLanguageChange, 0);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<style scoped></style>
<template>
  <div
    class="flex mt-12 text-white items-center px-3 w-full h-[100px] md:h-[150px] lg:h-[200px] opacity-[88%] relative bg-[#0033FF]">
    <div id="particles-js" class="absolute top-0 left-0 w-full h-full"></div>
    <div class="flex items-center">
      <div class="flex justify-center relative ml-2 sm:mx-10 mt-2 z-10">
        <img src="../../public/logo.png" class="w-[200px] md:w-[250px] lg:w-[300px]" alt="Logo" />
      </div>
      <b class="lg:text-[20px] 2xl:text-[23px] md:text-[16px] text-[10px] w-[80%] md:w-[60%] lg:w-[35%] z-0 uppercase"
        style="text-shadow: 2px 2px 50px white;">
        {{ $t('header') }}
      </b>
    </div>
    <div class="mr-[140px]">
      <div>
        <span v-for="(lang, index) in languages" :key="index" @click="changeLanguage(lang.code)"
          class="mx-1 text-[22px] hover:text-gray-300 duration-500 relative z-50 cursor-pointer">
          {{ lang.label }}
        </span>
      </div>
      <div class="flex mt-2 border-b-2 justify-center items-center">
        <input type="search" v-model="searchQuery" @input="searchItems"
          class="bg-opacity-0 bg-[#0033FF] text-ellipsis w-full relative z-50 outline-none"
          :placeholder="$t('qidiruv')">
        <label>
          <img src="../../public/loupe.png" class="w-5" alt="Search">
        </label>
      </div>
      <!-- Search Results -->
      <div v-if="searchQuery && filteredData.length"
        class="absolute z-50 bg-white max-h-[500px] text-black mt-2 overflow-y-auto rounded shadow-lg">
        <div @click="router.push(`path/${item.id}`)" v-for="item in filteredData" :key="item.id" class="p-2 text-black cursor-pointer">
          {{ item.name }}
        </div>
      </div>
      <div v-else-if="searchQuery && !filteredData.length"
        class="absolute bg-white text-black mt-2 w-full p-2 z-50 rounded shadow-lg">
        Hech narsa topilmadi
      </div>
    </div>
    <button class="absolute right-4 top-4 bg-[#1c9c32] px-6 py-2 rounded-2xl z-50 hover:bg-[#268a37] duration-500">
      {{ $t('kabinetga_kirish') }}
    </button>
  </div>
</template>

<script setup>
import { URL } from "@/auth/url";
import axios from "axios";
import { onMounted, provide, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
const router = useRouter()
const { locale } = useI18n();
const searchdata = ref([]);
const filteredData = ref([]);
const searchQuery = ref('');
const languages = ref([
  { code: "uzb", label: "O‘ZB" },
  { code: "ўзб", label: "ЎЗБ" },
  { code: "ru", label: "РУС" },
  { code: "en", label: "ENG" },
]);

const changeLanguage = (lang) => {
  const data = lang === "uzb" ? "datalotin" : "datakril";
  locale.value = lang;
  localStorage.setItem("til", data);
  searchItems();
};

const getData = async () => {
  try {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const [appeals, courts] = await Promise.all([
      axios.get(`${URL}/appeal`, config),
      axios.get(`${URL}/courts`, config),
    ]);
    searchdata.value = [...appeals.data, ...courts.data].filter(item => item.status === "active");
  } catch (error) {
    console.error("Ma'lumot yuklashda xatolik:", error);
  }
};

const searchItems = () => {
  const query = searchQuery.value.toLowerCase().trim();
  filteredData.value = searchdata.value.filter(item =>
    item.name && item.name.toLowerCase().includes(query)
  );
};

onMounted(() => {
  getData();
  const loadParticlesScript = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js";
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  loadParticlesScript()
    .then(() => {
      particlesJS("particles-js", {
        particles: {
          number: { value: 100, density: { enable: true, value_area: 800 } },
          color: { value: "#ffffff" },
          shape: { type: "circle", stroke: { width: 0, color: "#000000" } },
          opacity: { value: 0.7, random: true, anim: { enable: true, speed: 1, opacity_min: 0.3, sync: false } },
          size: { value: 4, random: true, anim: { enable: true, speed: 20, size_min: 0.1, sync: false } },
          line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.3, width: 2 },
          move: { enable: true, speed: 3, direction: "none", random: false, straight: false, out_mode: "out" },
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: true, mode: "grab" },
            onclick: { enable: true, mode: "push" },
            resize: true,
          },
          modes: {
            grab: { distance: 200, line_linked: { opacity: 1 } },
            bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
            repulse: { distance: 150, duration: 0.4 },
            push: { particles_nb: 4 },
            remove: { particles_nb: 2 },
          },
        },
        retina_detect: true,
      });
    })
    .catch((error) => {
      console.error("Particles.js yuklashda xatolik:", error);
    });
});

provide('filteredData', filteredData);
</script>

<style scoped>
#particles-js {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
}

b {
  color: white;
  font-weight: bold;
}
</style>

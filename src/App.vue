<template>
  <div id="app" class="top-0">
    <!-- Til tanlash dropdown -->
    <div class="flex z-50 fixed top-0 right-0 justify-end p-2">
      <div class="relative">
        <button @click="toggleDropdown"
                class="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 rounded-lg px-4 py-2 shadow-md">
          <img :src="selectedFlag" class="w-5 rounded h-5"/>
          <span>{{ selectedLabel }}</span>
          <svg class="w-4 h-4 transition-transform transform"
               :class="{'rotate-180': isOpen}" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"></path>
          </svg>
        </button>

        <div v-if="isOpen"
             class="absolute right-0 mt-2 w-40 bg-blue-700 border rounded-lg shadow-md overflow-hidden">
          <div @click="setLanguage('lotin', 'Uz', '/uzb.png')"
               class="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-blue-100">
            <img src="/uzb.png" class="w-5 rounded h-5"/>
            <span>Uz</span>
          </div>

          <div @click="setLanguage('kril', 'Уз', '/uzb.png')"
               class="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-blue-100">
            <img src="/uzb.png" class="w-5 rounded h-5"/>
            <span>Уз</span>
          </div>
        </div>
      </div>
    </div>

    <RouterView/>
  </div>
</template>

<script setup>
import { ref, provide } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
const isOpen = ref(false);
const selectedFlag = ref("/uzb.png"); // Boshlang‘ich til bayrog‘i
const selectedLabel = ref("Uz"); // Boshlang‘ich til nomi
const dat = ref('datalotin');
provide('dat', dat);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const setLanguage = (lang, label, flag) => {
  dat.value = lang === "kril" ? "datakril" : "datalotin";
  locale.value = lang;
  selectedLabel.value = label;
  selectedFlag.value = flag;
  isOpen.value = false;
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  color: white;
}
</style>

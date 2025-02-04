<template>
  <div id="app" class="top-0">
    <div class="flex z-50 fixed top-0  right-0 justify-end">
      <select v-model="dat" @change="changeLanguage"
              class="bg-blue-700 mx-1 my-2 hover:bg-blue-800 rounded-lg outline-none px-4 py-2">
        <option value="datalotin">uzb</option>
        <option value="datakril">kril</option>
      </select>
    </div>
    <RouterView/>
  </div>
</template>
<script setup>


import {provide, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import Header from './components/header.vue';

const {locale} = useI18n();
const dat = ref('datalotin');
provide('dat', dat);
const changeLanguage = () => {
  if (dat.value === 'datakril') {
    locale.value = 'kril';
  } else {
    locale.value = 'lotin';
  }
};</script>
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  color: white;
}
</style>

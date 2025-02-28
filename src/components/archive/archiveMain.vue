<template>
  <div class="flex mb-10 justify-center items-center">
    <h1 style="text-shadow: 0 0 5px #fff,0 0 10px #fff;"
      class="text-black text-[40px] font-bold text-center bg-lime-500 border-[3px] border-black rounded-lg py-2 px-[100px]">
      O'chirilgan elementlar</h1>
  </div>

  <div class="flex gap-7 justify-center flex-wrap">
    <div @click="goToPath('courts')"
      class="relative hover:bg-lime-500 duration-500 bg-white w-[200px] border-4 border-blue-800 rounded-lg p-6">
      <h3 class="text-lg font-medium text-center text-black capitalize">courts</h3>
    </div>
    <div @click="goToPath('admin')"
      class="relative hover:bg-lime-500 duration-500 bg-white w-[200px] border-4 border-blue-800 rounded-lg p-6">
      <h3 class="text-lg font-medium text-center text-black capitalize">Adminlar</h3>
    </div>
    <div @click="goToPath('yurist')"
      class="relative hover:bg-lime-500 duration-500 bg-white w-[200px] border-4 border-blue-800 rounded-lg p-6">
      <h3 class="text-lg font-medium text-center text-black capitalize">Yuristlar</h3>
    </div>
    <div @click="goToPath('coll_center')"
      class="relative hover:bg-lime-500 duration-500 bg-white w-[200px] border-4 border-blue-800 rounded-lg p-6">
      <h3 class="text-lg font-medium text-center text-black capitalize">Operatorlar</h3>
    </div>
    <div @click="goToPath('partners')"
      class="relative hover:bg-lime-500 duration-500 bg-white w-[200px] border-4 border-blue-800 rounded-lg p-6">
      <h3 class="text-lg font-medium text-center text-black capitalize">Hamkorlar</h3>
    </div>
    <div @click="goToPath('courts')"
      class="relative hover:bg-lime-500 duration-500 bg-white w-[200px] border-4 border-blue-800 rounded-lg p-6">
      <h3 class="text-lg font-medium text-center text-black capitalize">Xabarlar</h3>
    </div>
  </div>
</template>
<script setup lang="ts">
import router from '@/router';

function goToPath(data) {
  router.push(`/archiveBody/${data}`)
}
</script>
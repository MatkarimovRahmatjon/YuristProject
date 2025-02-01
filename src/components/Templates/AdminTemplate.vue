<template>
  <div class="flex h-screen">
    <Aside class="fixed left-0 top-0 h-full w-64" />
    <main class="flex-1 ml-64 p-4">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Aside from '../aside.vue';
import FooterAdmin from "@/components/footer/footerAdmin.vue";
</script>

<style scoped>
.flex {
  display: flex;
}

.h-screen {
  height: 100vh;
}

.main {
  margin-left: 256px;
  flex-grow: 1;
  overflow-y: auto;
  height: 100vh;
  padding: 20px;
}
</style>

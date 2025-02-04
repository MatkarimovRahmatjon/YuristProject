<template>
    <ParticlesHeader />
    <Time />
    <Header />
    <Appeal />
    <Card />
    <Footer />
</template>

<script setup>
import Appeal from "@/components/appeal/appeal.vue";
import HomeAction from "@/components/main/HomeAction.vue";
import Header from "@/components/main/main.vue";
import Card from "@/components/sponsor/card.vue";
import Time from "@/components/time/time.vue";
import Footer from "@/components/footer/footer.vue";
import ParticlesHeader from "@/components/header.vue";
import router from "@/router/index.js";
function login() {
    router.push('/login')
}
</script>

<style scoped></style>
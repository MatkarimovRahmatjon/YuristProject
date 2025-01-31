<template>
    <div class="absolute top-0">
        <button @click="login()"
            class="bg-[#223B9E] hover:bg-blue-  00 duration-500 py-1 mx-1 my-1 px-8 text-[25px] rounded-[35px]">
            Login
        </button>
    </div>
    <Navbar />
    <Time />
    <Header />
    <Appeal />
    <Card />
    <Footer />
</template>

<script setup>
import Appeal from "@/components/appeal/appeal.vue";
import Navbar from "@/components/header.vue";
import HomeAction from "@/components/main/HomeAction.vue";
import Header from "@/components/main/main.vue";
import Card from "@/components/sponsor/card.vue";
import Time from "@/components/time/time.vue";
import Footer from "@/components/footer/footer.vue";
function login() {
    window.open('/login')
}
</script>

<style scoped></style>
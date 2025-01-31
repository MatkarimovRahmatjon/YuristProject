<template>
    <Profile />
    <Header />
    <Time />
    <!-- <HomeAction /> -->
    <Main />
    <Appeal />
    <CardAdmin />
    <footerAdmin />
</template>

<script setup>
import Header from "../components/header.vue";
import Main from "../components/main/admin.vue";
import Appeal from "../components/appeal/appealAdmin.vue";
import CardAdmin from "../components/sponsor/CardAdmin.vue";
import footerAdmin from "../components/footer/footerAdmin.vue";
import Time from "@/components/time/time.vue";
import HomeAction from "@/components/main/HomeAction.vue";
import Profile from "@/components/ProfilePage/Profile.vue";

</script>

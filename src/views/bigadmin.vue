<template>
    <div class="-mb-[48px] flex justify-end">
        <button @click="create()"
            class="bg-[#223B9E] hover:bg-blue-  00 duration-500 py-1 mx-1 my-1 px-8 text-[25px] rounded-[35px]">
            Adminlar ro'yxati
        </button>
    </div>
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

import { ref } from "vue";
import { URL } from "@/auth/url";
import axios from "axios";
import router from "@/router";

function create() {
    router.push('/bigAdminCreate')
}

</script>

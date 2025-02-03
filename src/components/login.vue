<template>
  <div v-if="modal" class="fixed flex justify-center items-center w-full h-full inset-0 bg-black bg-opacity-80">
    <div class="absolute bg-slate-800 p-10">
        <input v-model="sms" type="text" class="rounded-xl p-3 text-black outline-none" placeholder="SMSni kiriting"/>
    </div>
  </div>
  <div>
    <div class="flex flex-col items-center justify-center ">
      <div class="min-h-[450px] max-w-[650px] shadow-2xl text-center m-5 p-9 w-full bg-blue-500 rounded-[25px]">
        <h1 class="text-[45px]">Tizimga kirish</h1>
        <form @submit.prevent="setData">
          <input v-model="username" id="username"
            class="rounded-[10px] shadow-2xl w-full text-black my-2 p-2 mt-7 outline-none" placeholder="username"
            type="text" required />
          <input v-model="password" id="password"
            class="rounded-[10px] shadow-2xl w-full text-black my-2 p-2 outline-none" placeholder="password"
            type="password" required />
          <input v-model="tell" id="tell" class="rounded-[10px] shadow-2xl w-full text-black my-2 p-2 outline-none"
            placeholder="telefon raqam" type="number" required />
          <input v-model="jshshr" id="jshshr"
            class="rounded-[10px] shadow-2xl w-full text-black my-2 p-2 outline-none" placeholder="JSHSHR" type="number"
            required />
        </form>

        <button @click="setData"
          class="bg-lime-600 shadow-2xl hover:bg-lime-700 duration-500 px-14 rounded-[25px] mt-12 py-3">
          Tizimga Kirish
        </button>

        <p v-if="error" class="text-red-500 mt-4">{{ error }}</p>
      </div>
      <div class="bg-red-700 flex justify-center items-start gap-10 rounded-[20px] p-10">
        <div class="">
          <img class="w-96 rounded-[20px]" src="../../public/unnamed.webp" alt="">
        </div>
        <div>
          <h1 class="text-center text-[25px] font-bold bg-yellow-600 w-[330px] rounded-2xl ">DIQQAT&nbsp! &nbsp
            ESLATMA&nbsp! </h1> <br>
          <p class="">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspOʼzbekiston
            Respublikasida internet saytlarini buzib kirish bilan bogʼliq jinoyatlar uchun
            javobgarlik Oʼzbekiston Respublikasining Qonuniy hujjatlarida aniq belgilangan. Bu kabi harakatlar jinoiy
            javobgarlikni keltirib chiqaradi va bu masala Oʼzbekiston Respublikasining Jinoyat kodeksida bayon
            etilgan.<br>
            Oʼzbekiston Respublikasi Jinoyat kodeksi:
            278-moddasida "Kompьyuter maʼlumotlari va vositalarini oʼgʼirlash, yoʼq qilish, oʼzgartirish yoki bloklash".
            Bu
            moddaga koʼra, agar shaxs kompьyuter maʼlumotlarini oʼzgartirish, yoʼq qilish yoki bloklash orqali buzib
            kirsa, u jinoiy javobgarlikka tortiladi. Buning uchun belgilangan jazo turlari qamoq, jarima yoki boshqa
            turdagi jazolarni oʼz ichiga oladi. Bundan tashqari
            278^1-moddasiga koʼra "Kompьyuter maʼlumotlariga noqonuniy kirish". Аgar shaxs kompьyuter tizimiga ruxsatsiz
            kirsa, u
            holda u mazkur moddaga koʼra javobgarlikka tortiladi. <br>
            &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspOʼzbekiston Respublikasi Maʼmuriy
            javobgarlik toʼgʼrisidagi kodeks: <br>
            Maʼmuriy huquqbuzarliklar toʼgʼrisidagi kodeksda ham internet tarmoqlarini buzib kirish kabi mayda
            huquqbuzarliklar uchun javobgarlik belgilangan <br>
            Ushbu qonunchilik asosida, internet saytlarini buzib kirish kabi harakatlar jinoyat hisoblanadi va jinoiy
            javobgarlikni keltirib chiqaradi. Jinoyat sodir etgan shaxslar qonun oldida javob beradi.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { URL } from "../auth/url";
const password = ref("".trim());
const username = ref("".trim());
const jshshr = ref("".trim());
const tell = ref("".trim());
const sms = ref("".trim());
const modal = false
const error = ref("");
const router = useRouter();
const url = `${URL}/login`;
const id = ref(null)

const setData = async () => {
  try {
    const res = await axios.post(url, {
      username: username.value.trim(),
      password: password.value.trim(),
    });
   id.value = res.data.data.user.id
localStorage.setItem("id", res.data.data.user.id)
console.log(id.value)
    if (res.data.statusCode === 200) {
      const token = res.data.data.token;
      const role = res.data.data.user.role;
      const expirationTime = new Date().getTime() + 3600000;
      localStorage.setItem("token", token);
      localStorage.setItem("tokenExpiration", expirationTime.toString());
      if (!role) {
        error.value = "Foydalanuvchi roli aniqlanmadi.";
      } else if (typeof role !== "string") {
        error.value = "Noto‘g‘ri rol formati.";
      } else if (role.trim() === "admin") {
        router.push(`/admin/${id.value}`);
      } else if (role.trim() === "bigAdmin") {
        router.push(`/admin`);
      } else {
        error.value = "Bu rolda tizimga kirish taqiqlangan.";
      }
    }
  } catch (err) {
    error.value = err.response?.data?.message || "Login yoki parol noto'g'ri.";
  }
};

</script>
<template>
  <div>
    <div class="w-full flex flex-col justify-center items-center mt-10">
      <div class="rounded-2xl w-full max-w-[110rem] p-10 mb-16 bg-gray-200">
        <div class="flex justify-center">
          <b class="mb-10 block text-center text-[30px] sm:[35px] md:text-[40px] uppercase text-[#223B9E]">{{ $t('hamkor') }}</b>
        </div>
        <div class="my-16 flex justify-center flex-wrap gap-16">
          <div v-for="item in data" :key="item.id"
            class="bg-white border-[#223B9E] border-[5px] break-words w-96 h-96 rounded-xl hover:-translate-y-3 duration-500 hover:shadow-[0px_0px_50px_5px_rgba(255,255,255,1)] p-6">
            <div class="">
              <div class="mb-5 flex justify-center mt-3">
                <img v-if="item.img" :src="getImageUrl(item.img)" alt="Image" class="w-[150px]" />
              </div>
              <h3 class="text-lg font-medium text-center text-black">{{ item.name }}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup>
import { ref } from "vue";
import { URL } from "../../auth/url";
const data = ref([]);
const imageBaseUrl = `${URL}/upload`;
const getData = async () => {
  try {
    const response = await fetch(`${URL}/partners`);
    if (response.ok) {
      const result = await response.json();
      data.value = result;
    } else {
      console.error("Ma'lumotlarni olishda xatolik:", response.statusText);
    }
  } catch (error) {
    console.error("Xatolik:", error);
  }
};
getData();
const getImageUrl = (filename) => `${imageBaseUrl}/${filename}`;

</script>

<style scoped></style>

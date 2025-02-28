<template>
  <div>
    <form @submit.prevent="uploadCourt">
      <div>
        <input v-model="courtName" class="text-black w-full outline-none p-3 mt-9 rounded-[15px]" type="text" id="name"
          required />
      </div>
      <div>
        <input @change="onFileChange" type="file" id="file" accept="image/*" required />
      </div>
      <button class="w-full rounded-[30px] bg-lime-600 hover:bg-lime-900 text-[20px] py-2" type="submit">
        Yuklash
      </button>
    </form>
    <p v-if="successMessage" style="color: green">{{ successMessage }}</p>
    <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { ref, nextTick } from "vue";
import axios from "axios";
import { URL } from "../../auth/url";

export default {
  setup() {
    const courtName = ref("");
    const file = ref(null);
    const successMessage = ref("");
    const errorMessage = ref("");

    const onFileChange = (event) => {
      file.value = event.target.files[0];
    };

    const uploadCourt = async () => {
      const formData = new FormData();
      formData.append("name", courtName.value);
      formData.append("file", file.value);

      try {
        await axios.post(`${URL}/courts`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        successMessage.value = "Court muvaffaqiyatli yuklandi!";
        errorMessage.value = "";
        courtName.value = "";
        file.value = null;
        nextTick(() => {
          window.location.reload(); 
        });
      } catch (error) {
        errorMessage.value = "Yuklashda xato yuz berdi!";
        successMessage.value = "";
      }
    };

    return {
      courtName,
      file,
      successMessage,
      errorMessage,
      onFileChange,
      uploadCourt,
    };
  },
};
</script>

<style>
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 300px;
}
</style>

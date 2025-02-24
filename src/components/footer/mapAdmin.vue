<template>
    <div>
        <div v-if="showModal" class="fixed z-30 inset-0 flex overflow-hidden items-center justify-center">
            <div class="absolute inset-0 bg-black bg-opacity-70 z-20" @click="toggleModal"></div>
            <div
                class="relative z-30 bg-slate-500 opacity-90 p-10 rounded-lg flex flex-col items-center justify-center">
                <img @click="toggleModal" class="w-9 absolute top-4 right-4 cursor-pointer"
                    src="../../../public/reject.png" alt="Yopish" />
                <form class="flex flex-col gap-4">
                    <input v-model="courtName" class="text-black outline-none p-3 w-60 rounded-lg" type="text" id="name"
                        placeholder="HTML kodini kiriting" required />
                </form>
                <button @click="uploadCourt"
                    class="w-60 mt-4 rounded-full bg-lime-600 hover:bg-lime-900 text-lg text-white py-2" type="submit">
                    Yuklash
                </button>
                <p v-if="successMessage" class="text-green-500 mt-4">{{ successMessage }}</p>
                <p v-if="errorMessage" class="text-red-500 mt-4">{{ errorMessage }}</p>
            </div>
        </div>

        <div class="flex justify-end">
            <div>
                <button @click="toggleModal" id="add"
                    class="mb-5 text-[25px] w-[100px] rounded-[25px] text-black duration-500 bg-lime-500 hover:bg-lime-600">
                    Add +
                </button>
            </div>
        </div>
        <div class="flex items-center">
            <div v-for="item in data" :key="item.id">
                <div class="flex justify-end -mt-2">
                    <span @click.stop="func(item.id)" class="cursor-pointer w-6 h-6 flex items-center justify-center">
                        <img width="20px" src="../../../public/ellipsis.png" alt="" />
                    </span>
                </div>
                <div class="w-[350px] sm:w-[600px]" v-html="item.source">

                </div>
            </div>
        </div>
    </div>
    <!-- O'chirish Tasdiqlash Modal -->
    <div v-if="PutModal"
        class="fixed inset-0 z-50 w-full h-full flex items-center bg-black bg-opacity-50 justify-center">
        <div class="absolute inset-0 bg-black bg-opacity-70 z-20" @click="toggleModal"></div>
        <div class="relative z-30 bg-slate-500 opacity-90 p-10 rounded-lg flex flex-col items-center justify-center">
            <img @click="Modal" class="w-9 absolute top-4 right-4 cursor-pointer" src="../../../public/reject.png"
                alt="Yopish" />
            <form class="flex flex-col gap-4">
                <input v-model="courtName" class="text-black outline-none p-3 w-60 rounded-lg" type="text" id="name"
                    placeholder="HTML kodini kiriting" required />
            </form>
            <button @click="uploadCourt"
                class="w-60 mt-4 rounded-full bg-lime-600 hover:bg-lime-900 text-lg text-white py-2" type="submit">
                Yuklash
            </button>
            <p v-if="successMessage" class="text-green-500 mt-4">{{ successMessage }}</p>
            <p v-if="errorMessage" class="text-red-500 mt-4">{{ errorMessage }}</p>
        </div>
    </div>

    <div v-if="asd" class="fixed inset-0 z-50 w-full h-full flex items-center bg-black bg-opacity-50 justify-center">
        <div class="absolute w-96 bg-[#D9D9D9] flex flex-col items-center justify-center p-10 rounded-[15px]">
            <img @click="func(null)" class="w-14 -mr-[300px] absolute -mt-44" src="../../../public/reject.png" alt="" />
            <div class="mt-4 flex flex-col justify-center items-center">
                <div class="flex flex-col justify-between h-40 items-center">
                    <button @click="Modal"
                        class="py-4 rounded-[15px] h-[70px] items-center text-black w-full min-w-[250px] flex duration-500 text-[20px] px-10 bg-[#15FF09] hover:bg-lime-600">
                        <img class="w-8 mr-5" src="../../../public/pen.png" alt="">
                        O’zgartirish

                    </button>
                    <button @click="removeSelectedItems"
                        class="py-4 rounded-[15px] h-[70px] items-center text-black flex w-full min-w-[250px] duration-500 text-[20px] px-10 bg-[#FF0C0C] hover:bg-red-700">
                        <img class="w-10 mr-5" src="../../../public/remove.png" alt="">
                        O'chirish
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { URL } from "../../auth/url";
import axios from "axios";
const PutId = ref(null);
const PutModal = ref(false);
const data = ref([]);
const showModal = ref(false);
const courtName = ref("");
const successMessage = ref("");
const errorMessage = ref("");
const asd = ref(false);
const Id = ref(null);
const Modal = () => {
    PutModal.value = !PutModal.value
    asd.value = null
};
const func = (id) => {
    PutId.value = id;
    Id.value = id;
    asd.value = !asd.value;
};

const uploadCourt = async () => {

    try {
        const response = await axios.post(`${URL}/map`, { source: courtName.value });
        if (response.status === 200) {
            successMessage.value = "map muvaffaqiyatli yuklandi!";
            courtName.value = ""; 
            getData(); 
            showModal.value = false; 
        } else {
            errorMessage.value = "Xatolik yuz berdi!";
        }
    } catch (error) {
        console.error("Xatolik:", error);
        errorMessage.value = "Xatolik yuz berdi!";
    }
};

const getData = async () => {
    try {
        const response = await fetch(`${URL}/map`);
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

const removeSelectedItems = async () => {
    if (!Id.value) return;

    try {
        const response = await fetch(`${URL}/map/${+Id.value}`, {
            method: "DELETE",
        });

        if (response.ok) {
            asd.value = false;
            await getData();
        } else {
            console.error("O'chirishda xatolik:", response.statusText);
        }
    } catch (error) {
        console.error("Xatolik:", error);
    }
};

function toggleModal() {
    showModal.value = !showModal.value;
}



const updateCourt = async () => {
    try {
        const response = await axios.put(`${URL}/map/${PutId.value}`, { source: courtName.value });

        if (response.status === 200) {
            const updatedCourt = response.data;
            const index = data.value.findIndex((item) => item.id === PutId.value);
            if (index !== -1) {
                data.value[index] = updatedCourt;
            }

            successMessage.value = "Court muvaffaqiyatli yangilandi!";
            courtName.value = "";
            file.value = null;
            PutModal.value = false;
        }
    } catch (error) {
        errorMessage.value = "Xatolik yuz berdi: " + error.message;
    }
};
watch([showModal, PutModal, asd], ([modalOpen, asdOpen, deleteModalOpen]) => {

    if (modalOpen || deleteModalOpen || asdOpen) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});
getData();
</script>

<style scoped></style>

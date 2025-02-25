<template>
  <div class="min-h-screen flex flex-col items-center p-4">
    <div v-if="qwe" class="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg w-11/12 max-w-md">
        <div class="flex justify-end">
          <img @click="qwe = false" class="w-8 -m-4 cursor-pointer absolute " src="../../../public/reject.png"
            alt="Close" />
        </div>
        <h2 class="text-xl font-semibold text-black mb-4">Yangi Admin qo‘shish</h2>
        <input v-model="name" class="w-full text-black p-2 mb-3 border rounded-lg" placeholder="Ism" />
        <input v-model="surname" class="w-full text-black p-2 mb-3 border rounded-lg" placeholder="Familiya" />
        <input v-model="fatherName" class="w-full text-black p-2 mb-3 border rounded-lg" placeholder="Otasining ismi" />
        <input v-model="passport" class="w-full text-black p-2 mb-3 border rounded-lg"
          placeholder="Passport Seriya Raqami" />
        <input v-model="jshhr" class="w-full text-black p-2 mb-3 border rounded-lg" placeholder="JSHHR" />
        <input v-model="phone" class="w-full text-black p-2 mb-3 border rounded-lg" placeholder="Telefon Raqami" />
        <input v-model="birthday" type="date" class="w-full text-black p-2 mb-3 border rounded-lg"
          placeholder="Tog'ilgan kun" />
        <input v-model="role" class="w-full p-2 mb-3 border text-black rounded-lg" placeholder="Lavozimi" />
        <input v-model="username" class="w-full text-black p-2 mb-3 border rounded-lg" placeholder="login" />
        <div class="relative">
          <input v-model="password1" :type="showPassword ? 'text' : 'password'"
            class="w-full text-black p-2 mb-3 border rounded-lg pr-10" placeholder="Parol" />
          <button type="button" @click="showPassword = !showPassword"
            class="absolute inset-y-0 right-3 flex items-center">
            <img :src="showPassword ? '/eyes.png' : '/eye.png'" alt="Ko'rinishni almashtirish" class="w-5 h-5" />
          </button>
        </div>

        <div class="relative">
          <input v-model="password2" :type="showPassword1 ? 'text' : 'password'"
            class="w-full text-black p-2 mb-3 border rounded-lg pr-10" placeholder="Parolni takrorlang" />
          <button type="button" @click="showPassword1 = !showPassword1"
            class="absolute inset-y-0 right-3 flex items-center">
            <img :src="showPassword1 ? '/eyes.png' : '/eye.png'" alt="Ko'rinishni almashtirish" class="w-5 h-5" />
          </button>
        </div>

        <!-- Image Upload Field -->
        <input type="file" @change="handleImageUpload" class="w-full text-black p-2 mb-3 border rounded-lg" />

        <p class="text-red-600 text-sm">{{ err }}</p>
        <button @click="post"
          class="bg-green-600 text-white px-4 py-2 rounded-lg mt-3 w-full hover:bg-green-800 transition">
          Yaratish
        </button>
      </div>
    </div>
    <div v-if="PutModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg w-11/12 max-w-md">
        <div class="flex justify-end">
          <img @click="PutModal = false" class="w-8 -m-4 cursor-pointer absolute " src="../../../public/reject.png"
            alt="Close" />
        </div>
        <h2 class="text-xl font-semibold text-black mb-4">Adminni yangilash</h2>
        <input v-model="updatedName" class="w-full p-2 mb-3 border text-black rounded-lg" placeholder="ism" />
        <input v-model="updatedSurname" class="w-full p-2 mb-3 border text-black rounded-lg" placeholder="familiya" />
        <input v-model="updatedFatherName" class="w-full p-2 mb-3 border text-black rounded-lg"
          placeholder="otasining ismi" />
        <input v-model="updatedPassport" class="w-full p-2 mb-3 border text-black rounded-lg"
          placeholder="passport seriya raqami" />
        <input v-model="updatedJshhr" class="w-full p-2 mb-3 border text-black rounded-lg" placeholder="JSHHR" />
        <input v-model="updatedPhone" class="w-full p-2 mb-3 border text-black rounded-lg"
          placeholder="telefon raqami" />
        <input v-model="updatedBirthday" type="date" class="w-full text-black p-2 mb-3 border rounded-lg"
          placeholder="Tog'ilgan kun" />
        <input v-model="updatedrole" class="w-full p-2 mb-3 border text-black rounded-lg" placeholder="Lavozimi" />
        <input v-model="updatedUsername" class="w-full p-2 mb-3 border text-black rounded-lg" placeholder="login" />

        <!-- Image Upload Field for Edit -->
        <input type="file" @change="handleImageUploadUpdate" class="w-full text-black p-2 mb-3 border rounded-lg" />
        <button @click="updateAdmin"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg mt-3 w-full hover:bg-blue-800 transition">
          Ma'lumotlarni yangilash
        </button>
      </div>
    </div>
    <div v-if="asds" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg w-11/12 max-w-md">
        <div class="flex justify-end">
          <img @click="asds = false" class="w-8 -m-4 cursor-pointer absolute " src="../../../public/reject.png"
            alt="Close" />
        </div>
        <h2 class="text-xl font-semibold text-black mb-4">Parolni yangilash</h2>
        <input v-model="updatednewPassword1" class="w-full p-2 mb-3 border text-black rounded-lg"
          placeholder="yangi parol" />
        <input v-model="updatednewPassword2" class="w-full p-2 mb-3 border text-black rounded-lg"
          placeholder="yangi parolni takrorlang" />
        <p class="text-red-600 text-sm">{{ err }}</p>

        <button @click="updatepassword"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg mt-3 w-full hover:bg-blue-800 transition">
          Parolni yangilash
        </button>
      </div>
    </div>
    <div v-if="asd" class="fixed inset-0 flex items-center z-20 justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg w-11/12 max-w-sm text-center">
        <h2 class="text-lg text-black font-semibold">Haqiqatan ham o‘chirishni xohlaysizmi?</h2>
        <div class="flex justify-center items-center gap-4 mt-4">
          <button @click="removeAdmin" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition">
            ❌ O'chirish
          </button>
          <button @click="asd = false" class="bg-gray-400 px-4 py-2 rounded-lg hover:bg-gray-600 transition">
            Bekor qilish
          </button>
        </div>
      </div>
    </div>
    <div class="flex justify-center mb-16  items-center">
      <h1 style="text-shadow: 0 0 5px #fff,0 0 10px #fff;"
        class="text-black text-[40px] font-bold text-center bg-lime-500 border-[3px] border-black rounded-lg py-2 px-[100px]">
        Yuristlar ro'yxati <span v-if="Count" class="border-b-4 px-1 border-black text-black">{{ Count }}</span> </h1>
    </div>
    <div class="flex justify-end w-full max-w-4xl">
      <button @click="qwe = true"
        class="bg-blue-600 hover:bg-blue-800 text-white px-6 py-2 rounded-full text-lg transition">
        ➕ Admin yaratish
      </button>
    </div>
    <div class="w-full flex flex-wrap justify-center gap-4 mt-8">
      <div v-for="item in data" :key="item.id"
        class="relative w-[700px] flex flex-col md:flex-row items-center justify-between p-4 bg-white shadow-md rounded-lg border border-gray-200">
        <div @click="path(item.id)" class="relative flex flex-col md:flex-row items-center justify-between p-4 w-full">
          <div class="w-16 h-16 flex-shrink-0 rounded-full overflow-hidden border border-gray-300">
            <img :src="getImageUrl(item.img)" class="w-full h-full object-cover" alt="Admin Image" />
          </div>
          <div class="ml-4 flex-grow">
            <h1 class="text-2xl font-semibold text-gray-700">FIO: {{ item.surname }} {{ item.name }} {{ item.dadname }}
            </h1>
            <h1 class="text-lg text-gray-500">Login: {{ item.username }}</h1>
            <div class="mb-4 relative text-gray-700 flex w-fit break-words">
              <span class="font-medium text-gray-700">Fuqaroning lavozimi :</span>
              <span class="block group truncate text-gray-700 max-w-[450px] ml-2 cursor-pointer">
                {{ item.lavozimi }}
                <span
                  class="absolute left-0 top-full mt-1 w-auto max-w-[550px] bg-gray-800 text-white text-sm px-2 py-1 rounded hidden group-hover:block">
                  {{ item.lavozimi }}
                </span>
              </span>
            </div>
            <div class="flex items-center">
              <span class="mr-2 text-sm text-gray-500">Holati:</span>
              <span :class="getAdminStatus(item).color">
                {{ getAdminStatus(item).status }}
              </span>
              <div class="flex items-center gap-2 ml-2">
                <div class="w-5 h-5 rounded-full" :class="checkIsOnline(item.id) ? 'bg-green-500' : 'bg-red-500'"></div>
              </div>
            </div>
          </div>
        </div>
        <!-- Tahrirlash va o'chirish tugmalari birinchi koddan -->
        <div class="relative">
          <button @click="toggleModal(item.id)" class="text-gray-500 z-30  hover:text-gray-700 text-2xl p-2">⋮</button>
          <div v-if="modalOpen === item.id"
            class="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-md border border-gray-200 z-10">
            <button @click="openEditModal(item)"
              class="block w-full px-4  py-2 text-left text-gray-700 hover:bg-gray-100">
              ✏️ Tahrirlash
            </button>
            <button @click="openDeleteModal(item.id)"
              class="w-full px-4 py-2 flex items-center text-left text-red-600 hover:bg-red-100">
              <h1 class="text-red-600 text-[30px] mr-1">🗑</h1> O'chirish
            </button>
            <button @click="openPassModal(item)"
              class="block w-full  px-4 py-2 text-left text-lime-600 hover:bg-red-100">
              🔑 Parolni oʼzgartirish
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { uz } from "date-fns/locale";
import { URL } from "@/auth/url.js";
import { io } from "socket.io-client";
import { useRouter } from "vue-router";

const socket = io(URL);
const data = ref([]);
const onlineAdmins = ref([]);
const modalOpen = ref(null);
const qwe = ref(false);
const PutModal = ref(false);
const asd = ref(false);
const err = ref("");
const selectedId = ref(null);
const showPassword = ref(false);
const showPassword1 = ref(false);
const name = ref("");
const surname = ref("");
const fatherName = ref("");
const username = ref("");
const passport = ref("");
const jshhr = ref("");
const phone = ref("");
const birthday = ref("");
const password1 = ref("");
const password2 = ref("");
const image = ref(null);
const role = ref("");
const updatedrole = ref("");
const updatedName = ref("");
const updatedSurname = ref("");
const updatedFatherName = ref("");
const updatedUsername = ref("");
const updatedPassport = ref("");
const updatedJshhr = ref("");
const updatedPhone = ref("");
const updatedBirthday = ref("");
const updatedImage = ref(null);
const updatedPassword = ref("")
const updatednewPassword1 = ref("")
const updatednewPassword2 = ref("")
const Count = ref(null);
const asds = ref(false)
const router = useRouter()
const path = (id) => {
  router.push(`/profile/${id}`);
};


const toggleModal = (id) => {
  modalOpen.value = modalOpen.value === id ? null : id;
};

const openEditModal = (item) => {
  selectedId.value = item.id;
  updatedName.value = item.name;
  updatedSurname.value = item.surname;
  updatedFatherName.value = item.dadname;
  updatedUsername.value = item.username;
  updatedPassport.value = item.userCode;
  updatedJshhr.value = item.uniqueCode;
  updatedPhone.value = item.phone;
  updatedrole.value = item.lavozimi;
  updatedBirthday.value = item.birthday ? item.birthday.split("T")[0] : "";
  PutModal.value = true;
  asd.value = false;
};

const openDeleteModal = (id) => {
  selectedId.value = id;
  PutModal.value = false;
  asd.value = true;
};

const openPassModal = (item) => {
  selectedId.value = item.id;
  updatedName.value = item.name;
  updatedSurname.value = item.surname;
  updatedFatherName.value = item.dadname;
  updatedUsername.value = item.username;
  updatedPassport.value = item.userCode;
  updatedJshhr.value = item.uniqueCode;
  updatedPhone.value = item.phone;
  updatedrole.value = item.lavozimi;
  updatedBirthday.value = item.birthday;
  asds.value = true;
};


const getData = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${URL}/yurist`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    data.value = response.data
      .filter(item => item.type === "active")
      .sort((a, b) => a.id - b.id);
    Count.value = data.value.length;

    onlineAdmins.value = data.value
      .filter(admin => {
        const lastSeenTime = new Date(admin.lastSeen).getTime();
        const currentTime = new Date().getTime();
        return (currentTime - lastSeenTime) < 5 * 60 * 1000;
      })
      .map(admin => admin.id.toString());
  } catch (error) {
    console.error("Xatolik:", error);
  }
};

const getAdminStatus = (admin) => {
  if (onlineAdmins.value.includes(admin.id.toString())) {
    return { status: "Onlayn", color: "text-green-500" };
  } else if (admin.lastSeen) {
    return {
      status: ` ${formatDistanceToNow(new Date(admin.lastSeen), {
        addSuffix: true,
        locale: uz,
      })} tarmoqda edi`,
      color: "text-red-500",
    };
  } else {
    return { status: "Oflayn", color: "text-gray-500" };
  }
};

const checkOnlineStatus = (onlineAdminIds) => {
  onlineAdmins.value = onlineAdminIds.map((id) => id.toString());
};

const getImageUrl = (img) => {
  return img ? `${URL}/upload/${img}` : "/default-avatar.png";
};

const checkIsOnline = (adminId) => {
  return onlineAdmins.value.includes(adminId.toString());
};

const updateAdmin = async () => {
  const formData = new FormData();
  formData.append("name", updatedName.value);
  formData.append("surname", updatedSurname.value);
  formData.append("dadname", updatedFatherName.value);
  formData.append("username", updatedUsername.value);
  formData.append("userCode", updatedPassport.value);
  formData.append("uniqueCode", updatedJshhr.value);
  formData.append("birthday", updatedBirthday.value);
  formData.append("phone", updatedPhone.value);
  formData.append("lavozimi", updatedrole.value);

  if (updatedImage.value) formData.append("image", updatedImage.value);

  try {
    const token = localStorage.getItem("token");
    await axios.put(`${URL}/yurist/${selectedId.value}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    getData();
    PutModal.value = false;
  } catch (error) {
    err.value = error.response?.data?.message || "Yangilashda xatolik!";
    console.error("Xatolik:", error);
  }
};
const updatepassword = async () => {
  if (updatednewPassword1.value !== updatednewPassword2.value) {
    err.value = "Parollar bir xil emas!";
    return;
  }

  try {
    const token = localStorage.getItem("token");

    await axios.put(
      `${URL}/yurist/${selectedId.value}/password`,
      {
        newPassword: updatednewPassword2.value,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    getData();
    asds.value = false;
    err.value = "";
  } catch (error) {
    err.value = error.response?.data?.message || "Parolni yangilashda xatolik!";
    console.error("Xatolik:", error);
  }
};
const post = async () => {
  if (password1.value !== password2.value) {
    err.value = "Parollar bir xil emas!";
    return;
  }

  const createdAt = new Date().toISOString();
  const formData = new FormData();
  formData.append("name", name.value);
  formData.append("surname", surname.value);
  formData.append("dadname", fatherName.value);
  formData.append("username", username.value);
  formData.append("userCode", passport.value);
  formData.append("uniqueCode", jshhr.value);
  formData.append("birthday", birthday.value);
  formData.append("phone", phone.value);
  formData.append("password", password2.value);
  formData.append("startWork", createdAt);
  formData.append("lavozimi", role.value);

  if (image.value) {
    formData.append("img", image.value);
  }

  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${URL}/yurist`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    getData();
    qwe.value = false;
  } catch (error) {
    console.error("Xatolik admin qo'shishda:", error.response?.data || error.message);
    err.value = error.response?.data?.message || "Admin yaratishda xatolik!";
  }
};

const removeAdmin = async () => {
  if (!selectedId.value) {
    console.error("O'chirish uchun admin ID tanlanmagan");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${URL}/yurist/${selectedId.value}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    getData();
    asd.value = false;
  } catch (error) {
    console.error("O‘chirishda xatolik:", error.response?.data || error.message);
  }
};

const handleImageUpload = (event) => {
  image.value = event.target.files[0];
};

const handleImageUploadUpdate = (event) => {
  updatedImage.value = event.target.files[0];
};

onMounted(() => {
  getData();

  socket.on("connect", () => {
    socket.emit("getOnlineAdmins");
  });

  socket.on("onlineAdmins", (onlineAdminIds) => {
    checkOnlineStatus(onlineAdminIds);
  });

  socket.on("adminOnlineUpdate", checkOnlineStatus);

  const interval = setInterval(() => {
    data.value = [...data.value];
  }, 60000);

  watch([qwe, PutModal, asds, asd], ([modalOpen, asds, asdOpen, deleteModalOpen]) => {
    if (modalOpen || deleteModalOpen || asds || asdOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  onUnmounted(() => {
    clearInterval(interval);
    socket.off("adminOnlineUpdate");
    socket.disconnect();
  });
});
</script>
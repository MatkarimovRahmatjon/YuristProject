<template>
  <div class="text-black">
    <button @click="sendTestNotification">Test Notification Yuborish</button>
    <br>
    <button @click="checkBirthday">Tug'ilgan kunlarni tekshirish</button>

    <!-- Bildirishnomalar ro'yxati -->
    <ul v-if="notifications.length">
      <li v-if="dat === 'datalotin'" v-for="(notification, index) in notifications" :key="index"
        class="hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] hover:bg-lime-500 hover:-translate-y-1  duration-500 notification">
        {{ notification }}
        <button @click="toggleOptions(index)">⋮</button>
        <div v-if="showOptions === index" class="options-menu">
          <button @click="confirmDelete(index)" class="delete-btn">🗑️ O‘chirish</button>
        </div>
      </li>
      <li v-if="dat === 'datakril'" v-for="(notification, index) in notifications" :key="index"
        class="hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] hover:bg-lime-500 hover:-translate-y-1  duration-500 notification">
        {{ translateText(notification) }}
        <button @click="toggleOptions(index)">⋮</button>
        <div v-if="showOptions === index" class="options-menu">
          <button @click="confirmDelete(index)" class="delete-btn">🗑️ O‘chirish</button>
        </div>
      </li>
    </ul>
    <p v-else>Hali hech qanday bildirishnoma yo'q.</p>
  </div>

  <!-- O'chirish uchun Modal -->
  <div v-if="showModal" class="modal">
    <div class="modal-content ">
      <p class="text-black text-[20px]">Xabarni o‘chirmoqchimisiz?</p>
      <div class="flex gap-5 mt-5 justify-center">
        <button class="text-[16px] bg-green-500 rounded px-8  py-1" @click="deleteNotification">Ha</button>
        <button class="text-[16px] bg-green-500 rounded px-8  py-1" @click="showModal = false">Yo‘q</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, inject } from 'vue';
import io from 'socket.io-client';
import { useRoute } from 'vue-router';
import { URL } from "@/auth/url.js";
import axios from "axios";

const route = useRoute();
const id = parseInt(route.params.id);
const notifications = ref([]);
const showModal = ref(false);
const showOptions = ref(null);
const notificationToDelete = ref(null);
const dat = inject('dat');

const translitMap = {
  "ch": "ч", "sh": "ш", "yo": "ё", "yu": "ю", "ya": "я", "ye": "е", "oʻ": "ў", "g‘": "ғ",
  "a": "а", "b": "б", "d": "д", "e": "э", "f": "ф", "g": "г", "h": "ҳ", "i": "и", "j": "ж",
  "k": "к", "l": "л", "m": "м", "n": "н", "o": "о", "p": "п", "q": "қ", "r": "р", "s": "с",
  "t": "т", "u": "у", "v": "в", "x": "х", "y": "й", "z": "з", "'": "ъ"
};

const translateText = (text) => {
  let translated = text.toLowerCase();
  for (const key in translitMap) {
    const regex = new RegExp(key, "g");
    translated = translated.replace(regex, translitMap[key]);
  }
  return translated;
};

function getNotificationsFromLocalStorage() {
  const storedNotifications = localStorage.getItem(`notifications-${id}`);
  return storedNotifications ? JSON.parse(storedNotifications) : [];
}

function saveNotificationsToLocalStorage() {
  localStorage.setItem(`notifications-${id}`, JSON.stringify(notifications.value));
}

const socket = io(URL, {
  query: { userId: `${id}`, username: 'Salayeva_Muslimaxon21062021', role: 'admin' }
});

onMounted(async () => {
  notifications.value = getNotificationsFromLocalStorage();

  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token topilmadi. Foydalanuvchi avtorizatsiyadan o'tmagan.");

    await axios.put(`${URL}/admin/${id}/notifications/mark-all-as-read`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Xabarnomalarni o'qilgan deb belgilagandan so'ng, ularni yangilab oling
    const response = await axios.get(`${URL}/admin/${id}/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    notifications.value = response.data.map(notification => notification.message);
    saveNotificationsToLocalStorage();
  } catch (error) {
    console.error("Xatolik xabarnomalarni o'qilgan deb belgilashda:", error);
  }

  socket.on('notification', (message) => {
    notifications.value.push(message);
    saveNotificationsToLocalStorage();
  });

  socket.emit('getNotifications', id, (data) => {
    notifications.value = [...notifications.value, ...data];
    saveNotificationsToLocalStorage();
  });

  socket.on('testBirthdayResponse', (message) => {
    notifications.value.push(message);
    saveNotificationsToLocalStorage();
  });
});


const sendTestNotification = () => {
  socket.emit('sendNotification', "Ish vaqting tugadi!");
};

const checkBirthday = () => {
  socket.emit('testBirthdayCheck');
};

const toggleOptions = (index) => {
  showOptions.value = showOptions.value === index ? null : index;
};

const confirmDelete = (index) => {
  notificationToDelete.value = index;
  showModal.value = true;
  showOptions.value = null;
};

const deleteNotification = () => {
  if (notificationToDelete.value !== null) {
    notifications.value.splice(notificationToDelete.value, 1);
    saveNotificationsToLocalStorage();
  }
  showModal.value = false;
};

onBeforeUnmount(() => {
  socket.disconnect();
});
</script>

<style scoped>
.notification {
  border: 3px solid blue;
  border-bottom-right-radius: 10px;
  border-top-right-radius: 10px;
  padding: 16px 10px;
  font-size: 18px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: black;
}

.options-menu {
  position: absolute;
  right: 10px;
  z-index: 1110;
  top: 46px;
  background: #1e5db0;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  padding: 5px;
  display: flex;
  flex-direction: column;
}

.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}
</style>

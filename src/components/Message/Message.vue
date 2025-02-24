<script setup>
import { ref, onMounted, onUnmounted, nextTick, inject, watch, computed } from "vue";
import { getMessages, sendMessage, updateMessage, onNewMessage, markAsRead } from "./messageService";
import moment from "moment";
import { useRoute } from "vue-router";
import axios from "axios";
import { URL } from "@/auth/url.js";
import { Socket } from "socket.io-client";
import router from "@/router";

const messages = ref([]);
const newMessage = ref("");
const editingMessage = ref(null);
const editedContent = ref("");
const showModal = ref(false);
const replyTo = ref(null);
const selectedFile = ref(null);
const recording = ref(false);
const mediaRecorder = ref(null);
const audioChunks = ref([]);
const admins = ref([]);
const route = useRoute();
const senderId = parseInt(route.params.id);
const isClicked = ref(false);
const recordingTime = ref(0);
let recordingInterval = null;
const dat = inject('dat');
const translitMap = {
  "ch": "ч", "sh": "ш", "yo": "ё", "yu": "ю", "ya": "я", "ye": "е", "oʻ": "ў", "g‘": "ғ",
  "a": "а", "b": "б", "d": "д", "e": "э", "f": "ф", "g": "г", "h": "ҳ", "i": "и", "j": "ж",
  "k": "к", "l": "л", "m": "м", "n": "н", "o": "о", "p": "п", "q": "қ", "r": "р", "s": "с",
  "t": "т", "u": "у", "v": "в", "x": "х", "y": "й", "z": "з", "'": "ъ"
};

const latinToCyrillic = (text) => {
  let result = text;

  const sortedKeys = Object.keys(translitMap).sort((a, b) => b.length - a.length);

  sortedKeys.forEach((key) => {
    const regex = new RegExp(key, 'gi'); // Match case-insensitively
    result = result.replace(regex, translitMap[key]);
  });

  return result;
};
const translitMapReverse = {
  "ч": "ch", "ш": "sh", "ё": "yo", "ю": "yu", "я": "ya", "е": "ye", "ў": "oʻ", "ғ": "g‘",
  "а": "a", "б": "b", "д": "d", "э": "e", "ф": "f", "г": "g", "ҳ": "h", "и": "i", "ж": "j",
  "к": "k", "л": "l", "м": "m", "н": "n", "о": "o", "п": "p", "қ": "q", "р": "r", "с": "s",
  "т": "t", "у": "u", "в": "v", "х": "x", "й": "y", "з": "z", "ъ": "'"
};

const cyrillicToLatin = (text) => {
  let result = text;

  // Sort keys by length in descending order to match multi-character strings first
  const sortedKeys = Object.keys(translitMapReverse).sort((a, b) => b.length - a.length);

  sortedKeys.forEach((key) => {
    const regex = new RegExp(key, 'gi'); // Match case-insensitively
    result = result.replace(regex, translitMapReverse[key]);
  });

  return result;
};

const formattedRecordingTime = computed(() => {
  let minutes = Math.floor(recordingTime.value / 60);
  let seconds = recordingTime.value % 60;
  let milliseconds = Math.floor((performance.now() % 1000) / 100);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
});

const loadMessages = async () => {
  messages.value = await getMessages();

  // Check for the data type and convert accordingly
  if (dat.value === 'datakril') {
    // Convert messages to Cyrillic if 'datakril' is selected
    messages.value = messages.value.map(msg => {
      msg.content = latinToCyrillic(msg.content);
      return msg;
    });
  } else if (dat.value === 'datalotin') {
    // Convert messages to Latin if 'datalotin' is selected
    messages.value = messages.value.map(msg => {
      msg.content = cyrillicToLatin(msg.content);
      return msg;
    });
  }

  await nextTick();
  window.scrollTo(0, document.body.scrollHeight);
};

const handleFileUpload = (event) => {
  selectedFile.value = event.target.files[0];
  handleSendMessage("file");
};

const isReady = async () => {
  markAsRead(senderId);
};

const getData = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${URL}/admin`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    admins.value = response.data.filter(item => item.type === "active");
    if (dat.value === 'datakril') {
      admins.value = admins.value.map(admin => {
        admin.name = latinToCyrillic(admin.name);
        admin.surname = latinToCyrillic(admin.surname);
        admin.lavozimi = latinToCyrillic(admin.lavozimi); // Convert lavozimi to Cyrillic
        return admin;
      });
    } else if (dat.value === 'datalotin') {
      admins.value = admins.value.map(admin => {
        admin.name = cyrillicToLatin(admin.name);
        admin.surname = cyrillicToLatin(admin.surname);
        admin.lavozimi = cyrillicToLatin(admin.lavozimi); // Convert lavozimi to Latin
        return admin;
      });
    }
    await nextTick();
  } catch (error) {
    console.error("Xatolik:", error);
  }
};
const getyuristData = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${URL}/yurists`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    admins.value = response.data.filter(item => item.type === "active");
    if (dat.value === 'datakril') {
      admins.value = admins.value.map(admin => {
        admin.name = latinToCyrillic(admin.name);
        admin.surname = latinToCyrillic(admin.surname);
        admin.lavozimi = latinToCyrillic(admin.lavozimi); // Convert lavozimi to Cyrillic
        return admin;
      });
    } else if (dat.value === 'datalotin') {
      admins.value = admins.value.map(admin => {
        admin.name = cyrillicToLatin(admin.name);
        admin.surname = cyrillicToLatin(admin.surname);
        admin.lavozimi = cyrillicToLatin(admin.lavozimi); // Convert lavozimi to Latin
        return admin;
      });
    }
    await nextTick();
  } catch (error) {
    console.error("Xatolik:", error);
  }
};
const getbigAdminData = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${URL}/bigAdmin`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    admins.value = response.data.filter(item => item.type === "active");
    if (dat.value === 'datakril') {
      admins.value = admins.value.map(admin => {
        admin.name = latinToCyrillic(admin.name);
        admin.surname = latinToCyrillic(admin.surname);
        admin.lavozimi = latinToCyrillic(admin.lavozimi); // Convert lavozimi to Cyrillic
        return admin;
      });
    } else if (dat.value === 'datalotin') {
      admins.value = admins.value.map(admin => {
        admin.name = cyrillicToLatin(admin.name);
        admin.surname = cyrillicToLatin(admin.surname);
        admin.lavozimi = cyrillicToLatin(admin.lavozimi); // Convert lavozimi to Latin
        return admin;
      });
    }
    await nextTick();
  } catch (error) {
    console.error("Xatolik:", error);
  }
};
const getasdData = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${URL}/admin`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    admins.value = response.data.filter(item => item.type === "active");
    if (dat.value === 'datakril') {
      admins.value = admins.value.map(admin => {
        admin.name = latinToCyrillic(admin.name);
        admin.surname = latinToCyrillic(admin.surname);
        admin.lavozimi = latinToCyrillic(admin.lavozimi); // Convert lavozimi to Cyrillic
        return admin;
      });
    } else if (dat.value === 'datalotin') {
      admins.value = admins.value.map(admin => {
        admin.name = cyrillicToLatin(admin.name);
        admin.surname = cyrillicToLatin(admin.surname);
        admin.lavozimi = cyrillicToLatin(admin.lavozimi); // Convert lavozimi to Latin
        return admin;
      });
    }
    await nextTick();
  } catch (error) {
    console.error("Xatolik:", error);
  }
};

const handleSendMessage = async (type) => {
  if (type === "text" && !newMessage.value.trim()) return;

  let messageData;
  if (type === "text") {
    // Convert message based on selected `dat` value
    if (dat.value === 'datakril') {
      const cyrillicMessage = latinToCyrillic(newMessage.value.trim());
      messageData = {
        senderId,
        content: cyrillicMessage,
        replyTo: replyTo.value?.id || null,
        fileType: null,
        attachmentUrl: null,
      };
    } else if (dat.value === 'datalotin') {
      const latinMessage = newMessage.value.trim();
      messageData = {
        senderId,
        content: latinMessage,
        replyTo: replyTo.value?.id || null,
        fileType: null,
        attachmentUrl: null,
      };
    }
    newMessage.value = "";
    replyTo.value = null;
  } else if ((type === "file" || type === "audio") && selectedFile.value) {
    const formData = new FormData();
    formData.append("senderId", senderId);
    formData.append("file", selectedFile.value);
    formData.append("fileType", type);
    messageData = formData;
  } else {
    return;
  }

  try {
    const response = await fetch(`${URL}/messages`, {
      method: "POST",
      body: messageData instanceof FormData ? messageData : JSON.stringify(messageData),
      headers: messageData instanceof FormData ? {} : { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Xabar jo‘natishda xatolik yuz berdi!");
    const savedMessage = await response.json();
    messages.value.push(savedMessage);
    await nextTick();
    window.scrollTo(0, document.body.scrollHeight);
  } catch (error) {
    console.error("Xatolik:", error);
  }
};


const startRecording = async () => {
  try {
    if (recording.value) {
      mediaRecorder.value.stop();
      isClicked.value = false
      return;
    }

    recording.value = true;
    recordingTime.value = 0;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.value = new MediaRecorder(stream);
    audioChunks.value = [];

    mediaRecorder.value.ondataavailable = (event) => {
      if (event.data.size > 0) audioChunks.value.push(event.data);
    };

    mediaRecorder.value.onstop = async () => {
      recording.value = false;
      clearInterval(recordingInterval);
      recordingTime.value = 0;

      if (audioChunks.value.length > 0) {
        const audioBlob = new Blob(audioChunks.value, { type: "audio/mpeg" });
        selectedFile.value = new File([audioBlob], `audio-${Date.now()}.mp3`, { type: "audio/mpeg" });
        handleSendMessage("audio");
      }
    };
    isClicked.value = true
    mediaRecorder.value.start();
    recordingInterval = setInterval(() => {
      recordingTime.value++;
    }, 1000);

    setTimeout(() => {
      if (recording.value) {
        mediaRecorder.value.stop();
        isClicked.value = false
      }
    }, 180000);
  } catch (error) {
    console.error("Ovoz yozishda xatolik:", error);
  }
};

const handleNewMessage = (message) => {
  messages.value.push(message);
  nextTick().then(() => window.scrollTo(0, document.body.scrollHeight));
};

onMounted(() => {
  isReady();
  loadMessages();
  onNewMessage(handleNewMessage);
  getData();
});

watch(dat, (newDatValue) => {
  if (newDatValue === 'datakril') {
    messages.value = messages.value.map(msg => {
      msg.content = latinToCyrillic(msg.content);
      return msg;
    });
    getData()
  } else if (newDatValue === 'datalotin') {
    messages.value = messages.value.map(msg => {
      msg.content = cyrillicToLatin(msg.content);
      return msg;
    });
    getData()
  } else {
    loadMessages();
  }
});

onUnmounted(() => {
  Socket.off("newMessage", handleNewMessage);
  clearInterval(recordingInterval);
});

const getMessageImageUrl = (img) => img ? `${URL}${img}` : "/default-avatar.png";
const getImageUrl = (img) => img ? `${URL}/upload/${img}` : "/default-avatar.png";
const isOwnMessage = (msg) => msg.senderId === senderId;
</script>

<template>
  <div id="asda" class="w-[1111111124px] -ml-4 top-[200px] h-[100vh] fixed border-4 rounded-xl border-[#ffcc00]">
  </div>
  <div id="img" class="relative flex justify-between mb-28">
    <div class="w-[990px] flex flex-col items-center justify-center p-4">
      <div class="w-full p-4 space-y-4">
        <template v-for="(msg, index) in messages" :key="index">
          <div :class="['flex', isOwnMessage(msg) ? 'justify-end' : 'justify-start']">
            <div class="flex items-start max-w-[80%] space-x-2">
              <div v-if="!isOwnMessage(msg)" class="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0">
                <img v-if="msg.sender?.img" :src="getImageUrl(msg.sender.img)" class="w-full h-full rounded-full" />
              </div>
              <div class="flex flex-col space-y-1">
                <div v-if="!isOwnMessage(msg)" class="flex items-center space-x-2">
                  <span class="font-medium text-gray-900">{{ msg.sender?.name || 'Anonim' }} {{ msg.sender.surname }} {{
                    msg.sender.lavozimi }}</span>
                </div>
                <div
                  :class="['rounded-3xl px-4 py-2 max-w-sm', isOwnMessage(msg) ? 'bg-blue-500  hover:bg-lime-500 duration-800 border-2 rounded-br-none text-white' : 'bg-gray-500 text-white hover:bg-lime-500 duration-800  vorder-2  rounded-bl-none']">
                  <div v-if="msg.replyTo" class="text-xs text-gray-300 italic">
                    Replying to: "{{ msg.replyTo.content }}"
                  </div>
                  {{ msg.content }}

                  <div v-if="msg.fileType === 'file'" class="border p-2">
                    <img :src="`${getMessageImageUrl(msg.attachmentUrl)}`" class="w-40 h-auto rounded-lg" />
                  </div>

                  <div v-if="msg.fileType === 'audio'">
                    <audio controls>
                      <source :src="`${getMessageImageUrl(msg.attachmentUrl)}`" type="audio/wav" />
                    </audio>
                  </div>
                </div>
                <div v-if="isOwnMessage(msg)" class="text-xs text-gray-500 flex space-x-2">
                  <button @click="startEditing(msg)" class="text-blue-500">tahrirlash</button>
                </div>
                <div class="text-xs text-gray-500 flex space-x-2">
                  <button @click="replyTo = msg" class="text-green-500">reply</button> <!-- Reply tugmasi -->
                  {{ moment(msg.createdAt).format("HH:mm") }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div
        class="fixed bottom-4 w-[990px] bg-gray-300 shadow-md px-3 py-8 flex rounded-3xl items-center border-gray-300">
        <div v-if="recording" class="w-[990px] flex items-center justify-between">
          <div class="flex items-center">
            <div class="w-5 h-5 bg-red-700 rounded-full mr-3 animate-pulse"></div>
            <span class="flex-1 text-black text-lg font-mono">
              00:{{ formattedRecordingTime }}
            </span>
          </div>
          <button @click="startRecording"
            class="text-red-600 rounded-xl border-4 px-2 duration-500 font-semibold text-[20px] hover:text-red-700">
            Bekor qilish
          </button>
          <button @click="startRecording" :class="{ 'animate-bounce bg-white': isClicked, 'bg-gray-300': !isClicked }"
            class="thover:bg-blue-500 p-2 active:animate-pulse rounded-full duration-500 text-xl">
            <img src="../../../public/arrow.png" width="50px" alt="">
          </button>
        </div>
        <template v-else>
          <label class="cursor-pointer text-[30px] p-2">
            <img src="../../../public/attach-file.png" width="40px" alt="">
            <input type="file" @change="handleFileUpload" class="hidden" />
          </label>
          <input type="text" v-model="newMessage" :placeholder="$t('yozish')"
            class="flex-1 border border-gray-300 rounded-full text-black px-4 py-4 mx-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            @keypress.enter="handleSendMessage('text')" />

          <button @click="handleSendMessage('text')" class="text-blue-500 text-[40px] ml-2">➤</button>

          <button @click="startRecording"
            :class="{ 'animate-bounce bg-blue-500': isClicked, 'bg-gray-300': !isClicked }"
            class="text-red-500 hover:bg-blue-500 p-2 active:animate-pulse rounded-full duration-500 text-xl">
            <img src="../../../public/microfon.png" width="50px" alt="">
          </button>
        </template>
      </div>
    </div>
    <div
      class="bg-blue-800 border-[5px] border-[#ffcc00] rounded-xl mt-[200px] fixed top-0 right-0 h-[100vh] overflow-y-auto w-[460px]">
      <div v-for="(item, index) in admins"
        class="bg-white m-3 flex items-center hover:bg-lime-500 duration-300 border-4 rounded-xl border-[#ffcc00] p-3"
        :key="index">
        <h1 class="text-black text-[20px] font-bold mr-2">{{ index + 1 }}</h1>
        <div class="w-16 h-16 mr-2 flex-shrink-0 rounded-full overflow-hidden border border-gray-300">
          <img :src="getImageUrl(item.img)" class="w-full h-full object-cover" alt="Admin Image" />
        </div>
        <div>
          <h1 class=" text-[18px] capitalize text-black">{{ item.name }} {{ item.surname }}
          </h1>
          <span class="text-gray-700 capitalize text-[14px]">{{ item.lavozimi }}</span>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-80">
      <h2 class="text-lg text-black font-bold mb-4">Xabarni tahrirlash</h2>
      <input v-model="editedContent" class="w-full border-2 text-black rounded px-2 py-1 mb-4" />
      <div class="flex justify-end space-x-2">
        <button @click="handleUpdateMessage" class="bg-blue-500 text-white w-full px-4 py-2 rounded">Saqlash</button>
        <button @click="showModal = false" class="bg-red-500 text-white px-4 py-2 w-full rounded">Bekor qilish</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
#img {
  background-image: url(../../../public/logo.png);
  background-size: 650px;
  background-position-x: center;
  background-position-y: 200px;
  background-attachment: fixed;
  background-repeat: no-repeat;
}

#asda {
  background-color: rgb(220, 220, 220);
}
</style>
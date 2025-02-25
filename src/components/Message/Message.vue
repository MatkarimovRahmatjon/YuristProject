<template>
  <div id="asda" class="w-[1111111124px] -ml-4 top-[200px] h-[100vh] fixed border-4 rounded-xl border-[#ffcc00]"></div>
  <div id="img" class="relative flex justify-between mb-28">
    <div class="w-[990px] flex flex-col items-center justify-center p-4">
      <div class="w-full p-4 space-y-4">
        <template v-for="(msg, index) in messages" :key="index">
          <div :class="['flex', isOwnMessage(msg) ? 'justify-end' : 'justify-start']">
            <div class="flex items-start max-w-[80%] space-x-2">
              <div v-if="!isOwnMessage(msg)" class="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0">
                <img v-if="msg.sender?.img" :src="getImageUrl(msg.sender.img)" class="w-full h-full rounded-full"/>
              </div>
              <div class="flex flex-col space-y-1">
                <div v-if="!isOwnMessage(msg) && msg.sender" class="flex items-center space-x-2">
                  <span class="font-medium text-gray-900">
                    {{ msg.sender?.name || 'Anonim' }} {{ msg.sender?.surname }} {{ msg.sender?.lavozimi }}
                  </span>
                </div>
                <div
                    :class="['rounded-3xl px-4 py-2 max-w-sm', isOwnMessage(msg) ? 'bg-blue-500 hover:bg-lime-500 duration-800 border-2 rounded-br-none text-white' : 'bg-gray-500 text-white hover:bg-lime-500 duration-800 border-2 rounded-bl-none']">
                  <div v-if="msg.replyTo" class="text-xs text-gray-300 italic">
                    Replying to: "{{ msg.replyTo.content }}"
                  </div>
                  {{ msg.content }}
                  <div v-if="msg.fileType === 'file'" class="border p-2">
                    <img :src="getMessageImageUrl(msg.attachmentUrl)" class="w-40 h-auto rounded-lg"/>
                  </div>
                  <div v-if="msg.fileType === 'audio'">
                    <audio controls>
                      <source :src="getMessageImageUrl(msg.attachmentUrl)" type="audio/mpeg"/>
                    </audio>
                  </div>
                </div>
                <div v-if="isOwnMessage(msg)" class="text-xs text-gray-500 flex space-x-2">
                  <button @click="startEditing(msg)" class="text-blue-500">tahrirlash</button>
                </div>
                <div class="text-xs text-gray-500 flex space-x-2">
                  <button @click="handleReply(msg)" class="text-green-500">reply</button>
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
                  class="hover:bg-blue-500 p-2 active:animate-pulse rounded-full duration-500 text-xl">
            <img src="../../../public/arrow.png" width="50px" alt="send">
          </button>
        </div>
        <template v-else>
          <img width="50" @click="openEmojiPicker" src="https://img.icons8.com/parakeet-line/96/happy.png" alt="happy"/>
          <label class="cursor-pointer text-[30px] p-2">
            <img src="../../../public/attach-file.png" width="40px" alt="attach">
            <input type="file" @change="handleFileUpload" class="hidden"/>
          </label>
          <input type="text" v-model="newMessage" :placeholder="$t('yozish')"
                 class="flex-1 border border-gray-300 rounded-full text-black px-4 py-4 mx-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                 @keypress.enter="handleSendMessage('text')"/>
          <button @click="handleSendMessage('text')" class="text-blue-500 text-[40px] ml-2">➤</button>
          <button @click="startRecording"
                  :class="{ 'animate-bounce bg-blue-500': isClicked, 'bg-gray-300': !isClicked }"
                  class="text-red-500 hover:bg-blue-500 p-2 active:animate-pulse rounded-full duration-500 text-xl">
            <img src="../../../public/microfon.png" width="50px" alt="mic">
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
          <img :src="getImageUrl(item.img)" class="w-full h-full object-cover" alt="Admin Image"/>
        </div>
        <div>
          <h1 class="text-[18px] capitalize text-black">{{ item.name }} {{ item.surname }}</h1>
          <span class="text-gray-700 capitalize text-[14px]">{{ item.lavozimi }}</span>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-80">
      <h2 class="text-lg text-black font-bold mb-4">Xabarni tahrirlash</h2>
      <input v-model="editedContent" class="w-full border-2 text-black rounded px-2 py-1 mb-4"/>
      <div class="flex justify-end space-x-2">
        <button @click="handleUpdateMessage" class="bg-blue-500 text-white w-full px-4 py-2 rounded">Saqlash</button>
        <button @click="showModal = false" class="bg-red-500 text-white px-4 py-2 w-full rounded">Bekor qilish</button>
      </div>
    </div>
  </div>
  <div v-if="showEmojiPicker" class="fixed bottom-[160px] flex gap-2 flex-wrap w-full z-50 bg-gray-500 p-6">
    <div v-for="item in smileys" :key="item.id">
      <img width="90px" @click="handleSmile('file',item.filePath)" class="block"
           :src="getSmileyUrl(item.filePath)"/>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, inject, watch, computed } from "vue";
import { getMessages, sendMessage, updateMessage, onNewMessage, markAsRead, socket } from "./messageService";
import moment from "moment";
import { useRoute } from "vue-router";
import axios from "axios";
import { URL } from "@/auth/url.js";

const showEmojiPicker = ref(false);
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
const smileys = ref([]);

const translitMap = {
  "ch": "ч", "sh": "ш", "yo": "ё", "yu": "ю", "ya": "я", "ye": "е", "oʻ": "ў", "g‘": "ғ",
  "a": "а", "b": "б", "d": "д", "e": "э", "f": "ф", "g": "г", "h": "ҳ", "i": "и", "j": "ж",
  "k": "к", "l": "л", "m": "м", "n": "н", "o": "о", "p": "п", "q": "қ", "r": "р", "s": "с",
  "t": "т", "u": "у", "v": "в", "x": "х", "y": "й", "z": "з", "'": "ъ"
};

const translitMapReverse = {
  "ч": "ch", "ш": "sh", "ё": "yo", "ю": "yu", "я": "ya", "е": "ye", "ў": "oʻ", "ғ": "g‘",
  "а": "a", "б": "b", "д": "d", "э": "e", "ф": "f", "г": "g", "ҳ": "h", "и": "i", "ж": "j",
  "к": "k", "л": "l", "м": "м", "н": "n", "о": "o", "п": "p", "қ": "q", "р": "r", "с": "s",
  "т": "t", "у": "u", "в": "v", "х": "x", "й": "y", "з": "z", "ъ": "'"
};

const latinToCyrillic = (text) => {
  let result = text;
  const sortedKeys = Object.keys(translitMap).sort((a, b) => b.length - a.length);
  sortedKeys.forEach((key) => {
    const regex = new RegExp(key, 'gi');
    result = result.replace(regex, translitMap[key]);
  });
  return result;
};

const cyrillicToLatin = (text) => {
  let result = text;
  const sortedKeys = Object.keys(translitMapReverse).sort((a, b) => b.length - a.length);
  sortedKeys.forEach((key) => {
    const regex = new RegExp(key, 'gi');
    result = result.replace(regex, translitMapReverse[key]);
  });
  return result;
};

const formattedRecordingTime = computed(() => {
  let minutes = Math.floor(recordingTime.value / 60);
  let seconds = recordingTime.value % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
});

const loadMessages = async () => {
  messages.value = await getMessages();
  if (dat.value === 'datakril') {
    messages.value = messages.value.map(msg => ({
      ...msg,
      content: latinToCyrillic(msg.content)
    }));
  } else if (dat.value === 'datalotin') {
    messages.value = messages.value.map(msg => ({
      ...msg,
      content: cyrillicToLatin(msg.content)
    }));
  }
  await nextTick();
  window.scrollTo(0, document.body.scrollHeight);
};

const getData = async () => {
  try {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const [adminRes, yuristRes, managerRes] = await Promise.all([
      axios.get(`${URL}/admin`, config),
      axios.get(`${URL}/yurist`, config),
      axios.get(`${URL}/manager`, config),
    ]);

    admins.value = [...adminRes.data, ...yuristRes.data, ...managerRes.data]
      .filter(item => item.type === "active");

    if (dat.value === "datakril") {
      admins.value = admins.value.map(admin => ({
        ...admin,
        name: latinToCyrillic(admin.name),
        surname: latinToCyrillic(admin.surname),
        lavozimi: latinToCyrillic(admin.lavozimi)
      }));
    } else if (dat.value === "datalotin") {
      admins.value = admins.value.map(admin => ({
        ...admin,
        name: cyrillicToLatin(admin.name),
        surname: cyrillicToLatin(admin.surname),
        lavozimi: cyrillicToLatin(admin.lavozimi)
      }));
    }
  } catch (error) {
    console.error("Xatolik:", error);
  }
};

const handleSendMessage = async (type) => {
  if (type === "text" && !newMessage.value.trim()) return;
  let messageData;
  if (type === "text") {
    const content = dat.value === 'datakril' ? latinToCyrillic(newMessage.value.trim()) : newMessage.value.trim();
    messageData = {
      senderId,
      content,
      replyTo: replyTo.value?.id || null,
      fileType: null,
      attachmentUrl: null,
    };
    newMessage.value = "";
    replyTo.value = null;
  } else if ((type === "file" || type === "audio") && selectedFile.value) {
    const formData = new FormData();
    formData.append("senderId", senderId);
    formData.append("file", selectedFile.value);
    formData.append("fileType", type);
    messageData = formData;
    selectedFile.value = null;
  } else {
    return;
  }

  try {
    const response = await fetch(`${URL}/messages`, {
      method: "POST",
      body: messageData instanceof FormData ? messageData : JSON.stringify(messageData),
      headers: messageData instanceof FormData ? {} : { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Xabar jo‘natishda xatolik!");
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
      if (mediaRecorder.value) {
        mediaRecorder.value.stop();
        mediaRecorder.value.stream.getTracks().forEach(track => track.stop());
      }
      isClicked.value = false;
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
        await handleSendMessage("audio");
      }
    };

    isClicked.value = true;
    mediaRecorder.value.start();
    recordingInterval = setInterval(() => recordingTime.value++, 1000);
    setTimeout(() => {
      if (recording.value) startRecording();
    }, 180000);
  } catch (error) {
    console.error("Ovoz yozishda xatolik:", error);
    recording.value = false;
    clearInterval(recordingInterval);
  }
};

const handleNewMessage = (message) => {
  messages.value.push(message);
  nextTick(() => window.scrollTo(0, document.body.scrollHeight));
};

const fetchSmileys = async () => {
  try {
    const response = await axios.get(`${URL}/smileys`);
    smileys.value = response.data;
  } catch (error) {
    console.error('Smileylarni yuklashda xatolik:', error);
  }
};

const startEditing = (msg) => {
  editingMessage.value = msg;
  editedContent.value = msg.content;
  showModal.value = true;
};

const handleUpdateMessage = async () => {
  if (!editingMessage.value || !editedContent.value.trim()) return;
  try {
    const updatedMessage = await updateMessage(editingMessage.value.id, {
      content: dat.value === 'datakril' ? latinToCyrillic(editedContent.value) : editedContent.value
    });
    const index = messages.value.findIndex(m => m.id === editingMessage.value.id);
    if (index !== -1) messages.value[index] = updatedMessage;
    showModal.value = false;
    editingMessage.value = null;
    editedContent.value = "";
  } catch (error) {
    console.error("Xabarni yangilashda xatolik:", error);
  }
};

const handleReply = (msg) => {
  replyTo.value = msg;
  nextTick(() => {
    const input = document.querySelector('input[type="text"]');
    if (input) input.focus();
  });
};

const openEmojiPicker = () => {
  showEmojiPicker.value = true;
};

const handleFileUpload = (event) => {
  if (event.target.files && event.target.files[0]) {
    selectedFile.value = event.target.files[0];
    handleSendMessage("file");
  }
};

const handleSmile = async (type, filePath, senderId) => {
  const formData = new FormData();
  formData.append("senderId", senderId);
  formData.append("fileType", type);

  // Faylni yuklash uchun
  const response = await fetch(filePath);
  const blob = await response.blob();
  const file = new File([blob], filePath.split('/').pop(), { type: blob.type });
  formData.append("file", file);

  try {
    const uploadResponse = await fetch(`${URL}/messages`, {
      method: "POST",
      body: formData,
    });
    const data = await uploadResponse.json();
    console.log(data);
  } catch (error) {
    console.error("Xatolik yuz berdi:", error);
  }
};
const isOwnMessage = (msg) => msg.senderId === senderId;
const getMessageImageUrl = (img) => img ? `${URL}${img}` : "/default-avatar.png";
const getImageUrl = (img) => img ? `${URL}/upload/${img}` : "/default-avatar.png";
const getSmileyUrl = (img) => img ? `${URL}/${img}` : "/default-avatar.png";

onMounted(() => {
  markAsRead(senderId);
  loadMessages();
  onNewMessage(handleNewMessage);
  getData();
  fetchSmileys();
});

watch(dat, (newDatValue) => {
  if (newDatValue === 'datakril') {
    messages.value = messages.value.map(msg => ({
      ...msg,
      content: latinToCyrillic(msg.content)
    }));
    getData();
  } else if (newDatValue === 'datalotin') {
    messages.value = messages.value.map(msg => ({
      ...msg,
      content: cyrillicToLatin(msg.content)
    }));
    getData();
  } else {
    loadMessages();
  }
});

onUnmounted(() => {
  socket.off("newMessage", handleNewMessage);
  clearInterval(recordingInterval);
  if (mediaRecorder.value?.stream) {
    mediaRecorder.value.stream.getTracks().forEach(track => track.stop());
  }
});
</script>
<template>
  <div id="asda" class="w-[1111111124px] -ml-4 top-[200px] h-[100vh] fixed border-4 rounded-xl border-[#ffcc00]"></div>
  <div id="img" class="relative flex justify-between mb-28">
    <div class="w-full mr-[460px] flex flex-col items-center justify-center p-4">
      <div ref="messagesContainer" class="w-full p-4 space-y-4">
        <template v-for="(msg, index) in messages" :key="index">
          <div :ref="el => messageRefs[msg.id] = el"
            :class="['flex', isOwnMessage(msg) ? 'justify-end' : 'justify-start']"
            @contextmenu.prevent="showContextMenu($event, msg)">
            <div class="flex items-start max-w-[80%] space-x-2">
              <div v-if="!isOwnMessage(msg)" class="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0">
                <img v-if="msg.sender?.img" :src="getImageUrl(msg.sender.img)" class="w-full h-full rounded-full" />
              </div>
              <div class="flex flex-col space-y-1">
                <div v-if="!isOwnMessage(msg) && msg.sender" class="flex items-center space-x-2">
                  <span class="font-medium text-gray-900">
                    {{ dat === 'datalotin' ? `${msg.sender?.name} ${msg.sender?.surname} ${msg.sender?.lavozimi}` :
                      `${latinToCyrillic(msg.sender?.name)} ${latinToCyrillic(msg.sender?.surname)}
                    ${latinToCyrillic(msg.sender?.lavozimi)}` }}
                  </span>
                </div>
                <div :class="[
                  'rounded-3xl px-3 py-3 max-w-sm',
                  isOwnMessage(msg) ? 'bg-blue-500 hover:bg-lime-500 border-2 rounded-br-none text-white' : 'bg-gray-500 hover:bg-lime-500 border-2 rounded-bl-none text-white'
                ]">
                  <div v-if="msg.replyToMessageId" @click="scrollToRepliedMessage(msg.replyToMessageId)"
                    class="border-l-2 rounded-tr-md rounded-tl-sm rounded-bl-sm rounded-br-md p-2 bg-black bg-opacity-[25%] cursor-pointer">
                    <p v-if="replyMessages[msg.replyToMessageId]?.content">{{
                      replyMessages[msg.replyToMessageId]?.content }}</p>
                    <img v-else-if="isImage(replyMessages[msg.replyToMessageId]?.attachmentUrl)"
                      :src="URL + replyMessages[msg.replyToMessageId]?.attachmentUrl" class="w-24 h-24 rounded-md p-2">
                    <div v-else-if="replyMessages[msg.replyToMessageId]?.attachmentUrl?.endsWith('.mp3')">{{ $t('media')
                      }}</div>
                    <div v-else-if="replyMessages[msg.replyToMessageId]?.attachmentUrl?.endsWith('.pdf')"
                      class="text-red-500 underline">{{ $t('pdf') }}</div>
                    <div v-else-if="replyMessages[msg.replyToMessageId]?.attachmentUrl?.match(/\.(doc|docx)$/i)"
                      class="text-blue-500 underline">{{ $t('word') }}</div>
                    <div v-else-if="replyMessages[msg.replyToMessageId]?.attachmentUrl" class="">{{ $t('file') }}</div>
                    <img v-else-if="replyMessages[msg.replyToMessageId]?.smiley"
                      :src="URL + '/' + replyMessages[msg.replyToMessageId]?.smiley" class="w-24 p-1 h-24">
                    <p v-else>{{ $t('nomalum') }}</p>
                  </div>
                  <div class="px-2">{{ msg.content }}</div>
                  <img v-if="msg.fileType === 'smiley'" :src="URL + `/${msg?.smiley.filePath}`"
                    class="w-40 h-auto rounded-lg" />
                  <div v-if="msg.fileType === 'file' && msg.attachmentUrl" class="border p-2 rounded-lg">
                    <img v-if="/\.(jpg|jpeg|png|gif|webp)$/i.test(msg.attachmentUrl)"
                      :src="getMessageImageUrl(msg.attachmentUrl)" class="w-40 h-auto rounded-lg" />
                    <div v-else @click="open(`${URL}${msg.attachmentUrl}`)"
                      class="hover:text-blue-500 text-[17px] flex items-center gap-3">
                      <img src="../../../public/file.png" width="40px" alt="">{{ $t('filelarni') }}
                    </div>
                  </div>
                  <audio v-if="msg.fileType === 'audio'" controls>
                    <source :src="getMessageImageUrl(msg.attachmentUrl)" type="audio/mpeg" />
                  </audio>
                </div>
                <div v-if="isOwnMessage(msg)" class="text-xs text-gray-500 flex space-x-2">
                  <!-- <button @click="startEditing(msg)" class="text-blue-500 mx-2">{{ $t('tahrirlash') }}</button> -->
                  <!-- <button @click="deleteMessage(msg.id)" class="text-red-500 mx-2">{{ $t('remove') }}</button> -->
                </div>
                <div class="text-xs text-gray-500 flex space-x-2">
                  <button @click="handleReply(msg)" class="text-green-500 font-bold mx-2">{{ $t('javob') }}</button>
                  {{ moment(msg.createdAt).format("HH:mm") }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <button v-if="showScrollButton" @click="scrollToBottom"
        class="fixed bottom-[170px] bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600">
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>

      <div class="fixed bottom-4 w-[990px] bg-gray-300 shadow-md px-3 py-8 flex flex-col rounded-3xl">
        <div v-if="replyTo" class="w-full bg-gray-200 p-2 rounded-lg mb-2 flex justify-between items-center">
          <div class="flex items-center space-x-2">
            <span class="text-green-500 font-semibold">{{ $t('javob') }}:</span>
            <div class="text-black">
              {{ replyMessages[replyTo]?.content?.substring(0, 50) + (replyMessages[replyTo]?.content?.length > 50 ?
                '...' :
                '') ||
                replyMessages[replyTo]?.attachmentUrl ? $t('file') :
                replyMessages[replyTo]?.smiley ? $t('smiley') : $t('nomalum') }}
            </div>
          </div>
          <button @click="cancelReply" class="text-red-500 hover:text-red-700">✖</button>
        </div>

        <div v-if="recording" class=" flex items-center justify-between">
          <div class="flex items-center">
            <div class="w-5 h-5 bg-red-700 rounded-full mr-3 animate-pulse"></div>
            <span class="text-black text-lg font-mono">00:{{ formattedRecordingTime }}</span>
          </div>
          <button @click="stopRecording"
            class="text-red-600 rounded-xl border-4 px-2 font-semibold text-[20px] hover:text-red-700">
            {{ $t('Bekor_qilish') }}
          </button>
          <button @click="stopRecording" :class="{ 'animate-bounce bg-white': isClicked, 'bg-gray-300': !isClicked }"
            class="hover:bg-blue-500 p-2 rounded-full">
            <img src="../../../public/arrow.png" width="50px" alt="send">
          </button>
        </div>
        <div v-else class="flex items-center w-full">
          <h1 @click="openEmojiPicker" class="text-[35px]">🙂</h1>
          <label class="cursor-pointer text-[30px] p-2">
            <img src="../../../public/attach-file.png" width="40px" alt="attach">
            <input type="file" @change="handleFileUpload" class="hidden" />
          </label>
          <input v-model="newMessage" :placeholder="$t('yozish')"
            class="flex-1 border border-gray-300 rounded-full text-black px-4 py-4 mx-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            @keypress.enter="handleSendMessage('text')" />
          <button @click="handleSendMessage('text')" class="text-blue-500 text-[40px] ml-2">➤</button>
          <button @click="startRecording"
            :class="{ 'animate-bounce bg-blue-500': isClicked, 'bg-gray-300': !isClicked }"
            class="hover:bg-blue-500 p-2 rounded-full">
            <img src="../../../public/microfon.png" width="50px" alt="mic">
          </button>
        </div>
      </div>
    </div>
  </div>
  <div
    class="bg-blue-800 border-[5px] border-[#ffcc00] rounded-xl mt-[200px] fixed top-0 right-0 h-[100vh] overflow-y-auto w-[460px]">
    <div v-for="(item, index) in admins"
      class="bg-white m-3 flex items-center hover:bg-lime-500 border-4 rounded-xl border-[#ffcc00] p-3" :key="index">
      <h1 class="text-black text-[20px] font-bold mr-2">{{ index + 1 }}</h1>
      <div class="w-16 h-16 mr-2 flex-shrink-0 rounded-full overflow-hidden border border-gray-300">
        <img :src="getImageUrl(item.img)" class="w-full h-full object-cover" alt="Admin Image" />
      </div>
      <div>
        <h1 class="text-[18px] capitalize text-black">{{ item.name }} {{ item.surname }}</h1>
        <span class="text-gray-700 capitalize text-[14px]">{{ item.lavozimi }}</span>
      </div>
    </div>
  </div>

  <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-80">
      <h2 class="text-lg text-black font-bold mb-4">Xabarni tahrirlash</h2>
      <input v-model="editedContent" class="w-full border-2 text-black rounded px-2 py-1 mb-4" />
      <div class="flex justify-end space-x-2">
        <button @click="handleUpdateMessage" class="bg-blue-500 text-white w-full px-4 py-2 rounded">{{ $t('yuklash')
          }}</button>
        <button @click="showModal = false" class="bg-red-500 text-white px-4 py-2 w-full rounded">{{ $t('Bekor_qilish')
          }}</button>
      </div>
    </div>
  </div>

  <div v-if="showDeleteConfirm" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-80">
      <div class="flex justify-end space-x-2">
        <button @click="confirmDelete" class="bg-red-500 text-white w-full px-4 py-2 rounded">{{ $t('remove')
          }}</button>
        <button @click="showDeleteConfirm = false" class="bg-gray-500 text-white px-4 py-2 w-full rounded">{{
          $t('Bekor_qilish') }}</button>
      </div>
    </div>
  </div>

  <div v-if="showContextMenuModal" class="fixed bg-white border rounded-lg shadow-lg p-4 z-50 context-menu"
    :style="{ top: contextMenuY + 'px', left: contextMenuX + 'px' }">
    <button v-if="isOwnMessage(contextMenuMessage)" @click="startEditing(contextMenuMessage)"
      class="block w-full text-left px-2 py-1 text-blue-500 hover:bg-gray-100">{{ $t('tahrirlash') }}</button>
    <button v-if="isOwnMessage(contextMenuMessage)" @click="deleteMessage(contextMenuMessage.id)"
      class="block w-full text-left px-2 py-1 text-red-500 hover:bg-gray-100">{{ $t('remove') }}</button>
    <button @click="handleReply(contextMenuMessage)"
      class="block w-full text-left px-2 py-1 text-green-500 hover:bg-gray-100">{{ $t('javob') }}</button>
    <button @click="closeContextMenu" class="block w-full text-left px-2 py-1 text-gray-500 hover:bg-gray-100">{{
      $t('Bekor_qilish') }}</button>
  </div>

  <div v-if="showEmojiPicker" class="fixed bottom-[160px] flex gap-2 flex-wrap rounded-md z-50 bg-gray-300 p-6">
    <img v-for="item in smileys" :key="item.id" width="90px" @click="handleSendMessage('smiley', item.id)"
      class="block rounded-md" :src="getSmileyUrl(item.filePath)" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, inject, watch, computed } from "vue";
import { getMessages, onNewMessage, markAsRead, socket } from "./messageService";
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
const recordingInterval = ref(null);
const dat = inject('dat');
const smileys = ref([]);
const replyMessages = ref({});
const messageRefs = ref({});
const showDeleteConfirm = ref(false);
const messageToDelete = ref(null);
const showScrollButton = ref(false);
const showContextMenuModal = ref(false);
const contextMenuX = ref(0);
const contextMenuY = ref(0);
const contextMenuMessage = ref(null);

const open = (link) => window.open(link);
const cancelReply = () => replyTo.value = null;
const scrollToBottom = () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
const openEmojiPicker = () => showEmojiPicker.value = !showEmojiPicker.value;
const isOwnMessage = (msg) => msg.senderId === senderId;
const getMessageImageUrl = (img) => img ? `${URL}${img}` : "/default-avatar.png";
const getImageUrl = (img) => img ? `${URL}/upload/${img}` : "/default-avatar.png";
const getSmileyUrl = (img) => img ? `${URL}/${img}` : "/default-avatar.png";
const isImage = (url) => url && /\.(jpg|jpeg|png|gif|webp)$/i.test(url);

const translitMap = {
  "ch": "ч", "sh": "ш", "yo": "ё", "yu": "ю", "ya": "я", "ye": "е", "oʻ": "ў", "g‘": "ғ",
  "a": "а", "b": "б", "d": "д", "e": "э", "f": "ф", "g": "г", "h": "ҳ", "i": "и", "j": "ж",
  "k": "к", "l": "л", "m": "м", "n": "н", "o": "о", "p": "п", "q": "қ", "r": "р", "s": "с",
  "t": "т", "u": "у", "v": "в", "x": "х", "y": "й", "z": "з", "'": "ъ"
};

const latinToCyrillic = (text) => {
  let result = text || '';
  Object.keys(translitMap).sort((a, b) => b.length - a.length).forEach(key => {
    result = result.replace(new RegExp(key, 'gi'), translitMap[key]);
  });
  return result;
};

const formattedRecordingTime = computed(() => {
  const minutes = Math.floor(recordingTime.value / 60);
  const seconds = recordingTime.value % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
});

const loadMessages = async () => {
  messages.value = await getMessages();
  if (dat.value === 'datakril') {
    messages.value = messages.value.map(msg => ({ ...msg, content: latinToCyrillic(msg.content) }));
  }
  await nextTick();
  scrollToBottom();
};

const getData = async () => {
  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const [adminRes, yuristRes, managerRes] = await Promise.all([
    axios.get(`${URL}/admin`, config),
    axios.get(`${URL}/yurist`, config),
    axios.get(`${URL}/manager`, config),
  ]);
  admins.value = [...adminRes.data, ...yuristRes.data, ...managerRes.data].filter(item => item.type === "active");
  if (dat.value === "datakril") {
    admins.value = admins.value.map(admin => ({
      ...admin,
      name: latinToCyrillic(admin.name),
      surname: latinToCyrillic(admin.surname),
      lavozimi: latinToCyrillic(admin.lavozimi)
    }));
  }
};

const handleSendMessage = async (type, smileyId) => {
  if (type === "text" && !newMessage.value.trim()) return;

  let messageData;
  if (type === "text") {
    messageData = {
      senderId,
      content: dat.value === 'datakril' ? latinToCyrillic(newMessage.value.trim()) : newMessage.value.trim(),
      replyToMessageId: replyTo.value || null,
      fileType: null,
      attachmentUrl: null,
      smileyId: smileyId || null,
    };
  } else {
    messageData = new FormData();
    messageData.append("senderId", senderId);
    messageData.append("fileType", type);
    messageData.append("replyToMessageId", replyTo.value || "");
    if (type === "smiley") messageData.append("smileyId", smileyId);
    else if (selectedFile.value) {
      messageData.append("file", selectedFile.value);
    } else {
      console.error("No file to send for type:", type);
      return;
    }
  }

  try {
    const response = await fetch(`${URL}/messages`, {
      method: "POST",
      body: messageData instanceof FormData ? messageData : JSON.stringify(messageData),
      headers: messageData instanceof FormData ? {} : { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error(`Server error: ${response.status}`);
    const savedMessage = await response.json();
    messages.value.push(savedMessage);
    newMessage.value = "";
    replyTo.value = null;
    selectedFile.value = null;
    await nextTick();
    scrollToBottom();
  } catch (error) {
    console.error("Failed to send message:", error);
  }
};

const startRecording = async () => {
  if (recording.value) return; // Prevent multiple starts

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.value = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
    audioChunks.value = [];

    mediaRecorder.value.ondataavailable = (event) => {
      if (event.data.size > 0) audioChunks.value.push(event.data);
    };

    mediaRecorder.value.onstop = async () => {
      if (audioChunks.value.length > 0) {
        const audioBlob = new Blob(audioChunks.value, { type: "audio/mpeg" });
        selectedFile.value = new File([audioBlob], `audio-${Date.now()}.mp3`, { type: "audio/mpeg" });
        await handleSendMessage("audio");
      } else {
        console.error("No audio data recorded.");
      }
      recording.value = false;
      stream.getTracks().forEach(track => track.stop());
    };

    recording.value = true;
    isClicked.value = true;
    recordingTime.value = 0;
    recordingInterval.value = setInterval(() => recordingTime.value++, 1000);
    mediaRecorder.value.start();
  } catch (error) {
    console.error("Failed to start recording:", error);
    recording.value = false;
    isClicked.value = false;
  }
};

const stopRecording = () => {
  if (!recording.value || !mediaRecorder.value) return;

  mediaRecorder.value.stop();
  clearInterval(recordingInterval.value);
  isClicked.value = false;
};

const fetchSmileys = async () => {
  const response = await axios.get(`${URL}/smileys`);
  smileys.value = response.data;
};

const startEditing = (msg) => {
  editingMessage.value = msg.id;
  editedContent.value = msg.content;
  showModal.value = true;
  showContextMenuModal.value = false;
};

const handleUpdateMessage = async () => {
  await axios.put(`${URL}/messages/${editingMessage.value}`, { content: editedContent.value });
  const messageIndex = messages.value.findIndex(msg => msg.id === editingMessage.value);
  messages.value[messageIndex].content = editedContent.value;
  showModal.value = false;
  editingMessage.value = null;
  await nextTick();
  scrollToBottom();
};

const deleteMessage = (messageId) => {
  messageToDelete.value = messageId;
  showDeleteConfirm.value = true;
  showContextMenuModal.value = false;
};

const confirmDelete = async () => {
  await axios.delete(`${URL}/messages/${messageToDelete.value}`);
  messages.value = messages.value.filter(msg => msg.id !== messageToDelete.value);
  showDeleteConfirm.value = false;
  messageToDelete.value = null;
  await nextTick();
  scrollToBottom();
};

const handleReply = (msg) => {
  replyTo.value = msg.id;
  getOneMassage(msg.id);
  showContextMenuModal.value = false;
};

const getOneMassage = async (id) => {
  if (!replyMessages.value[id]) {
    const response = await axios.get(`${URL}/messages/${id}`);
    replyMessages.value[id] = {
      content: response.data.content || null,
      smiley: response.data.smiley?.filePath || null,
      attachmentUrl: response.data.attachmentUrl || null,
      fileType: response.data.fileType || null,
    };
  }
};

const scrollToRepliedMessage = async (replyToMessageId) => {
  if (!messageRefs.value[replyToMessageId]) await getOneMassage(replyToMessageId);
  await nextTick();
  messageRefs.value[replyToMessageId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
};


const handleScroll = () => {
  showScrollButton.value = window.scrollY + window.innerHeight < document.body.scrollHeight - 50;
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const validTypes = ['image/jpeg', 'image/png', 'audio/mpeg', 'application/pdf'];
  if (!validTypes.includes(file.type)) {
    console.error("Unsupported file type:", file.type);
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    console.error("File too large:", file.size);
    return;
  }

  selectedFile.value = file;
  handleSendMessage("file");
};

const showContextMenu = (event, msg) => {
  contextMenuMessage.value = msg;
  contextMenuX.value = event.clientX;
  contextMenuY.value = event.clientY;
  showContextMenuModal.value = true;
};

const closeContextMenu = () => {
  showContextMenuModal.value = false;
  contextMenuMessage.value = null;
};

onMounted(async () => {
  markAsRead(senderId);
  loadMessages();
  onNewMessage((message) => messages.value.push(message) && nextTick(scrollToBottom));
  getData();
  fetchSmileys();
  const response = await axios.get(`${URL}/messages`);
  messages.value = response.data;
  messages.value.forEach(msg => msg.replyToMessageId && getOneMassage(msg.replyToMessageId));
  window.addEventListener('scroll', handleScroll);
  document.addEventListener('click', (e) => !e.target.closest('.context-menu') && closeContextMenu());
});

watch(dat, (newDatValue) => {
  if (newDatValue === 'datakril') {
    messages.value = messages.value.map(msg => ({ ...msg, content: latinToCyrillic(msg.content) }));
    getData();
  } else loadMessages();
});

onUnmounted(() => {
  socket.off("newMessage");
  clearInterval(recordingInterval.value);
  localStorage.removeItem("messageCount");
  mediaRecorder.value?.stream?.getTracks().forEach(track => track.stop());
  window.removeEventListener('scroll', handleScroll);
  document.removeEventListener('click', closeContextMenu);
});

</script>

<style>
#img {
  background: url(../../../public/logo.png) no-repeat fixed 50% 200px;
}

.context-menu {
  min-width: 150px;
}
</style>
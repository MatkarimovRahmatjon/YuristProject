<template>
  <div>
    <button v-if="data === 'manager'" @click="showModal = true"
      class="fixed top-60 right-20 bg-green-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-lime-600 duration-300 transition">
      {{ $t('create') }}
    </button>
    <div class="max-w-[95%] mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
      <div class="flex justify-end">
        <input v-model="searchQuery" type="text" :placeholder="$t('qidiruv')"
        class="mb-4 border-2 p-2 rounded-lg text-black " />
      </div>
      <button v-if="data === 'yurist'" @click="toggleDeleteMode"
        class="bg-blue-500 text-white mb-4 mr-2 px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition">
        {{ deleteMode ? $t('cancel_delete') : $t('enable_delete') }}
      </button>
      <button v-if="deleteMode && selectedFiles.length > 0" @click="deleteSelectedFiles"
        class="bg-red-500 text-white mb-4 px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition">
        {{ $t('remove') }}
      </button>
      <ul class="divide-y divide-gray-300">
        <li v-if="dat === 'datakril'" v-for="(file, index) in filteredFiles" :key="index"
          :class="[index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200', 'flex items-center group border justify-between duration-500 p-2 mb-2 hover:bg-lime-600 transition']">
          <h1 class="text-black w-[870px]">
            {{ translateText(file.User.surname) }} {{ translateText(file.User.name) }} <span
              class="text-[13px] text-black">{{ translateText(file.User.lavozimi)
              }}</span>
            <h1 @click="openFile(file)" class="text-blue-600  cursor-pointer font-semibold hover:underline">
              {{ translateText(file.name) }}
            </h1>
          </h1>
          <span :class="file.status === 'signed' ? 'text-green-600' : 'text-red-600'">
            {{ $t('holat') }}: {{ translateText(getStatusText(file.status)) }}
          </span>
          <button v-if="file.statusReason" @click="qwenn(file.statusReason)"
            class="hidden group-hover:block py-2 px-4 bg-red-500">{{ $t('sababni') }}</button>

          <label v-if="deleteMode" class="flex items-center cursor-pointer space-x-2">
            <input type="checkbox" v-model="selectedFiles" :value="file.id" class="peer hidden">
            <div
              class="w-5 h-5 rounded-md border-2 border-gray-400 flex items-center justify-center peer-checked:bg-green-500 peer-checked:border-green-500 transition">
              <svg v-if="selectedFiles.includes(file.id)" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white"
                viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-3-3a1 1 0 011.414-1.414L9 11.586l6.293-6.293a1 1 0 011.414 0z"
                  clip-rule="evenodd" />
              </svg>
            </div>
          </label>
        </li>
        <li v-if="dat === 'datalotin'" v-for="(file, index) in filteredFiles" :key="index"
          :class="[index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200', 'flex group items-center border justify-between p-2 mb-2 hover:bg-lime-600 transition']">
          <h1 class="text-black w-[870px]">
            {{ file.User.surname }} {{ file.User.name }} <span class="text-[13px] text-black">{{ file.User.lavozimi
            }}</span>
            <h1 @click="openFile(file)" class="text-blue-600  cursor-pointer font-semibold hover:underline">
              {{ file.name }}
            </h1>
          </h1>
          <span :class="file.status === 'signed' ? 'text-green-600' : 'text-red-600'">
            {{ $t('holat') }}: {{ getStatusText(file.status) }}
          </span>
          <button v-if="file.statusReason" @click="qwenn(file.statusReason)"
            class="hidden group-hover:block py-2 px-4 bg-red-500">{{ $t('sababni') }}</button>
          <label v-if="deleteMode" class="flex items-center cursor-pointer space-x-2">
            <input type="checkbox" v-model="selectedFiles" :value="file.id" class="peer hidden">
            <div
              class="w-5 h-5 rounded-md border-2 border-gray-400 flex items-center justify-center peer-checked:bg-green-500 peer-checked:border-green-500 transition">
              <svg v-if="selectedFiles.includes(file?.id)" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white"
                viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-3-3a1 1 0 011.414-1.414L9 11.586l6.293-6.293a1 1 0 011.414 0z"
                  clip-rule="evenodd" />
              </svg>
            </div>
          </label>
        </li>
      </ul>
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div class="bg-white p-6 rounded-lg shadow-lg w-96">
          <h3 class="text-lg font-semibold mb-4">Yangi fayl yuklash</h3>
          <input type="text" v-model="fileName" :placeholder="$t('filename')"
            class="w-full border-2 p-2 text-black rounded-lg mb-3" />
          <input type="file" @change="e => newFile = e.target.files[0]" class="w-full mb-3" />
          <div class="flex justify-between">
            <button @click="showModal = false"
              class="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600 transition">
              {{ $t('Bekor_qilish') }}
            </button>
            <button @click="uploadFile"
              class="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition">
              {{ $t('yuklash') }}
            </button>
          </div>
        </div>
      </div>
      <div v-if="asd" class="bg-gray-100 p-6 z-50 rounded-lg w-[500px] shadow-lg cursor-move" :style="{
        position: 'fixed',
        top: modalPositionAsd.y + 'px',
        left: modalPositionAsd.x + 'px'
      }" @mousedown="startDrag('asd', $event)">
        <h1 class="text-black text-[20px] mb-2">{{ $t('korib_chiqish') }}</h1>
        <input v-model="massage" type="text"
          class="px-4 py-2 border-2 rounded-xl w-full text-black my-2 text-[20px] outline-none"
          :placeholder="$t('sabab')" />
        <div class="flex justify-between px-5">
          <button class="px-4 py-2 bg-red-500 text-[20px] hover:bg-red-600 duration-500 w-[200px] rounded-xl mt-2"
            @click="asd = false">
            {{ $t('Bekor_qilish') }}
          </button>
          <button class="px-4 py-2 bg-lime-500 text-[20px] hover:bg-lime-600 duration-500 w-[200px] rounded-xl mt-2"
            @click="updateeFile('revision')">
            {{ $t('jonatish') }}
          </button>
        </div>
      </div>
      <div v-if="asds" class="bg-gray-100 p-6 z-50 rounded-lg w-[500px] shadow-lg cursor-move" :style="{
        position: 'fixed',
        top: modalPositionAsds.y + 'px',
        left: modalPositionAsds.x + 'px'
      }" @mousedown="startDrag('asds', $event)">
        <h1 class="text-black text-[20px] mb-2">{{ $t('rad_etish') }}</h1>
        <input v-model="massages" type="text"
          class="px-4 py-2 border-2 rounded-xl w-full text-black my-2 text-[20px] outline-none"
          :placeholder="$t('sabab')" />
        <div class="flex justify-between px-5">
          <button class="px-4 py-2 bg-red-500 text-[20px] hover:bg-red-600 duration-500 w-[200px] rounded-xl mt-2"
            @click="asds = false">
            {{ $t('Bekor_qilish') }}
          </button>
          <button class="px-4 py-2 bg-lime-500 text-[20px] hover:bg-lime-600 duration-500 w-[200px] rounded-xl mt-2"
            @click="updateeFile('rejected')">
            {{ $t('jonatish') }}
          </button>
        </div>
      </div>
      <div v-if="showPdfModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
        <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl flex flex-col items-end">
          <div class="flex pb-2 space-x-3">
            <button v-if="data === 'yurist'" @click="updateeFile('signaturePending')"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition">
              {{ $t('Imzolash_uchun_yuborish') }}
            </button>
            <button v-if="data === 'bigAdmin'" @click="updateFile()"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition">
              {{ $t('Imzolash') }}
            </button>
            <button v-if="data === 'bigAdmin' || data === 'yurist'" @click="toggleModal"
              class="bg-yellow-400 text-black px-4 py-2 rounded-lg shadow-md hover:bg-yellow-500 transition">
              {{ $t('Qayta') }}
            </button>
            <button v-if="data === 'bigAdmin' || data === 'yurist'" @click="toggleModas"
              class="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition">
              {{ $t('Rad') }}
            </button>
            <button @click="showPdfModal = false"
              class="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600 transition">
              {{ $t('yopish') }}
            </button>
          </div>
          <iframe :src="pdfUrl" class="w-full h-[600px] border-none"></iframe>
        </div>
      </div>
      <div v-if="qwen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
        <div class="bg-white p-10 relative rounded-lg shadow-lg flex justify-center">
          <img src="../../../../public/reject.png" class="w-[30px] absolute top-2 right-2" @click="qwen = false" alt="">
          <h1 class=" text-black text-[20px] w-[500px] break-words">
            {{ statusReason }}
          </h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject, computed, watch } from 'vue'
import axios from 'axios'
import { URL } from '../../auth/url.js'
import { useRoute } from 'vue-router'
const API_URL = `${URL}/signingFiles`
const selectedFiles = ref([]);
const files = ref([])
const newFile = ref(null)
const fileName = ref('')
const showModal = ref(false)
const showPdfModal = ref(false)
const pdfUrl = ref('')
const selectedFileId = ref(null)
const dat = inject('dat')
const asd = ref(false)
const asds = ref(false)
const massage = ref('')
const massages = ref('')
const deleteMode = ref(false)
const route = useRoute()
const id = ref(parseInt(route.params.id))
const data = ref('')
const userID = ref(parseInt(localStorage.getItem('id')))
const translitMap = {
  "ch": "ч", "sh": "ш", "yo": "ё", "yu": "ю", "ya": "я", "ye": "е", "oʻ": "ў", "g‘": "ғ",
  "a": "а", "b": "б", "d": "д", "e": "э", "f": "ф", "g": "г", "h": "ҳ", "i": "и", "j": "ж",
  "k": "к", "l": "л", "m": "м", "n": "н", "o": "о", "p": "п", "q": "қ", "r": "р", "s": "с",
  "t": "т", "u": "у", "v": "в", "x": "х", "y": "й", "z": "з", "'": "ъ"
}

const getStatusText = (status) => {
  if (status === 'waiting') return 'Kutish';
  if (status === 'signaturePending') return 'Imzo kutulmoqda';
  if (status === 'signed') return 'imzolangan';
  if (status === 'rejected') return 'Rad etilgan';
  if (status === 'revision') return 'Qayta korib chiqish talab etiladi';
  return status;
};
const translateText = (text) => {
  let translated = text.toLowerCase()
  for (const key in translitMap) {
    const regex = new RegExp(key, "g")
    translated = translated.replace(regex, translitMap[key])
  }
  return translated
}
const getdata = async () => {
  try {
    const response = await axios.get(`${URL}/admin/${userID.value}`)
    data.value = response.data.role

  } catch (error) {
    console.error('Fayllarni olishda xatolik:', error)
  }
}
const qwen = ref(false)
const statusReason = ref('')
const searchQuery = ref('')
const filteredFiles = computed(() => {
  if (!searchQuery.value) {
    return files.value;
  }
  const query = searchQuery.value.toLowerCase();
  return files.value.filter(file =>
    file.name.toLowerCase().includes(query) ||
    file.User.name.toLowerCase().includes(query) ||
    file.User.surname.toLowerCase().includes(query)
  );
});


function qwenn(file) {
  statusReason.value = file
  qwen.value = !qwen.value
}


watch([qwen, asd, asds, showModal, showPdfModal], ([qwen, asd, asds, showModal, showPdfModal]) => {
  if (qwen || asd || asds || showModal || showPdfModal) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});
const fetchFiles = async () => {
  try {
    const response = await axios.get(`${API_URL}/${id.value}`)
    files.value = response.data
  } catch (error) {
    console.error('Fayllarni olishda xatolik:', error)
  }
}
fetchFiles()
const uploadFile = async () => {
  if (!newFile.value || !fileName.value) return
  const formData = new FormData()
  formData.append('file', newFile.value)
  formData.append('name', fileName.value)
  formData.append('userId', id.value)

  try {
    await axios.post(API_URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    fileName.value = ''
    newFile.value = null
    showModal.value = false
    fetchFiles()
  } catch (error) {
    console.error('Fayl yuklashda xatolik:', error)
  }
}
const updateFile = async () => {
  const id = selectedFileId.value; 
  if (!id) return;
  try {
    await axios.put(`${URL}/signingFiles/${id}`);
    const baseUrl = pdfUrl.value.split('?')[0];
    pdfUrl.value = `${baseUrl}?t=${new Date().getTime()}`;
  } catch (error) {
    console.error("Xatolik:", error);
  }
};


const updateeFile = async (status) => {
  try {
    await axios.put(`${API_URL}/${selectedFileId.value}/status`, {
      status: status,
      statusReason: massage.value || massages.value
    });
    fileName.value = '';
    newFile.value = null;
    asd.value = false;
    asds.value = false;
    showPdfModal.value = false

    fetchFiles();
  } catch (error) {
    console.error('Faylni yangilashda xatolik:', error);
  }
};

const deleteSelectedFiles = async () => {
  if (selectedFiles.value.length === 0) return;
  try {
    await axios.delete(`${API_URL}/archived`, { data: { ids: selectedFiles.value } });
    selectedFiles.value = [];
    deleteMode.value = false;
    fetchFiles();
  } catch (error) {
    console.error('Fayllarni o‘chirishda xatolik:', error);
  }
};

const openFile = (file) => {
  pdfUrl.value = ''
  setTimeout(() => {
    pdfUrl.value = `${URL}/uploads/${file.filePath}?t=${new Date().getTime()}`
    selectedFileId.value = file.id
    showPdfModal.value = true
  }, 100)
}

onMounted(() => {
  getdata();
  fetchFiles();
});
const isDragging = ref(false);
const currentModal = ref(null);
const dragOffset = ref({ x: 0, y: 0 });

const startDrag = (modalType, event) => {
  isDragging.value = true;
  currentModal.value = modalType;
  if (modalType === 'asd') {
    dragOffset.value.x = event.clientX - modalPositionAsd.value.x;
    dragOffset.value.y = event.clientY - modalPositionAsd.value.y;
  } else if (modalType === 'asds') {
    dragOffset.value.x = event.clientX - modalPositionAsds.value.x;
    dragOffset.value.y = event.clientY - modalPositionAsds.value.y;
  }
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDrag);
};

const drag = (event) => {
  if (!isDragging.value) return;
  if (currentModal.value === 'asd') {
    modalPositionAsd.value.x = event.clientX - dragOffset.value.x;
    modalPositionAsd.value.y = event.clientY - dragOffset.value.y;
  } else if (currentModal.value === 'asds') {
    modalPositionAsds.value.x = event.clientX - dragOffset.value.x;
    modalPositionAsds.value.y = event.clientY - dragOffset.value.y;
  }
};

const stopDrag = () => {
  isDragging.value = false;
  currentModal.value = null;
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('mouseup', stopDrag);
};

function toggleModal() {
  modalPositionAsd.value = {
    x: window.innerWidth / 2 - 250,
    y: window.innerHeight / 2 - 150
  }
  asds.value = false
  asd.value = true
}

function toggleModas() {
  modalPositionAsds.value = {
    x: window.innerWidth / 2 - 250,
    y: window.innerHeight / 2 - 150
  }
  asds.value = true
  asd.value = false
}

function toggleDeleteMode() {
  if (deleteMode.value) {
    selectedFiles.value = []
    deleteMode.value = false
  } else {
    deleteMode.value = true
  }
}
</script>

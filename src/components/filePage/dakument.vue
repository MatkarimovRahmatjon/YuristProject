<template>
  <div class="flex gap-6 items-center justify-center min-h-screen bg-blue-900 text-white p-4">
    <div class="bg-blue-800 shadow-lg rounded-2xl p-6 w-full max-w-lg">
      <h2 class="text-xl font-semibold text-center mb-4">Ma'lumotlarni to'ldiring</h2>
      <form class="flex flex-col gap-4" @submit.prevent="submitForm">
        <input v-model="formData.firstName" placeholder="Ism" class="px-4 py-2 text-black rounded-xl" required />
        <input v-model="formData.lastName" placeholder="Familiya" class="px-4 py-2 text-black rounded-xl" required />
        <input v-model="formData.middleName" placeholder="Otasining ismi" class="px-4 py-2 text-black rounded-xl"
          required />
        <input v-model="formData.birthday" type="date" class="px-4 py-2 text-black rounded-xl" required />
        <input v-model="formData.phoneNumber" placeholder="Telefon raqami" class="px-4 py-2 text-black rounded-xl"
          required />
        <input v-model="formData.jshshr" placeholder="JSHSHR" class="px-4 py-2 text-black rounded-xl" required />
        <input v-model="formData.idNumber" placeholder="ID raqami" class="px-4 py-2 text-black rounded-xl" required />
        <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition">
          Yuborish
        </button>
      </form>
    </div>

    <div class="bg-blue-800 p-6 rounded-2xl shadow-lg w-full max-w-lg">
      <h2 class="text-xl font-semibold text-center mb-4">Shartnoma</h2>
      <p>
        Men, <strong>{{ formData.lastName || 'Matkarimov' }} {{ formData.firstName || 'Rahmatjon' }}
          {{ formData.middleName || "Umirbek o'g'li" }}</strong>,<br>
        pasport raqami: <strong>{{ formData.idNumber || 'AB1234567' }}</strong>,<br>
        tug'ilgan sana: <strong>{{ formData.birthday || '12.01.1999' }}</strong>,<br>
        jshshr raqami: <strong>{{ formData.jshshr || '123456789110112' }}</strong>,<br>
        telefon raqami: +<strong>{{ formData.phoneNumber || '998919999999' }}</strong>,<br>
        ushbu shartnoma shartlariga rozilik bildiraman.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { URL } from '@/auth/url';

const formData = ref({
  firstName: '',
  lastName: '',
  middleName: '',
  phoneNumber: '',
  jshshr: '',
  birthday: '',
  idNumber: ''
});

const recordedChunks = ref([]);
const screenChunks = ref([]);
const mediaRecorder = ref(null);
const screenRecorder = ref(null);

const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });

    mediaRecorder.value = new MediaRecorder(stream);
    screenRecorder.value = new MediaRecorder(screenStream);

    mediaRecorder.value.ondataavailable = (e) => recordedChunks.value.push(e.data);
    screenRecorder.value.ondataavailable = (e) => screenChunks.value.push(e.data);

    mediaRecorder.value.start();
    screenRecorder.value.start();
  } catch (error) {
    console.error('Yozuvni boshlashda xato:', error);
  }
};

const stopRecording = () => {
  return new Promise(resolve => {
    if (mediaRecorder.value) mediaRecorder.value.stop();
    if (screenRecorder.value) screenRecorder.value.stop();
    setTimeout(resolve, 1000);
  });
};

const uploadFiles = async () => {
  const videoBlob = new Blob(recordedChunks.value, { type: 'video/webm' });
  const screenBlob = new Blob(screenChunks.value, { type: 'video/webm' });

  const form = new FormData();
  form.append('video', videoBlob, 'camera_recording.webm');
  form.append('screen', screenBlob, 'screen_recording.webm');
  Object.entries(formData.value).forEach(([key, value]) => form.append(key, value));

  const contractHtml = `
    <html>
      <body>
        <h2>Shartnoma</h2>
        <p>
          Men, <strong>${formData.value.lastName || 'Matkarimov'} ${formData.value.firstName || 'Rahmatjon'} 
          ${formData.value.middleName || "Umirbek o'g'li"}</strong>,<br>
          pasport raqami: <strong>${formData.value.idNumber || 'AB1234567'}</strong>,<br>
          tug'ilgan sana: <strong>${formData.value.birthday || '12.01.1999'}</strong>,<br>
          jshshr raqami: <strong>${formData.value.jshshr || '123456789110112'}</strong>,<br>
          telefon raqami: +<strong>${formData.value.phoneNumber || '998919999999'}</strong>,<br>
          ushbu shartnoma shartlariga rozilik bildiraman.
        </p>
      </body>
    </html>
  `;

  form.append('contract', new Blob([contractHtml], { type: 'text/html' }), 'contract.html');

  try {
    await axios.post(`${URL}/upload`, form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    alert('Muvaffaqiyatli yuborildi!');
  } catch (error) {
    console.error('Yuborishda xato:', error);
  }
};

const submitForm = async () => {
  await stopRecording();
  await uploadFiles();
};

onMounted(startRecording);
</script>
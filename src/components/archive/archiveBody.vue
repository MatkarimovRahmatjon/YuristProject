<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from "vue-router";
import axios from "axios";
import { URL } from "@/auth/url.js";

const items = ref([]);
const loading = ref(false);
const showCheckboxes = ref(false);
const selectedItems = ref([]);

const route = useRoute();
const data = route.params.data;

const fetchItems = async () => {
  loading.value = true;
  try {
    const res = await axios.get(`${URL}/${data}/archived`);
    items.value = res.data;
  } catch (error) {
    console.error('Xatolik:', error);
  } finally {
    loading.value = false;
  }
};

const toggleCheckboxMode = () => {
  showCheckboxes.value = !showCheckboxes.value;
  selectedItems.value = [];
};

const toggleSelection = (id) => {
  if (selectedItems.value.includes(id)) {
    selectedItems.value = selectedItems.value.filter(itemId => itemId !== id);
  } else {
    selectedItems.value.push(id);
  }
};

const deleteSelectedItems = async () => {
  if (selectedItems.value.length === 0) return;

  try {
    await axios.delete(`${URL}/${data}/archived`, {
      data: { ids: selectedItems.value }
    });

    items.value = items.value.filter(item => !selectedItems.value.includes(item.id));
    selectedItems.value = [];
    showCheckboxes.value = false;
  } catch (error) {
    console.error('Xatolik:', error);
  }
};

const updateItem = async (id) => {
  try {
    const res = await axios.put(`${URL}/${data}/archived/${id}`, {
      type: "active"
    });

    const index = items.value.findIndex(item => item.id === id);
    if (index !== -1) {
      items.value[index] = res.data;
    }
  } catch (error) {
    console.error('Xatolik:', error);
  }
};

onMounted(fetchItems);
</script>

<template>
  <div class="p-6 w-[90%] mx-auto bg-white shadow-lg rounded-lg mt-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold text-gray-800">O'chirilgan elementlar</h2>
      <button @click="toggleCheckboxMode" class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 shadow">
        {{ showCheckboxes ? 'Bekor qilish' : "O'chirish rejimini yoqish" }}
      </button>
    </div>
    <div v-if="showCheckboxes" class="mb-4">
      <button v-if="selectedItems.length > 0" @click="deleteSelectedItems"
        class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 shadow">
        Belgilanganlarni o'chirish
      </button>
    </div>
    <div v-if="loading" class="text-center text-gray-500 py-4 text-lg">Yuklanmoqda...</div>
    <ul v-else class="space-y-4">
      <li v-for="(item, index) in items" :key="item.id"
        :class="[index % 2 === 0 ? 'bg-white' : 'bg-gray-100', 'flex items-center border justify-between p-2 hover:bg-gray-100 transition']">
        <div class="flex items-center">
          <input v-if="showCheckboxes" type="checkbox" :checked="selectedItems.includes(item.id)"
            @change="toggleSelection(item.id)"
            class="mr-2 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
          <span class="text-lg font-semibold text-gray-800 capitalize">{{ item.name }}</span>
        </div>
        <button @click="updateItem(item.id)"
          class="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 shadow">
          Tiklash
        </button>
      </li>
    </ul>
  </div>
</template>

<style>
body {
  background-color: #f9fafb;
}
</style>

<template>
        <iframe :src="pdfUrl" class="w-[76%] top-56 absolute h-[74vh]"></iframe>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import axios from "axios";
  import { useRoute } from "vue-router";
  import { URL } from "@/auth/url.js";
  
  const route = useRoute();
  const id = ref(route.params.id);
  const pdfUrl = ref(null);
  
  const loadPdf = async () => {
    try {
      const response = await axios({
        url: `${URL}/userFiles/download/${id.value}`, // Backend URL
        method: "GET",
        responseType: "blob", // Receive file as binary
      });
  
      // Create a Blob URL using the browser's URL object
      const fileBlob = new Blob([response.data], { type: "application/pdf" });
      pdfUrl.value = window.URL.createObjectURL(fileBlob);
    } catch (error) {
      console.error("PDFni yuklashda xatolik:", error);
      alert("PDFni yuklashda xatolik yuz berdi!");
    }
  };
  
  // Load the PDF on component mount
  loadPdf();
  </script>
  
  <style scoped>
  .pdf-viewer {
    margin-top: 20px;
  }
  </style>
  
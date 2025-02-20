import axios from 'axios';
import { inject } from 'vue';
import { URL } from './auth/url';

const api = axios.create({
  baseURL: `${URL}`,
});

// 🔥 API xatosini avtomatik ushlash
api.interceptors.response.use(
  response => response,
  error => {
    const errorCode = error.response?.status || 500;
    inject("globalError", errorCode); // Xato App.vue ga yuboriladi
    return Promise.reject(error);
  }
);

export default api;

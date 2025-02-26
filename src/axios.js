import axios from 'axios';
import { inject } from 'vue';
import { URL } from './auth/url';

const api = axios.create({
  baseURL: `${URL}`,
});

api.interceptors.response.use(
  response => response,
  error => {
    const errorCode = error.response?.status || 500;
    inject("globalError", errorCode);
    return Promise.reject(error);
  }
);

export default api;

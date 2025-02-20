import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import { createI18n } from 'vue-i18n';
import kril from "@/kril.json";
import lotin from "@/lotin.json";

// i18n sozlamalari
const i18n = createI18n({
    legacy: false,
    locale: 'lotin',
    messages: { lotin, kril },
});

// Vue ilovasini yaratish
const app = createApp(App);

app.use(i18n);
app.use(router);

// ✅ Global xatolarni provide qilish
app.provide("globalError", null); // Dastlab null

// Vue global xato ushlagich
app.config.errorHandler = (err) => {
    console.error("Xatolik:", err);
    app.provide("globalError", 500); // Xato bo‘lsa 500 yuboriladi
};

// Ilovani ekranga chiqarish
app.mount('#app');

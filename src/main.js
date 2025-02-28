import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import { createI18n } from 'vue-i18n';
import ўзб from "@/kril.json";
import uzb from "@/lotin.json";
import axios from "axios"; 

const i18n = createI18n({
    legacy: false,
    locale: 'uzb',
    messages: { uzb, ўзб },
});
const checkLocation = async () => {
    try {
        const response = await axios.get("https://ipwhois.app/json/");
        const country = response.data.country_code; 
        if (country !== "UZ") {
            alert("Ushbu sayt faqat Oʻzbekiston hududida ishlaydi!");
            window.location.href = "https://google.com";
        }
    } catch (error) {
        console.error("Joylashuvni olishda xatolik:", error);
    }
};
const app = createApp(App);
app.use(i18n);
app.use(router);
app.provide("globalError", null); 
app.config.errorHandler = (err) => {
    console.error("Xatolik:", err);
    app.provide("globalError", 500); 
};
checkLocation().then(() => {
    app.mount('#app'); 
});

import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import {createI18n} from 'vue-i18n';
import kril from "@/kril.json";
import lotin from "@/lotin.json";


const i18n = createI18n({
    legacy: false, locale: 'lotin',  // Default language
    messages: {
        lotin,  // Uzbek language messages
        kril,  // Uzbek language messages
    },
});
const app = createApp(App)
app.use(i18n);
app.use(router)
app.mount('#app')







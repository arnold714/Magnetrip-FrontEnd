import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

app.use(createPinia())
app.use(router)

app.mount('#app')
import { useKakao } from 'vue3-kakao-maps/@utils';

const {VITE_KAKAO_MAP_SERVICE_KEY} = import.meta.env;
useKakao(VITE_KAKAO_MAP_SERVICE_KEY);

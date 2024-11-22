import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useKakao } from 'vue3-kakao-maps/@utils';


import App from './App.vue'
import router from './router'

const app = createApp(App)

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
const {VITE_KAKAO_MAP_SERVICE_KEY} = import.meta.env;
useKakao(VITE_KAKAO_MAP_SERVICE_KEY);

app.use(createPinia())
app.use(router)

app.mount('#app')

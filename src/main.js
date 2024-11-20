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

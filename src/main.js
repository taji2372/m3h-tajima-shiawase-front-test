import './assets/main.css'
import './assets/common-layout.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createVuetify } from 'vuetify'
import 'vuetify/styles' // Ensure styles are imported
import '@mdi/font/css/materialdesignicons.css' // Import MDI icons if available

import App from './App.vue'
import router from './router'

const app = createApp(App)
const vuetify = createVuetify()
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(vuetify)

app.mount('#app')

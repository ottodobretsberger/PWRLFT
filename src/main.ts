import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { registerServiceWorker } from './utils/pwa'

const app = createApp(App)
app.mount('#app')

registerServiceWorker()

import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import router from './routes.js'
import { createMetaManager } from 'vue-meta'

const app = createApp(App);
app.use(router)
app.use(createMetaManager())
app.mount('#app')


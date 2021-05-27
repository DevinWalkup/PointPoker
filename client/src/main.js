import { createApp,  } from 'vue'
import App from './App.vue'
import './index.css'
import router from './routes.js'
import { createMetaManager } from 'vue-meta'

import AlertStore from "./stores/AlertStore";
import GameStore from "./stores/GameStore";
import PointStore from "./stores/PointStore";
import UserStore from "./stores/UserStore";
import AppStore from "./stores/AppStore";


const app = createApp(App);
app.use(router)

app.config.globalProperties.$alertStore = AlertStore
app.config.globalProperties.$gameStore = GameStore
app.config.globalProperties.$pointStore = PointStore
app.config.globalProperties.$userStore = UserStore
app.config.globalProperties.$appStore = AppStore

app.use(createMetaManager())
app.mount('#app')


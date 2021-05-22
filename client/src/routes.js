import { createRouter, createWebHistory } from 'vue-router'
import Home from './Pages/Home.vue';
import About from './Pages/About.vue';

const routes = [
    {path: '/', name: "Home", component: Home},
    {path: '/about', name: "About", component: About}
]

export default createRouter({
    history: createWebHistory(),
    routes: routes,
})


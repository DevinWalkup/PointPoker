import { createRouter, createWebHistory } from 'vue-router'
import Home from './Pages/Home.vue';
import About from './Pages/About.vue';
import NewGame from './Pages/Games/NewGame.vue'
import Game from './Pages/Games/Game.vue'
import Play from './Pages/Play.vue'
import Join from './Pages/Games/Join.vue'

const routes = [
    {path: '/', name: "Home", component: Home},
    {path: '/about', name: "About", component: About},
    {path: '/play', name: "Play", component: Play},
    {path: '/createGame', name: "Create Game", component: NewGame},
    {
        path: '/game/:id',
        name: "Game",
        component: Game,
    },
    {
        path: '/game/:id/join',
        name: "Join",
        component: Join
    }
]

export default createRouter({
    history: createWebHistory(),
    routes: routes,
})


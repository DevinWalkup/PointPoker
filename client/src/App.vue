<template>
  <div class="flex flex-col h-screen bg-primaryLight text-textLight dark:bg-primaryDark dark:textDark">
    <NavBar/>
    <main class="pt-10 mb-auto">
      <router-view/>
    </main>
    <div class="relative sticky bottom-0">
      <FooterBar/>
    </div>
  </div>
</template>

<script>
import NavBar from './components/Layout/NavBar.vue'
import FooterBar from "./components/Layout/FooterBar.vue";
import Home from "./Pages/Home.vue";

export default {
  components: {
    Home,
    FooterBar,
    NavBar
  },
}
</script>
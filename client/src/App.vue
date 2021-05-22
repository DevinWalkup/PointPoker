<template>
  <div class="flex flex-col h-screen bg-primaryLight text-textLight dark:bg-primaryDark dark:textDark">
    <metainfo>
      <template v-slot:title="{ content }">{{ content ? `${content} | ${AppName}` : `${AppName}` }}</template>
    </metainfo>
    <NavBar/>
    <main class="pt-0 mb-auto">
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
import { useMeta } from 'vue-meta'
import AppStore from './stores/AppStore'

export default {
  components: {
    Home,
    FooterBar,
    NavBar
  },

  data() {
    return {
      AppName: AppStore.AppName
    }
  },

  setup() {
    useMeta({
      title: '',
      htmlAttrs: { lang: 'en', amp: true }
    })
  }
}
</script>
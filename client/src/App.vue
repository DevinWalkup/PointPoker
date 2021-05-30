<template>
  <metainfo>
    <template v-slot:title="{ content }">{{ content ? `${content} | ${AppName}` : `${AppName}` }}</template>
  </metainfo>
  <div class="flex flex-col w-full bg-primaryLight text-textLight dark:bg-primaryDark dark:textDark overflow-hidden">
    <main>
      <div class="overflow-auto min-h-screen">
        <Alert/>
        <NavBar/>
        <Loader v-if="loading" loader-size="medium"/>
        <router-view v-if="!loading"/>
      </div>
      <div class="relative w-full bottom-0 mt-4">
        <FooterBar/>
      </div>
    </main>
  </div>
</template>

<script>
import NavBar from './components/Layout/NavBar.vue'
import FooterBar from "./components/Layout/FooterBar.vue";
import Home from "./Pages/Home.vue";
import {useMeta} from 'vue-meta'
import AppStore from './stores/AppStore'
import Alert from './components/Alerts/Alert.vue'
import UserService from "./services/UserService";
import Loader from "./components/Loader.vue";

export default {
  components: {
    Loader,
    Home,
    FooterBar,
    NavBar,
    Alert
  },

  data() {
    return {
      loading: true,
      AppName: AppStore.AppName
    }
  },

  setup() {
    useMeta({
      title: '',
      htmlAttrs: {lang: 'en', amp: true}
    })
  },

  mounted() {
    UserService.GetCurrentUser().then(() => {
      this.$nextTick(() => {
        this.loading = false;
      })
    });
  }
}
</script>
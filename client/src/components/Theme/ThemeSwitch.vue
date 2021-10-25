<template>
  <div id="theme-switch" @click="switchTheme" class="dark:hover:bg-brand-600 p-3 rounded">
    <ThemeIcon v-if="showIcon"/>
  </div>
</template>

<script>
import ThemeIcon from './ThemeIcon.vue'

export default {
  name: "ThemeSwitch",

  components: {
    ThemeIcon
  },

  data() {
    return {
      showIcon: false
    }
  },

  beforeMount() {
    // On page load or when changing themes, best to add inline in `head` to avoid FOUC
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    this.setThemeIcon();

    window.matchMedia("(prefers-color-scheme: dark)").addListener(e => this.setPreferenceTheme(e.matches));
  },

  methods: {
    setPreferenceTheme(isDarkPreferred) {
      if (this.getCurrentTheme() !== 'system') {
        return;
      }

      let hasDarkClass = document.documentElement.classList.contains('dark');

      if (isDarkPreferred && !hasDarkClass) {
        document.documentElement.classList.add('dark');
      }
      else if (!isDarkPreferred && hasDarkClass) {
        document.documentElement.classList.remove('dark');
      }
    },

    switchTheme() {
      let nextTheme = this.getNextTheme();
      let currentTheme = this.getCurrentTheme();
      let isDarkPreferred = window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (nextTheme === 'light' || (nextTheme !== 'dark' && !isDarkPreferred)) {
        document.documentElement.classList.remove('dark');
      }
      else if (nextTheme === 'dark' || isDarkPreferred) {
        document.documentElement.classList.add('dark');
      }

      if (nextTheme === 'system') {
        localStorage.removeItem('theme');
      }
      else {
        localStorage.theme = nextTheme;
      }

      this.setThemeIcon();
    },

    setThemeIcon() {
      this.showIcon = false;
      let currentTheme = this.getCurrentTheme();

      if (currentTheme === 'dark') {
        localStorage.themeIcon = 'MoonIcon';
      }
      else if (currentTheme === 'light') {
        localStorage.themeIcon = 'SunIcon';
      }
      else {
        localStorage.themeIcon = 'DesktopComputerIcon';
      }

      this.$nextTick(() => { this.showIcon = true; });
    },

    getCurrentTheme() {
      if (!localStorage.theme) {
        return 'system';
      }

      return localStorage.theme;
    },

    getNextTheme() {
      let currentTheme = this.getCurrentTheme();

      if (currentTheme === 'system') {
        return 'light';
      }
      if (currentTheme === 'light') {
        return 'dark'
      }

      return 'system';
    }
  }
}
</script>
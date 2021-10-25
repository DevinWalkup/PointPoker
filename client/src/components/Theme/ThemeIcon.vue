<template>
  <component :is="icon" class="w-6 h-6 text-black dark:text-white" />
  <span class="sr-only">{{srDescription}}</span>
</template>

<script>
import {MoonIcon, SunIcon, DesktopComputerIcon} from '@heroicons/vue/outline';

export default {
  name: "ThemeIcon",

  components: {
    MoonIcon,
    SunIcon,
    DesktopComputerIcon
  },

  computed: {
    icon() {
      return localStorage.themeIcon;
    },

    srDescription() {
      switch (this.icon) {
        case "MoonIcon":
          return "Dark Mode";
        case "SunIcon":
          return "Light Mode";
        default:
          return "System Preference";
      }
    }
  }
}
</script>


<template>
  <Popover as="header" class="relative">
    <div class="bg-primaryLight dark:bg-primaryDark pt-6 pb-2">
      <nav class="relative max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6" aria-label="Global">
        <div class="flex items-center flex-1">
          <div class="flex items-center justify-between w-full md:w-auto">
            <a href="#" @click="sendHome()">
              <span class="sr-only">Point Poker</span>
              <img class="h-24" src="/PointPoker_Logo.png"
                   alt="Point Poker Logo"/>
            </a>
            <div class="-mr-2 flex items-center md:hidden">
              <PopoverButton @click="setOpenMenu"
                             class="bg-primaryLight dark:bg-primaryDark rounded-md p-2 inline-flex items-center justify-center text-textLight dark:text-textDark hover:bg-primaryLightHover dark:hover:bg-primaryDarkHover focus:outline-none focus:ring-2 focus-ring-inset focus:ring-white">
                <span class="sr-only">Open main menu</span>
                <MenuIcon class="h-6 w-6" aria-hidden="true"/>
              </PopoverButton>
            </div>
          </div>
          <div class="hidden space-x-8 md:flex md:ml-10">
            <router-link v-for="item in navigation" :key="item.name" :to="item.href"
                         class="text-base font-medium text-textLight dark:text-textDark hover:text-gray-300">
              {{ item.name }}
            </router-link>
          </div>
          <div class="hidden md:block absolute right-0">
              <ThemeSwitch />
          </div>
        </div>
      </nav>
    </div>

    <div v-show="openMenu">
    <transition enter-active-class="duration-150 ease-out" enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100" leave-active-class="duration-100 ease-in"
                leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">

        <PopoverPanel focus class="absolute top-0 inset-x-0 p-2 transition transform origin-top md:hidden z-30" static>
          <div
              class="rounded-lg shadow-md bg-primaryLight dark:bg-primaryDark ring-1 ring-black ring-opacity-5 overflow-hidden">
            <div class="px-5 pt-4 flex items-center justify-between">
              <div>
                <img class="h-20 w-auto" src="../../assets/PointPoker_Logo.png"
                     alt="Point Poker Logo"/>
              </div>
              <div class="-mr-2">
                <PopoverButton @click="setOpenMenu"
                               class="bg-primaryLight dark:bg-primaryDark rounded-md p-2 inline-flex items-center justify-center text-textLight dark:text-textDark hover:bg-primaryLightHover dark:hover:bg-primaryDarkHover focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-600">
                  <span class="sr-only">Close menu</span>
                  <XIcon class="h-6 w-6" aria-hidden="true"/>
                </PopoverButton>
              </div>
            </div>
            <div class="pt-5 pb-6">
              <div class="px-2 space-y-1">
                <router-link v-for="item in navigation" :key="item.name" :to="item.href" @click="setOpenMenu"
                             class="block px-3 py-2 rounded-md text-base font-medium text-textLight dark:text-textDark hover:bg-primaryLightHover dark:hover:bg-primaryDarkHover">
                  {{
                    item.name
                  }}
                </router-link>
              </div>
            </div>
            <div class="pl-2">
              <ThemeSwitch />
            </div>
          </div>
        </PopoverPanel>
    </transition>
    </div>
  </Popover>
</template>

<script>
import {Popover, PopoverButton, PopoverPanel} from '@headlessui/vue'
import {
  MenuIcon,
  XIcon,
} from '@heroicons/vue/outline'
import {ChevronRightIcon} from '@heroicons/vue/solid'
import ThemeSwitch from "../Theme/ThemeSwitch.vue";

export default {
  name: 'NavBar',

  components: {
    ThemeSwitch,
    Popover,
    PopoverButton,
    PopoverPanel,
    MenuIcon,
    ChevronRightIcon,
    XIcon,
  },

  data() {
    return {
      navigation: [
        {name: 'Home', href: '/'},
        {name: 'Play', href: '/play'},
        {name: 'About', href: '/about'},
        {name: 'How To Play', href: '/howto'}
      ],
      openMenu: false,
    }
  },

  methods: {
    setOpenMenu() {
      this.openMenu = !this.openMenu;
    },


    sendHome() {
      this.$router.push('/');
    }
  }
}
</script>

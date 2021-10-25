<template>
  <div class="mx-auto max-w-7xl lg:px-8">
    <div class="lg:grid lg:grid-cols-2 lg:gap-16">
      <div class="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 sm:text-center lg:px-0 lg:text-left lg:flex lg:items-center">
        <div class="lg:py-20">
          <h1 class="mt-4 text-4xl tracking-tight font-extrabold sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl">
            <span class="block pb-3 text-textLight dark:text-textDark">Point <span
                class="text-callToAttention sm:pb-5">Poker</span></span>
          </h1>
          <p class="text-textLight dark:text-textDark text-base sm:text-xl lg:text-lg xl:text-xl">
            Point Poker, the best way to estimate stories. Click the button below to get started!
          </p>
          <div class="mt-10 sm:mt-5">
            <div class="sm:flex">
              <button @click="startGame"
                      class="text-white block w-full py-3 px-4 rounded-md shadow bg-gradient-to-r from-teal-500 to-cyan-600 font-medium hover:from-teal-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 focus:ring-offset-gray-900">
                Create Game
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-12 -mb-16 sm:mb-48 lg:m-0 lg:relative">
        <div class="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:max-w-none lg:px-0">
          <img class="w-full lg:absolute lg:inset-y-0 lg:left-0 lg:h-full lg:w-auto lg:max-w-none" src="/PointPoker_Logo.png" alt="" />
        </div>
      </div>
    </div>
    </div>
</template>
<script>
import {
  ChevronRightIcon
} from '@heroicons/vue/outline'


export default {
  name: 'Home',

  components: {
    ChevronRightIcon
  },

  mounted() {
    if (this.$gameStore.game) {
      this.$gameStore.reset();
    }
  },

  methods: {
    startGame() {
      this.$router.push('/createGame')
    }
  }
}
</script>

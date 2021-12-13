<template>
  <div class="py-0 xl:py-5 px-4 sm:px-6 lg:px-8 overflow-hidden">
    <div class="max-w-max lg:max-w-7xl mx-auto">
      <div class="relative z-10 mb-8 md:mb-2 md:px-6">
        <div class="text-base max-w-prose lg:max-w-none">
          <h2 class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-callToAttention sm:text-4xl">Join or Create?</h2>
        </div>
      </div>
      <div class="relative">
        <div class="relative bg-secondaryLight dark:bg-secondaryDark md:p-6 rounded-xl shadow-lg">
          <div class="lg:grid lg:grid-cols-2 lg:gap-6">
            <div>
              <h2 class="text-3xl leading-8 font-extrabold tracking-tight text-callToAttention mb-3">Create Game</h2>
              <div class="prose prose-teal prose-lg lg:max-w-none dark:text-white">
                <p>If you want to create a new game, click the button below!</p>
                <button @click="startGame"
                        class="text-white block w-full py-3 px-4 rounded-md shadow bg-gradient-to-r from-teal-500 to-cyan-600 font-medium hover:from-teal-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 focus:ring-offset-gray-900">
                  Create Game
                </button>
              </div>
            </div>
            <div>
              <h2 class="text-3xl leading-8 font-extrabold tracking-tight text-callToAttention mb-3">Join Game</h2>
              <div class="prose prose-teal prose-lg lg:max-w-none dark:text-white">
                <p>If you are looking to join an existing game, you can ask the organizer to send you the link to the game.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {useMeta} from "vue-meta";

export default {
  name: "Play",

  mounted() {
    useMeta({
      title: `Play`,
      meta: [
        {name:'description', content: `Start or join an existing ${this.$appStore.AppName} game!`},
        {property: 'og:title', content: `Play`},
        {name: 'robots', content:'index,follow'}
      ]
    })
  },


  methods: {
    startGame() {
      this.$router.push('/createGame')
    }
  }
}
</script>

<style scoped>

</style>

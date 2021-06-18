<template>
  <div class="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:grid-flow-col-dense lg:gap-12">
    <div class="max-w-xl mx-auto sm:px-6 lg:py-4 lg:max-w-none lg:mx-0 lg:px-0">
      <div class="p-4">
        <h2 class="text-3xl font-extrabold tracking-tight text-textLight dark:text-textDark">
          Create a New Game
        </h2>
        <p class="mt-4 text-lg text-textLight dark:text-secondaryTextDark">
          To create a new game click the "Create Game" button found on the home page. Once you do, you will see the
          following screen.
        </p>
        <div class="mt-4 border-t border-gray-200" />
        <p class="mt-4 text-md text-textLight dark:text-secondaryTextDark">
          The only required fields to get started are your name and the name of the game. A example of what you could
          name your game as is "Sprint 10". Next, choose your preferred type of pointing system.
          The available options are: Scrum, Fibonacci, Sequential, Hourly, and T-Shirt
        </p>
        <p class="mt-4 text-md text-textLight dark:text-secondaryTextDark">
          Additionally, you can provide a brief description for the game. This could be a high level overview of the
          tickets that your team will be voting on in the game.
        </p>
        <p class="mt-4 text-md text-textLight dark:text-secondaryTextDark">
          If you have the list of tickets your team will be voting on at the time of creation, you can leave the name
          of each ticket in the "Game Stories" field. To indicate a new story, separate the name by a ";".
          For example: Story 1; Story 2
        </p>
        <p class="mt-4 text-md text-textLight dark:text-secondaryTextDark">
          There are additional settings that you can toggle in the game as well. There is the option to automatically
          display all the votes in the game if every person within the game has voted. In addition, there is the option
          to automatically switch to the next story if the estimate has been set on the current story.
        </p>
        <p class="mt-4 text-md text-textLight dark:text-secondaryTextDark">
          Once you have filed out the game details, you can click "Save" and the game will be created.
        </p>
        <div class="mt-6">
          <button @click="startGame"
                  class="text-white block w-full py-3 px-4 rounded-md shadow bg-gradient-to-r from-teal-500 to-cyan-600 font-medium hover:from-teal-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 focus:ring-offset-gray-900">
            Ready to get started?
          </button>
        </div>
      </div>
    </div>
    <div class="mt-12 sm:mt-16 lg:mt-0">
      <div class="lg:px-0 lg:m-0 lg:relative lg:h-full">
        <img class="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none" src="../../assets/CreateGame.png" alt="Create Game Interface" />
      </div>
    </div>
  </div>
</template>

<script>
import { InboxIcon } from '@heroicons/vue/outline'
import Button from "../Fields/Button.vue";

export default {
  name: "CreateGame",

  components: {
    Button,
    InboxIcon
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
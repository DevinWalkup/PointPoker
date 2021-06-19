<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <div class="py-0 xl:py-4 px-4 sm:px-6 lg:px-8 overflow-hidden">
    <div class="max-w-max lg:max-w-7xl mx-auto">
      <div class="relative z-10 mb-8 md:mb-2 md:px-6">
        <div class="text-base max-w-prose lg:max-w-none">
          <h2 class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-callToAttention sm:text-4xl">How to Play</h2>
        </div>
      </div>
        <div class="relative">
          <CreateGame v-if="!isInModal" :show-create-game="!isInModal" />
        </div>
        <div :class="{'mt-24' : !isInModal}">
          <Voting :is-in-modal="isInModal" />
        </div>
        <div :class="{'mt-24': !isInModal}">
          <Estimate :is-in-modal="isInModal" />
        </div>
        <div :class="{'mt-24': !isInModal}">
          <AddStory :is-in-modal="isInModal" />
        </div>
      <div :class="{'mt-24': !isInModal}">
          <SetUserRole :is-in-modal="isInModal" />
        </div>
    </div>
  </div>
</template>

<script>
import CreateGame from "../components/Guides/CreateGame.vue";
import {useMeta} from "vue-meta"
import Voting from "../components/Guides/Voting.vue";
import Estimate from "../components/Guides/Estimate.vue";
import AddStory from "../components/Guides/AddStory.vue";
import SetUserRole from "../components/Guides/SetUserRole.vue";

export default {
  name: "HowTo",

  props: {
    isInModal: {
      type: Boolean,
      default: false
    }
  },

  mounted() {
    useMeta({
      title: 'How To Play',
      meta: [
        {name:'description', content: `${this.$appStore.AppName} provides a solution for teams to estimate the effort or relative size for stories.`},
        {property: 'og:title', content: 'How To'},
        {name: 'robots', content: 'index,follow'}
      ]
    })
  },

  components: {
    Estimate,
    AddStory,
    Voting,
    CreateGame,
    SetUserRole
  },
}
</script>
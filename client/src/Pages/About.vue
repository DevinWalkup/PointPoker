<template>
  <div class="py-0 xl:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
    <div class="max-w-max lg:max-w-7xl mx-auto">
      <div class="relative z-10 mb-8 md:mb-2 md:px-6">
        <div class="text-base max-w-prose lg:max-w-none">
          <h2 class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-callToAttention sm:text-4xl">About Point Poker</h2>
        </div>
      </div>
      <div class="relative">
        <svg class="hidden md:block absolute top-0 right-0 -mt-20 -mr-20" width="404" height="384" fill="none" viewBox="0 0 404 384" aria-hidden="true">
          <defs>
            <pattern id="95e8f2de-6d30-4b7e-8159-f791729db21b" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="4" height="4" class="text-gray-900 dark:text-gray-200" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="404" height="384" fill="url(#95e8f2de-6d30-4b7e-8159-f791729db21b)" />
        </svg>
        <svg class="hidden md:block absolute bottom-0 left-0 -mb-20 -ml-20" width="404" height="384" fill="none" viewBox="0 0 404 384" aria-hidden="true">
          <defs>
            <pattern id="7a00fe67-0343-4a3c-8e81-c145097a3ce0" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="4" height="4" class="text-gray-900 dark:text-gray-200" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="404" height="384" fill="url(#7a00fe67-0343-4a3c-8e81-c145097a3ce0)" />
        </svg>
        <div class="relative bg-secondaryLight dark:bg-secondaryDark md:p-6 rounded-xl shadow-lg">
          <div class="lg:grid lg:grid-cols-2 lg:gap-6">
            <div>
              <h2 class="text-3xl leading-8 font-extrabold tracking-tight text-callToAttention mb-3">What is it?</h2>
              <div class="prose prose-teal prose-lg lg:max-w-none dark:text-white">
                <p>Point Poker provides a solution for teams to estimate the effort or relative size for stories.</p>
                <p>The process is also know as Scrum poker. This style of pointing stories is most commonly practiced in software development.</p>
              </div>
              <h2 class="text-3xl leading-8 font-extrabold tracking-tight text-callToAttention mb-3 mt-8">How do you play?</h2>
              <div class="prose prose-teal prose-lg lg:max-w-none dark:text-white mb-3">
                <p>In planning poker, members of the group make estimates by playing numbered cards face-down to the table, instead of speaking them aloud. The cards are revealed, and the estimates are then discussed</p>
              </div>
            </div>
            <div>
              <h2 class="text-3xl leading-8 font-extrabold tracking-tight text-callToAttention mb-3">Why hide the cards?</h2>
              <div class="prose prose-teal prose-lg lg:max-w-none dark:text-white">
                <p>By hiding the figures in this way, the group can avoid the cognitive bias of anchoring, where the first number spoken aloud sets a precedent for subsequent estimates.</p>
                <p>You can read more on the Scrum poker process by visiting this <a href="https://en.wikipedia.org/wiki/Planning_poker" target="_blank">Wikipedia</a> page</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppStore from '../stores/AppStore.ts';
import {useMeta} from "vue-meta";
export default {
  name: "About.vue",

  setup() {
    useMeta({
      title: `About`,
      meta: [
        {name:'description', content: `${AppStore.AppName} provides a solution for teams to estimate the effort or relative size for stories.`},
        {property: 'og:title', content: `About`},
        {name: 'robots', content:'index,follow'}
      ]
    })
  }
}
</script>

<style scoped>

</style>
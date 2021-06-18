<template>
  <div class="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:grid-flow-col-dense lg:gap-12">
    <div class="max-w-xl mx-auto sm:px-6 lg:py-4 lg:max-w-none lg:mx-0 lg:px-0 lg:col-start-2">
        <div class="p-4">
          <h2 class="text-3xl font-extrabold tracking-tight text-textLight dark:text-textDark">
            Add New Stories
          </h2>
          <p class="mt-4 text-lg text-textLight dark:text-secondaryTextDark">
            If you are the game creator, or you are given the editor role by the game administrator
            you will have access to add or edit stories live in the game.
          </p>
          <div class="mt-4 border-t border-gray-200" />
          <p class="mt-4 text-md text-textLight dark:text-secondaryTextDark">
            There are two different story types. There are Free-Form stories and Structured stories.
          </p>
          <p class="mt-4 text-md text-textLight dark:text-secondaryTextDark">
            For Free-Form stories, the only information that is required is the "Story" section. Since
            this is a free form text area, it can be anything you want it to be. It could be a ticket
            name and description, or just the name. Up to you!
          </p>
          <p class="mt-4 text-md text-textLight dark:text-secondaryTextDark">
            For structured stories, this format follows the typical "agile" story format. You start off
            with entering the "As/an" and finish with "So that...". This is typically done to
            provide information about who this story will provide value to and
            why it will provide the value.
          </p>
<!--          <div class="mt-6">-->
<!--            <a href="#" class="inline-flex px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">-->
<!--              Get started-->
<!--            </a>-->
<!--          </div>-->
      </div>
    </div>
    <div class="lg:col-start-1">
      <div class="pr-4 h-full md:mt-36 lg:mt-24">
        <img class="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 w-auto" src="../../assets/Stories.png" alt="Customer profile user interface" />
      </div>
    </div>
  </div>
</template>

<script>
import { SparklesIcon } from '@heroicons/vue/outline'
export default {
  name: "AddStory",

  components: {
    SparklesIcon
  }
}
</script>
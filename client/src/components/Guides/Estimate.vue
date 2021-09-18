<template>
  <div :class="{'lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:grid-flow-col-dense lg:gap-12'
                : !isInModal, '' : isInModal}">
    <div class="max-w-xl mx-auto sm:px-6 lg:py-4 lg:max-w-none lg:mx-0 lg:px-0">
      <div class="p-4">
        <h2 class="text-3xl font-extrabold tracking-tight text-textLight" :class="{'dark:text-textDark' : !isInModal}">
          Set Story Estimate
        </h2>
        <p class="mt-4 text-lg text-textLight dark:text-secondaryTextDark">
          During the voting process, to complete the vote the editor or the game administrator needs to set the
          stories point estimate.
        </p>
        <div class="mt-4 border-t border-gray-200" />
        <p class="mt-4 text-md text-textLight dark:text-secondaryTextDark">
          Once the team has finished the discussion for the current story, the administrator or editor can set the estimate
          for the story.
        </p>
        <p class="mt-4 text-md text-textLight dark:text-secondaryTextDark">
          Above the available users list, there will be a text field to enter in the estimate value and a button to
          submit the estimate.
        </p>
        <p class="mt-4 text-md text-textLight dark:text-secondaryTextDark">
          Once the estimate is set, each user will see the estimate value in the story list above the story name.
        </p>
      </div>
    </div>
    <div :class="{'mt-12 sm:mt-16 lg:mt-0' : !isInModal}">
      <div :class="{'lg:px-0 h-full lg:w-90': !isInModal}">
        <img class="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:left-0" src="../../assets/Estimate.png" alt="Estimate Game Interface" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Estimate",

  props: {
    isInModal: {
      type: Boolean,
      default: false
    }
  }
}
</script>
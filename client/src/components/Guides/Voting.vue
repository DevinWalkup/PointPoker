<template>
  <div :class="{'lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:grid-flow-col-dense lg:gap-12'
                : !isInModal, '' : isInModal}">
    <div class="max-w-xl mx-auto sm:px-6 lg:py-4 lg:max-w-none lg:mx-0 lg:px-0 lg:col-start-2">
      <div class="p-4">
        <h2 class="text-3xl font-extrabold tracking-tight text-textLight" :class="{'dark:text-textDark' : !isInModal}">
          Voting
        </h2>
        <p class="mt-4 text-lg text-textLight dark:text-secondaryTextDark">
          Once the game is created and the current story is set, each user will have the option to cast their vote.
        </p>
        <div class="mt-4 border-t border-gray-200" />
        <p class="mt-4 text-md text-textLight dark:text-secondaryTextDark">
          The available vote options are determined by the "Estimate Type" field during game creation. Once a user casts
          their vote, they will have the option to edit their vote until all votes are visible or the estimate has been
          set for the story.
        </p>
        <p class="mt-4 text-md text-textLight dark:text-secondaryTextDark">
          When the stories estimate is not set, you will not be able to see each persons vote. They are hidden from
          each other until the editor or game admin toggles the visibility of the votes, or if the "Automatically
          show votes when all users vote?" option is enabled and all users have voted.
        </p>
        <p class="mt-4 text-md text-textLight dark:text-secondaryTextDark">
          Once the team has agreed on an estimate for the story, the editor or the game administrator can input the
          estimate and save it to the story. Once the estimate is set the editor or administrator can switch the story,
          or if "Automatically switch to the next story when estimate has been set?" option is enabled the game
          will automatically set the next available story as the current voting story.
        </p>
      </div>
    </div>
    <div class="lg:col-start-1">
      <div :class="{'pr-4 h-full md:mt-36 lg:mt-24 w-full': !isInModal}">
        <img class="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 w-auto" src="../../assets/Voting.png" alt="Voting interface" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddStory",

  props: {
    isInModal: {
      type: Boolean,
      default: false
    }
  }
}
</script>
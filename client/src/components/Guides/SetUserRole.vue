<template>
  <div :class="{'lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:grid-flow-col-dense lg:gap-12'
                : !isInModal, '' : isInModal}">
    <div class="max-w-xl mx-auto sm:px-6 lg:py-4 lg:max-w-none lg:mx-0 lg:px-0">
      <div class="p-4">
        <h2 class="text-3xl font-extrabold tracking-tight text-textLight" :class="{'dark:text-textDark' : !isInModal}">
          Set a Users role
        </h2>
        <p class="mt-4 text-lg text-textLight dark:text-secondaryTextDark">
          The user that creates a game will be assigned the "Administrator" role. As an administrator, you have the
          ability to assign special roles to the players of the game!
        </p>
        <div class="mt-4 border-t border-gray-200" />
        <p class="mt-4 text-md text-textLight dark:text-secondaryTextDark">
          To assign the a new role to a user, click on their name in the user list.
        </p>
        <p class="mt-4 text-md text-textLight dark:text-secondaryTextDark">
          Once you click on their name, a dialog will appear asking you to select the role to assign to the
          user. Once you select the desired role and click "Change Role", the users view will update in real time.
        </p>
        <p class="mt-4 text-md text-textLight dark:text-secondaryTextDark">
          If you chose the "Editor" role, the user will get access to managing the story details and will get access
          to setting story estimates.
        </p>
        <p class="mt-4 text-md text-textLight dark:text-secondaryTextDark">
          If you chose the "Viewer" role, the user can view the game, current story, and votes if they are displayed.
          But this user will not be able to participate in the game.
        </p>
        <p class="mt-4 text-md text-textLight dark:text-secondaryTextDark">
          If at any point you decide to update this users role to a different role you can access this dialog at any point.
        </p>
      </div>
    </div>
    <div :class="{'mt-12 sm:mt-16 lg:mt-0' : !isInModal, 'mb-3' : isInModal}">
      <div :class="{'lg:px-0 h-full lg:w-90 md:mt-36 lg:mt-24' : !isInModal}">
        <img class="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:left-0" src="../../assets/SetRole.png" alt="Set user role Interface" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SetRole",

  props: {
    isInModal: {
      type: Boolean,
      default: false
    }
  }
}
</script>
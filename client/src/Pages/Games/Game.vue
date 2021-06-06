<template>
  <div class="py-0 px-4 sm:px-6 lg:px-8">
    <Modal :open="showDeleteModal" @cancel="this.showDeleteModal = false;" @confirm="deleteGame">
      <template #title>
        Delete Game
      </template>
      <template #body>
        Are you sure you want to delete the game? All users will be kicked out and all progress with the
        story estimations will be lost!
      </template>
      <template #confirmText>
        Delete Game
      </template>
    </Modal>
    <Modal :open="showLeaveModal" @cancel="this.showLeaveModal = false;" @confirm="leaveGame">
      <template #title>
        Leave Game
      </template>
      <template #body>
        Are you sure you want to leave the game? All your votes will be lost!
      </template>
      <template #confirmText>
        Leave Game
      </template>
    </Modal>


    <Loader v-if="isLoading" loader-size="medium"/>
    <div class="max-w-max lg:max-w-7xl mx-auto" v-if="!isLoading">
      <div class="relative z-10 mb-8 md:mb-2 md:px-6">
        <div class="flex flex-1 justify-between text-base max-w-prose lg:max-w-none">
          <div class="relative">
          <h2 class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-callToAttention sm:text-4xl">
            {{ $gameStore.game.name }}
          </h2>
          <p class="text-sm tracking-wide text-textLight dark:text-textDark pt-2"
             v-if="$gameStore.game.description">
            {{ $gameStore.game.description }}
          </p>
          </div>
          <div class="flex flex-wrap content-end">
            <Button type="button" @click="startLeaveGame">Leave Game</Button>
            <Button type="error" @click="startDeleteGame" v-if="$userStore.isAdmin()">Delete Game</Button>
          </div>
        </div>
      </div>
      <div class="lg:grid lg:grid-cols-2 lg:gap-6" v-if="$userStore.isEditor()">
        <div class="bg-secondaryLight dark:bg-secondaryDark md:p-6 rounded-xl shadow-lg"
             v-if="$gameStore.game">
          <div class="pt-1 block sm:hidden">
            <div
                @click="copyLink"
                id="game_url"
                class="max-w-1/2 m-2 p-2 h-full rounded-md bg-primaryLight dark:bg-primaryDark block sm:hidden">
              <div class="flex flex-1 justify-between">
                <div class="transition ease-in-out delay-200 duration-150 w-8 h-5 pr-3">
                  <ClipboardCopyIcon class="text-white" v-show="!showCheck"/>
                  <CheckCircleIcon class="text-green-400 " v-show="showCheck"/>
                </div>

                <p class="text-textLight dark:text-secondaryTextDark dark:hover:text-textDarkHover text-xs truncate">
                  {{ $gameStore.gameUrl }}
                </p>
              </div>
            </div>
          </div>
          <div class="flex flex-1 mb-3 space-x-4 p-3">
            <p class="text-textLight dark:text-textDark"><span
                class="font-bold">Participants: </span>{{ $gameStore.game.users.length }}</p>
            <p class="text-textLight dark:text-textDark pr-6"><span class="font-bold">Votes: </span>{{ totalVotes }}</p>
            <div
                @click="copyLink"
                id="game_url"
                class="w-7/12 h-full rounded-md p-2 -mt-1 bg-primaryLight dark:bg-primaryDark hidden sm:block">
              <div class="flex flex-1 justify-between">
                <div class="transition ease-in-out delay-200 duration-150 w-8 h-5 pr-3">
                  <ClipboardCopyIcon class="text-white" v-show="!showCheck"/>
                  <CheckCircleIcon class="text-green-400 " v-show="showCheck"/>
                </div>

                <p class="text-textLight dark:text-secondaryTextDark dark:hover:text-textDarkHover text-xs truncate">
                  {{ $gameStore.gameUrl }}
                </p>
              </div>
            </div>
          </div>

          <CurrentStory v-if="$gameStore.currentStory" :force-reload="updateChildren"/>
        </div>
        <div class="space-y-3">
          <div class="bg-secondaryLight dark:bg-secondaryDark md:p-6 rounded-xl shadow-lg">

            <form class="flex space-x-2" @submit.prevent="submitPoints" v-if="$gameStore.currentStory">
              <div class="relative">
                <div class="w-full space-y-2 items-center justify-center">
                  <p class="text-textLight dark:text-textDark text-center">Votes
                    {{ $gameStore.currentStory.votesVisible ? 'Visible' : 'Hidden' }}</p>
                  <Button @click="toggleVoteVisibility" type="button">Show Votes</Button>
                </div>
              </div>
              <div class="w-full border-l-2 pl-3 space-y-2 border-gray-200">
                <Input type="text" id="story_total" v-model="storyTotal" required>Total Points</Input>
                <Button type="submit" :show-loader="submitting">Set Estimate</Button>
              </div>
            </form>

            <UserList />

          </div>
          <div class="bg-secondaryLight dark:bg-secondaryDark md:p-6 rounded-xl shadow-lg">
            <div class="flex flex-1 mb-3 space-x-4">
              <SwitchGroup as="div" class="flex items-center" v-if="$gameStore.hasStories">
                <Switch v-model="toggleCreateStory"
                        :class="[toggleCreateStory ? 'bg-cyan-600' : 'bg-gray-200', 'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500']">
                  <span class="sr-only">Toggle Add Stories</span>
                  <span aria-hidden="true"
                        :class="[toggleCreateStory ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200']"/>
                </Switch>
                <SwitchLabel as="span" class="ml-3">
                  <span class="text-sm font-medium text-textLight dark:text-textDark">Add Stories</span>
                </SwitchLabel>
              </SwitchGroup>
            </div>
            <CreateStory :toggle-create-story="toggleCreateStory" v-if="showAddStory"
                         :force-update="updateChildren"/>
          </div>
        </div>
      </div>
      <div class="lg:grid lg:grid-cols-2 lg:gap-6" v-else>
        <div class="bg-secondaryLight dark:bg-secondaryDark md:p-6 rounded-xl shadow-lg"
             v-if="$gameStore.game">
          <div class="pt-1 block sm:hidden">
            <div
                @click="copyLink"
                id="game_url"
                class="max-w-1/2 m-2 p-2 h-full rounded-md bg-primaryLight dark:bg-primaryDark block sm:hidden">
              <div class="flex flex-1 justify-between">
                <div class="transition ease-in-out delay-200 duration-150 w-8 h-5 pr-3">
                  <ClipboardCopyIcon class="text-white" v-show="!showCheck"/>
                  <CheckCircleIcon class="text-green-400 " v-show="showCheck"/>
                </div>

                <p class="text-textLight dark:text-secondaryTextDark dark:hover:text-textDarkHover text-xs truncate">
                  {{ $gameStore.gameUrl }}
                </p>
              </div>
            </div>
          </div>
          <div class="flex flex-1 mb-3 space-x-4 p-2">
            <p class="text-textLight dark:text-textDark"><span
                class="font-bold">Participants: </span>{{ $gameStore.game.users ? $gameStore.game.users.length : 0 }}
            </p>
            <p class="text-textLight dark:text-textDark"><span class="font-bold">Votes: </span>{{ totalVotes }}
            </p>
            <div
                @click="copyLink"
                id="game_url"
                class="w-7/12 h-full rounded-md p-2 -mt-1 bg-primaryLight dark:bg-primaryDark hidden sm:block">
              <div class="flex flex-1">
                <div class="transition ease-in-out delay-200 duration-150 w-8 h-5 pr-3">
                  <ClipboardCopyIcon class="text-white" v-show="!showCheck"/>
                  <CheckCircleIcon class="text-green-400 " v-show="showCheck"/>
                </div>

                <p class="text-textLight dark:text-secondaryTextDark dark:hover:text-textDarkHover text-xs truncate">
                  {{ $gameStore.gameUrl }}
                </p>
              </div>
            </div>
          </div>
          <CurrentStory v-if="$socketStore.socketSet" :force-reload="updateChildren"/>
        </div>
        <div class="space-y-3">
          <div class="bg-secondaryLight dark:bg-secondaryDark md:p-6 rounded-xl shadow-lg"
               v-if="$gameStore.hasUsers">
            <UserList />
          </div>
          <div class="bg-secondaryLight dark:bg-secondaryDark md:p-6 rounded-xl shadow-lg">
            <div class="text-textLight dark:text-textDark text-center pt-3" v-if="!$gameStore.hasStories > 0">
              No stories added yet!
            </div>
            <div class="text-textLight dark:text-textDark pt-3" v-else>
              <GameStories :force-update="updateChildren"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GameService from "../../services/GameService";
import CreateStory from '../../components/Game/Stories/CreateStory.vue'
import {Switch, SwitchGroup, SwitchLabel} from '@headlessui/vue'
import CurrentStory from "../../components/Game/Stories/CurrentStory.vue";
import Modal from "../../components/Modal.vue";
import Button from "../../components/Fields/Button.vue";
import utilMixin from "../../scripts/util-mixin";
import Input from "../../components/Fields/Input.vue"
import {CheckCircleIcon, ClipboardCopyIcon} from '@heroicons/vue/outline'
import UserService from "../../services/UserService";
import GameStories from "../../components/Game/Stories/GameStories.vue";
import {GameEvents, RoleType, UserEvents} from "../../constants/contants";
import Loader from "../../components/Loader.vue";
import UserList from "../../components/Game/UserList.vue";

export default {
  name: "Game",

  components: {
    UserList,
    Loader,
    GameStories,
    Button,
    Modal,
    CurrentStory,
    CreateStory,
    Input,
    Switch,
    SwitchGroup,
    SwitchLabel,
    CheckCircleIcon,
    ClipboardCopyIcon
  },

  mixins: [utilMixin],

  data() {
    return {
      showAddStory: true,
      toggleCreateStory: true,
      showVoteScreen: false,
      gameUrl: '',
      showDeleteModal: false,
      showLeaveModal: false,
      totalVotes: 0,
      storyTotal: '',
      showCheck: false,

      updateChildren: false,
      submitting: false
    }
  },

  beforeMount() {
    if (!this.$userStore.user) {
      this.$alertStore.error({"message": "An unknown error occurred!"});
      this.$router.push('/');
      return;
    }

    this.populateGame();
  },

  mounted() {
    this.initializeSockets();

    if (this.$userStore.joinedUser) {
      this.$socketStore.emitEvent(GameEvents.GAME_UPDATE, {gameId: this.$gameStore.game.gameId})
    }

    if (this.$gameStore.hasVotes) {
      this.handleAutoToggleVotes();
    }
  },

  computed: {
    isLoading() {
      return this.$gameStore.isLoading();
    },
  },

  methods: {
    populateGame() {
      this.updateChildren = true;
      GameService.loadGame(this.$route.params.id).then(() => {
        this.showAddStory = this.$userStore.isEditor();
        this.showVoteScreen = !this.showAddStory;
        this.setTotalVotes();
        this.updateChildren = false;

        if (!this.$gameStore.game) {
          this.$alertStore.warning({"message": "Game not found!"});
          this.$router.push('/createGame');
        }
      })
    },

    initializeSockets() {
      let gameId;
      if (!this.$route.params.id) {
        if (!this.$gameStore.game) {
          this.$alertStore.error({"message": "An error occurred!"});
          this.$router.push('/');
        }

        gameId = this.$gameStore.game.gameId;
      }

      this.$socketStore.createSocket(this.$userStore.user.userId, this.$route.params.id)
          .then(() => {
            let that = this;

            this.$socketStore.socket.on('client_update_game', function (data) {
              if (data.gameId !== that.$route.params.id) {
                return;
              }

              that.updateGame();
            })

            this.$socketStore.socket.on('client_game_was_delete', function (data) {
              if (data.gameId !== that.$route.params.id) {
                return;
              }

              that.$alertStore.warning({"message": "Game has been deleted by the admin!"});

              that.leaveGame();
            })

            this.$socketStore.socket.on('client_user_role_change', function (data) {
              if (data.userId !== that.$userStore.user.userId) {
                return;
              }

              UserService.GetCurrentUser().then(() => {
                that.updateGame();
              })
            })

            this.$socketStore.socket.on('client_story_was_added', function(data) {
              if (data.gameId !== that.$route.params.id) {
                return;
              }

              that.updateGame();
              that.handleAutoSwitchStory();
            })
          });
    },

    startDeleteGame() {
      this.showDeleteModal = true;
    },

    setTotalVotes() {
      if (!this.$gameStore.currentStory) {
        this.totalVotes = 0;
        return;
      }

      if (!this.$gameStore.currentStory.votes) {
        this.totalVotes = 0;
        return;
      }

      this.totalVotes = this.$gameStore.currentStory.votes.length > 0 ? this.$gameStore.currentStory.votes.length : 0;
    },

    deleteGame() {
      let gameId = this.$gameStore.game.gameId;
      GameService.deleteGame().then(() => {
        this.$router.push('/');

        this.$nextTick(() => {
          this.$gameStore.reset();
        })

        this.$socketStore.emitEvent(GameEvents.GAME_DELETE, {gameId: gameId});
      })
    },

    submitPoints() {
      if (!this.$userStore.isEditor()){
        return;
      }

      if (!this.storyTotal) {
        return;
      }
      this.submitting = true;

      let data = {gameId: this.$gameStore.game.gameId, storyPoint: this.storyTotal};

      GameService.submitStoryPoint(data).then(() => {
        if (!this.$gameStore.autoSwitchStory) {
          this.$socketStore.emitEvent(GameEvents.GAME_UPDATE, {gameId: this.$gameStore.game.gameId});
        }
        else {
          this.handleAutoSwitchStory();
        }

        this.storyTotal = null;
        this.submitting = false;
      });
    },

    copyLink() {
      let tempInput = document.createElement("input");
      tempInput.value = this.$gameStore.gameUrl;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);

      this.showCheck = true;

      setTimeout(() => {
        this.showCheck = false;
      }, 2000)
    },

    toggleVoteVisibility() {
      if (!this.$userStore.isAdmin()) {
        return;
      }

      GameService.toggleStoryVotesVisible({gameId: this.$gameStore.game.gameId}).then(() => {
        this.updateChildren = true;
        this.$socketStore.emitEvent(GameEvents.GAME_UPDATE, {gameId: this.$gameStore.game.gameId})
        this.updateChildren = false;
      });
    },

    updateGame() {
      this.populateGame();

      setTimeout(() => {
        this.$forceUpdate();
      }, 200)

    },

    startLeaveGame() {
      this.showLeaveModal = true;
    },

    leaveGame() {
      this.$router.push('/');

      this.showLeaveModal = false;

      this.$socketStore.emitEvent(GameEvents.LEAVE_GAME, {gameId: this.$gameStore.game.gameId})
    },

    handleAutoToggleVotes() {
      if (!this.$userStore.isAdmin()) {
        return;
      }

      if (!this.$gameStore.autoShowVotes) {
        return;
      }

      if (this.$gameStore.currentStory.votesVisible) {
        return;
      }

      if (this.totalVotes === this.$gameStore.users().length) {
        this.toggleVoteVisibility();
      }
    },

    handleAutoSwitchStory() {
      if (!this.$userStore.isAdmin()) {
        return;
      }

      if (!this.$gameStore.autoSwitchStory) {
        return;
      }

      if (!this.$gameStore.currentStory.storyPoint){
        return;
      }

      if (!this.$gameStore.nextStory) {
        return;
      }

      let story = this.$gameStore.nextStory

      if (!story) {
        return;
      }

      let data = {gameId: this.$gameStore.game.gameId, ...story};


      GameService.setCurrentStory(data).then(() => {
        this.updateChildren = true;
        this.$socketStore.emitEvent(GameEvents.GAME_UPDATE, {gameId: this.$gameStore.game.gameId});
        this.updateGame();
        this.updateChildren = false;
      })
    }
  },

  unmounted() {
    this.$socketStore.delete();
    this.$gameStore.reset();
  },

  watch: {
    '$gameStore.game.currentStoryId'(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.setTotalVotes();
      }
    },

    totalVotes(newVal, oldVal) {
      if (newVal === oldVal) {
        return;
      }

      this.handleAutoToggleVotes();
    }
  }
}
</script>
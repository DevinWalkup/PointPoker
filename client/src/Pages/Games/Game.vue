<template>
  <div class="py-0 xl:py-5 px-4 sm:px-6 lg:px-8">
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
    <div class="max-w-max lg:max-w-7xl mx-auto" v-if="!isLoading">
      <div class="relative z-10 mb-8 md:mb-2 md:px-6">
        <div class="flex flex-1 justify-between text-base max-w-prose lg:max-w-none">
          <h2 class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-callToAttention sm:text-4xl">
            {{ $gameStore.game.name }}
          </h2>
          <div class="flex flex-wrap content-end">
              <Button type="button" @click="startLeaveGame">Leave Game</Button>
              <Button type="error" @click="startDeleteGame" v-if="$userStore.isEditor()">Delete Game</Button>
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

          <CurrentStory v-if="$gameStore.currentStory" @story-update="updateGame" :socket="socket"/>
        </div>
        <div class="space-y-3">
          <div class="bg-secondaryLight dark:bg-secondaryDark md:p-6 rounded-xl shadow-lg"
               v-if="$gameStore.currentStory">

            <form class="flex space-x-2" @submit.prevent="submitPoints">
              <div class="relative">
                <div class="w-full space-y-2 items-center justify-center">
                  <p class="text-textLight dark:text-textDark text-center">Votes
                    {{ $gameStore.currentStory.votesVisible ? 'Visible' : 'Hidden' }}</p>
                  <Button @click="toggleVoteVisibility" type="button">Show Votes</Button>
                </div>
              </div>
              <div class="w-full border-l-2 pl-3 space-y-2 border-gray-200">
                <Input type="text" id="story_total" v-model="storyTotal" required>Total Points</Input>
                <Button type="submit">Accept Round</Button>
              </div>
            </form>

          </div>
          <div class="bg-secondaryLight dark:bg-secondaryDark md:p-6 rounded-xl shadow-lg">
            <div class="flex flex-1 mb-3 space-x-4">
              <SwitchGroup as="div" class="flex items-center" v-if="$gameStore.game.stories.length > 0">
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
            <CreateStory :toggle-create-story="toggleCreateStory" v-if="showAddStory" @change-story="updateGame"
                         :socket="socket"/>
          </div>
        </div>
      </div>
      <div class="w-full" v-else>
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
                class="font-bold">Total Participants: </span>{{ $gameStore.game.users.length }}</p>
            <p class="text-textLight dark:text-textDark"><span class="font-bold">Total Votes: </span>{{ totalVotes }}
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
          <CurrentStory @story-update="updateGame" :socket="socket"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GameService from "../../services/GameService";
import CreateStory from '../../components/Stories/CreateStory.vue'
import {Switch, SwitchGroup, SwitchLabel} from '@headlessui/vue'
import CurrentStory from "../../components/Stories/CurrentStory.vue";
import Modal from "../../components/Modal.vue";
import Button from "../../components/Fields/Button.vue";
import utilMixin from "../../scripts/util-mixin";
import Input from "../../components/Fields/Input.vue"
import {CheckCircleIcon, ClipboardCopyIcon} from '@heroicons/vue/outline'
import io from 'socket.io-client'
import {GameEvents} from "../../../../backend/Types/SocketEvents";

export default {
  name: "Game",

  components: {
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
      socket: io(`${import.meta.env.VITE_API_URL}`, {query: `userid=${this.$userStore.user.userId}&gameid=${this.$route.params.id}`})
    }
  },

  beforeMount() {
    if (!this.$gameStore.game) {
      this.populateGame();
    }
  },

  mounted() {
    this.initializeSockets();
  },

  computed: {
    isLoading() {
      return this.$gameStore.isLoading();
    },
  },

  methods: {
    populateGame() {
      GameService.loadGame(this.$route.params.id).then(game => {
        this.showAddStory = this.$userStore.isEditor();
        this.showVoteScreen = !this.showAddStory;
        this.setTotalVotes();

        if (!this.$gameStore.game) {
          this.$alertStore.warning({"message": "Game not found!"});
          this.$router.push('/createGame');
        }
      })
    },

    initializeSockets() {
      let that = this;
      this.socket.on('client_update_game', function (gameId) {
        if (gameId !== that.$route.params.id) {
          return;
        }

        that.populateGame();
      })

      this.socket.on('client_game_was_delete', function (gameId) {
        if (gameId !== that.$route.params.id) {
          return;
        }

        that.$alertStore.warning({"message": "Game has been deleted the admin user!"});

        that.$router.push('/');

        that.socket.delete();
      })
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
      GameService.deleteGame().then(status => {
        if (status) {
          this.socket.emit(GameEvents.GAME_DELETE, {gameId: gameId});
          this.$router.push('/')
        }
      })
    },

    submitPoints() {
      if (!this.storyTotal) {
        return;
      }

      let data = {gameId: this.$gameStore.game.gameId, storyPoint: this.storyTotal};

      GameService.submitStoryPoint(data).then(() => {
        this.socket.emit(GameEvents.GAME_UPDATE, {gameId: this.$gameStore.game.gameId});
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
      GameService.toggleStoryVotesVisible({gameId: this.$gameStore.game.gameId});
    },

    updateGame() {
      this.$forceUpdate();

      this.populateGame();
    },

    startLeaveGame() {
      this.showLeaveModal = true;
    },

    leaveGame() {
      this.showLeaveModal = false;

      this.socket.emit(GameEvents.LEAVE_GAME, {gameId: this.$gameStore.game.gameId})

      this.$gameStore.reset();

      this.$router.push('/');
    }
  },

  watch: {
    '$gameStore.game.currentStoryId'(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.setTotalVotes();
      }
    }
  }
}
</script>
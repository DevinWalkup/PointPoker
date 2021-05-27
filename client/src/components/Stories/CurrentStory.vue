<template>
  <div
      class="rounded-lg bg-primaryLight dark:bg-primaryDark overflow-hidden">
    <template v-if="$gameStore.currentStory">
      <div class="relative w-full" v-if="$gameStore.currentStory.storyPoint">
        <div class="absolute right-2 top-2">
        <span class="items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Estimate: {{
            $gameStore.currentStory.storyPoint
          }}</span>
        </div>
      </div>
      <template v-if="!canEdit">
        <div :id="`structured_body_${$gameStore.currentStory.storyId}`" v-if="isStructured">
          <div class="p-4 text-center space-y-4">
            <div>
              <p class="font-bold text-textLight dark:text-textDark border-b border-gray-300 pt-2 pb-2">
                As A
              </p>
              <p class="text-sm text-textLight dark:text-textDark">{{ $gameStore.currentStory.as }}</p>
            </div>
            <div>
              <p class="font-bold text-textLight dark:text-textDark border-b border-gray-300 pt-2 pb-2">
                I Would Like
              </p>
              <p class="text-sm text-textLight dark:text-textDark">{{ $gameStore.currentStory.like }}</p>
            </div>
            <div>
              <p class="font-bold text-textLight dark:text-textDark border-b border-gray-300 pt-2 pb-2">
                So That
              </p>
              <p class="text-sm text-textLight dark:text-textDark">{{ $gameStore.currentStory.so }}</p>
            </div>
            <div>
              <p class="font-bold text-textLight dark:text-textDark border-b border-gray-300 pt-2 pb-2">
                Notes
              </p>
              <p class="text-sm text-textLight dark:text-textDark">{{ $gameStore.currentStory.notes }}</p>
            </div>
            <div>
              <p class="font-bold text-textLight dark:text-textDark border-b border-gray-300 pt-2 pb-2">
                Vote
              </p>
              <div class="flex flex-1 justify-center pb-3 mt-2">
                <div class="px-2 w-full justify-between">
                  <ul class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
                    <li v-for="(point, idx) in points" :key="idx"
                        class="col-span-2 bg-secondaryLight dark:bg-secondaryDark rounded-lg shadow divide-y divide-gray-200 hover:bg-primaryLight dark:hover:bg-secondaryDarkHover"
                        @click="castVote(point)">
                      <div class="w-full flex items-center justify-between text-center p-8 space-x-3">
                        <div class="flex-1 text-center">
                          <h3 class="text-textLight dark:text-textDark text-lg font-medium truncate">{{ point }}</h3>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div v-if="currentVote">
              <p class="font-bold text-textLight dark:text-textDark border-b border-gray-300 pt-2 pb-2">
                Current Vote
              </p>
              <div
                  class="col-span-2 bg-secondaryLight dark:bg-secondaryDark rounded-lg shadow divide-y divide-gray-200">
                <div class="w-full flex items-center justify-between text-center p-8 space-x-3">
                  <div class="flex-1 text-center">
                    <h3 class="text-textLight dark:text-textDark text-lg font-medium truncate">{{ currentVote }}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div :id="`structured_body_${$gameStore.currentStory.storyId}`" v-if="!isStructured">
          <div class="p-4 text-center space-y-4">
            <div>
              <p class="font-bold text-textLight dark:text-textDark border-b border-gray-300 pt-2 pb-2">
                Story
              </p>
              <p class="text-sm text-textLight dark:text-textDark">{{ $gameStore.currentStory.story }}</p>
            </div>
            <div>
              <p class="font-bold text-textLight dark:text-textDark border-b border-gray-300 pt-2 pb-2">
                Notes
              </p>
              <p class="text-sm text-textLight dark:text-textDark">{{ $gameStore.currentStory.notes }}</p>
            </div>
            <div>
              <p class="font-bold text-textLight dark:text-textDark border-b border-gray-300 pt-2 pb-2">
                Vote
              </p>
              <div class="flex flex-1 justify-center pb-3 mt-2">
                <div class="px-2 w-full justify-between">
                  <ul class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
                    <li v-for="(point, idx) in points" :key="idx"
                        class="col-span-2 bg-secondaryLight dark:bg-secondaryDark rounded-lg shadow divide-y divide-gray-200 hover:bg-primaryLight dark:hover:bg-secondaryDarkHover"
                        @click="castVote(point)">
                      <div class="w-full flex items-center justify-between text-center p-8 space-x-3">
                        <div class="flex-1 text-center">
                          <h3 class="text-textLight dark:text-textDark text-lg font-medium truncate">{{ point }}</h3>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div v-if="currentVote">
              <p class="font-bold text-textLight dark:text-textDark border-b border-gray-300 pt-2 pb-2">
                Current Vote
              </p>
              <div
                  class="col-span-2 bg-secondaryLight dark:bg-secondaryDark rounded-lg shadow divide-y divide-gray-200">
                <div class="w-full flex items-center justify-between text-center p-8 space-x-3">
                  <div class="flex-1 text-center">
                    <h3 class="text-textLight dark:text-textDark text-lg font-medium truncate">{{ currentVote }}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div :id="`structured_body_${$gameStore.currentStory.storyId}`" v-if="!isStructured">
          <div class="p-4 text-center space-y-4">
            <div>
              <p class="font-bold text-textLight dark:text-textDark border-b border-gray-300 pt-2 pb-2">
                Story
              </p>
              <Input type="text" required validator="empty" id="story_story" placeholder="Story..."
                     v-model="storyData.story"/>
            </div>
            <div>
              <p class="font-bold text-textLight dark:text-textDark border-b border-gray-300 pt-2 pb-2">
                Notes
              </p>
              <TextArea required validator="empty" id="story_notes" placeholder="Notes..." v-model="storyData.notes"/>
            </div>
            <div>
              <p class="font-bold text-textLight dark:text-textDark border-b border-gray-300 pt-2 pb-2">
                Vote
              </p>
              <div class="flex flex-1 justify-center pb-3 mt-2">
                <div class="px-2 w-full justify-between">
                  <ul class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
                    <li v-for="(point, idx) in points" :key="idx"
                        class="col-span-2 bg-secondaryLight dark:bg-secondaryDark rounded-lg shadow divide-y divide-gray-200 hover:bg-primaryLight dark:hover:bg-secondaryDarkHover"
                        @click="castVote(point)">
                      <div class="w-full flex items-center justify-between text-center p-8 space-x-3">
                        <div class="flex-1 text-center">
                          <h3 class="text-textLight dark:text-textDark text-lg font-medium truncate">{{ point }}</h3>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div v-if="currentVote">
              <p class="font-bold text-textLight dark:text-textDark border-b border-gray-300 pt-2 pb-2">
                Current Vote
              </p>
              <div
                  class="col-span-2 bg-secondaryLight dark:bg-secondaryDark rounded-lg shadow divide-y divide-gray-200">
                <div class="w-full flex items-center justify-between text-center p-8 space-x-3">
                  <div class="flex-1 text-center">
                    <h3 class="text-textLight dark:text-textDark text-lg font-medium truncate">{{ currentVote }}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </template>
    <template v-else>
      <div class="relative w-full h-16 relative text-lg text-textLight dark:text-textDark tracking-wide font-bold">
        <p class="flex flex-1 w-full h-full justify-center items-center text-center">
          There are no stories yet
        </p>
      </div>
    </template>
  </div>
</template>

<script>
import GameService from "../../services/GameService";
import Input from "../Fields/Input.vue";
import TextArea from "../Fields/TextArea.vue";
import utilMixin from "../../scripts/util-mixin";
import {Socket} from "socket.io-client";
import {GameEvents} from "../../../../backend/Types/SocketEvents";

export default {
  components: {Input, TextArea},

  mixins: [utilMixin],

  props: {
    socket: {
      type: Socket,
      required: true
    }
  },

  data() {
    return {
      points: this.$gameStore.currentPoints,
      currentVote: null,
      isMounted: false,

      storyData: {},

      originalData: {}
    }
  },

  computed: {
    isStructured() {
      return this.$gameStore.currentStory.storyType === "Structured";
    },

    canEdit() {
      return this.$userStore.isEditor();
    }
  },

  mounted() {
    if (!this.$gameStore.currentStory){
      this.isMounted = true;
      return;
    }

    this.getCurrentVote();
    this.setLocalData();

    this.isMounted = true;
  },

  methods: {
    castVote(point) {
      this.currentVote = point;

      let data = {gameId: this.$gameStore.game.gameId, storyId: this.$gameStore.currentStory.storyId, vote: point};

      GameService.castVote(data).then(() => {
        this.socket.emit(GameEvents.GAME_UPDATE, {gameId: this.$gameStore.game.gameId});
        this.$emit('story-update')
      });
    },

    setLocalData() {
      this.storyData = {...this.$gameStore.currentStory}
      this.originalData = JSON.parse(JSON.stringify(this.storyData));
    },

    getCurrentVote() {
      debugger;
      if (!this.$gameStore.currentStory){
        return;
      }

      let votes = this.$gameStore.currentStory.votes;

      if (!votes) {
        return;
      }

      this.currentVote = votes.filter(vote => vote.userId === this.$userStore.user.userId)[0]?.castedVote;
    },

    updateCurrentStory() {
      let data = {gameId: this.$gameStore.game.gameId, ...this.storyData};


      GameService.UpdateStory(data).then(() => {
        this.socket.emit(GameEvents.GAME_UPDATE, {gameId: this.$gameStore.game.gameId});
        this.setLocalData();

        this.$emit('story-update');
      })
    }

  },

  watch: {
    '$gameStore.game.currentStoryId'(newVal, oldVal) {
      if (newVal === oldVal) {
        return;
      }

      this.getCurrentVote();
      this.setLocalData();
      this.$forceUpdate();
    },

    storyData: {
      deep: true,
      handler(newVal) {
        if (!this.isMounted) {
          return;
        }

        if (this.areEquivalent(newVal, this.originalData)) {
          return;
        }

        this.debounce(this.updateCurrentStory, 2000);
      }
    }
  }
}
</script>
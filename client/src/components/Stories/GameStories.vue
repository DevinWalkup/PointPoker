<template>
  <Modal :open="confirmDelete" @cancel="cancelDelete" @confirm="deleteStory">
    <template #title>
      Delete Story?
    </template>
    <template #body>
      Are you sure you want to delete this story? This story will be lost!
    </template>
    <template #confirmText>
      Remove Story
    </template>
  </Modal>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <div
        @mouseover="setHoverStory(story)"
        @mouseleave="hoverStory = null"
        v-for="story in stories" :key="story.storyId"
         class="relative rounded-lg border border-gray-300 bg-primaryLight dark:bg-primaryDark px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-cyan-500">
      <div class="absolute left-2 top-2">
        <TrashIcon class="text-red-400 w-5 h-5 cursor-pointer" v-show="showHoverIcons(story)" @click="askDeleteStory(story)"/>
      </div>
      <div class="absolute right-2 top-2">
              <span class="items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    v-if="isCurrent(story)">Current</span>
        <span class="items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 cursor-pointer" @click="setCurrentStory(story)"
              v-if="!isCurrent(story) && showHoverIcons(story)">Set Current</span>
      </div>
      <div class="flex-1 min-w-0" :class="{'mt-2' : isCurrent(story)}">
        <div class="focus:outline-none">
          <div class="relative w-full">
            <p class="text-sm font-medium text-textLight dark:text-textDark" v-if="!isStructuredStory(story)">
              {{ story.story }}
            </p>
            <p class="text-sm font-medium text-textLight dark:text-textDark" v-if="isStructuredStory(story)">
              As a "{{ story.as }}" I would like "{{ story.like }}" so that "{{ story.so }}"
            </p>
            <p class="text-sm text-textLight dark:text-textDark truncate">
              {{ story.notes }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GameService from "../../services/GameService";
import {TrashIcon} from '@heroicons/vue/outline'
import Modal from "../Modal.vue";
import {Socket} from "socket.io-client";
import {GameEvents} from "../../../../backend/Types/SocketEvents";

export default {
  name: "GameStories",

  components: {
    Modal,
    TrashIcon
  },

  props: {
    socket: {
      type: Socket,
      required: true
    }
  },

  emits: ['change-story'],

  data() {
    return {
      stories: this.$gameStore.game.stories,
      hoverStory: null,
      confirmDelete: false,
      storyToDelete: null
    }
  },

  methods: {
    isStructuredStory(story) {
      return story.storyType === "1"
    },

    isCurrent(story) {
      return this.$gameStore.currentStory.storyId === story.storyId;
    },

    setCurrentStory(story) {
      if (this.$gameStore.currentStory.storyId === story.storyId) {
        return;
      }

      GameService.setCurrentStory({storyId: story.storyId, gameId: this.$gameStore.game.gameId}).then(() => {
        this.stories = [];

        this.stories = this.$gameStore.game.stories;

        this.socket.emit(GameEvents.GAME_UPDATE, this.$gameStore.game.gameId);

        this.$emit('change-story');
      });
    },

    setHoverStory(story){
      this.hoverStory = story;
    },

    showHoverIcons(story) {
      if (!this.hoverStory){
        return;
      }

      return story.storyId === this.hoverStory.storyId;
    },

    askDeleteStory(story) {
      this.storyToDelete = story;
      this.confirmDelete = true;
    },

    cancelDelete() {
      this.storyToDelete = null;
      this.hoverStory = null;
      this.confirmDelete = false;
    },

    deleteStory() {
      let data = {gameId: this.$gameStore.game.gameId, storyId: this.storyToDelete.storyId};

      this.hoverStory = null;
      this.storyToDelete = null;
      this.confirmDelete = false;

      GameService.DeleteStory(data).then(() => {
        this.stories = this.$gameStore.game.stories;
        this.socket.emit(GameEvents.GAME_UPDATE, this.$gameStore.game.gameId);
        this.$emit('change-story');
      })
    }
  },

  watch: {
    '$gameStore.game.stories':{
      deep: true,
      handler(newVal) {
        this.stories = newVal;
      }
    }
  }
}
</script>
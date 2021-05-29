<template>
  <div class="sm:hidden">
    <label for="tabs" class="sr-only">Select a story type</label>
    <select id="tabs" name="tabs"
            class="bg-secondaryLight dark:bg-secondaryDark block w-full text-textLight dark:text-textDark rounded-md"
            @change="changeTab">
      <option v-for="tab in tabs" :key="tab.name" :selected="tab.current">{{ tab.name }}</option>
    </select>
  </div>
  <div class="hidden sm:block">
    <nav class="-mb-px flex justify-center" aria-label="Tabs">
      <div
          @click="selectTab(tab.name)"
          v-for="tab in tabs"
          :key="tab.name"
          :class="[tab.current ? 'border-cyan-500 text-cyan-600' : 'border-gray-800 dark:border-gray-200 text-textLight dark:text-textDark hover:text-textLightHover dark:hover:text-textDarkHover hover:border-gray-400 dark:hover:border-gray-300', 'w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm']"
          :aria-current="tab.current ? 'page' : undefined">
        {{ tab.name }}
      </div>
    </nav>
  </div>
  <form class="p-4 space-y-8 divide-y divide-gray-200 bg-secondaryLight dark:bg-secondaryDark p-3" v-if="!isListView"
        @submit.prevent="submitForm">
    <div class="space-y-8 divide-y divide-gray-200 sm:space-y-5">
      <div>
        <div class="mt-6 sm:mt-5 space-y-6 sm:space-y-5" v-if="isFreeForm">
          <TextArea validator="empty" id="story_story" v-model="formData.Story"
                    description="Type or copy your story as free-form text" required>Story</TextArea>
          <TextArea id="story_notes" v-model="formData.Notes">Notes</TextArea>
        </div>
        <div class="mt-6 sm:mt-5 space-y-6 sm:space-y-5" v-if="isStructured">
          <Input validator="empty" id="story_as" v-model="formData.As" required>As a/an...</Input>
          <Input validator="empty" id="story_like" v-model="formData.Like" required>I would like to...</Input>
          <Input validator="empty" id="story_so" v-model="formData.So" required>So that...</Input>
          <TextArea id="story_notes" v-model="formData.Notes">Notes</TextArea>
        </div>
      </div>
    </div>

    <div class="pt-5">
      <div class="flex justify-start space-x-4">
        <Button type="submit" :show-loader="submitting">
          Save
        </Button>
        <Button v-if="!hasStories" @click="cancel" type="button">
          Cancel
        </Button>
      </div>
    </div>
  </form>
  <div class="p-4 space-y-8 divide-y divide-gray-200 bg-secondaryLight dark:bg-secondaryDark p-3" v-if="isListView">
    <div class="text-textLight dark:text-textDark text-center pt-3" v-if="!hasStories">
      No stories added yet!
    </div>
    <div class="text-textLight dark:text-textDark pt-3" v-else>
      <GameStories @change-story="changeStory" :force-update="forceUpdate"/>
    </div>
  </div>
</template>

<script>
import Input from '../Fields/Input.vue'
import TextArea from '../Fields/TextArea.vue'
import GameService from "../../services/GameService";
import GameStories from "./GameStories.vue";
import Button from "../Fields/Button.vue";
import {GameEvents} from "../../constants/contants";

export default {
  name: "CreateStory",

  components: {
    Button,
    GameStories,
    Input,
    TextArea,
  },

  props: {
    toggleCreateStory: {
      type: Boolean,
      required: true
    },

    forceUpdate: {
      type: Boolean,
      required: true
    }
  },

  emits: ['change-story'],

  data() {
    return {
      tabs: [
        {name: 'Free-Form', storyType: 0, current: false},
        {name: 'Structured', storyType: 1, current: false},
        {name: 'Stories', storyType: -1, current: false},
      ],

      currentTab: null,

      formData: {
        Story: '',
        As: '',
        Like: '',
        So: '',
        Notes: '',
        StoryType: -1,
        GameId: ''
      },

      submitting: false,

      stories: this.$gameStore.game.stories
    }
  },

  mounted() {
    this.selectTab('Structured')

    this.formData.GameId = this.$gameStore.game.gameId;
  },

  computed: {
    isFreeForm() {
      return this.currentTab?.name === "Free-Form"
    },

    isStructured() {
      return this.currentTab?.name === "Structured";
    },

    isListView() {
      return this.currentTab?.name === "Stories"
    },

    hasStories() {
      return this.stories?.length > 0;
    },
  },

  methods: {
    selectTab(name) {
      this.tabs.forEach(tab => {
        if (tab.name === name) {
          this.currentTab = tab;
          tab.current = true;
          this.formData.StoryType = tab.storyType;
        } else {
          tab.current = false;
        }
      })
    },

    changeTab(e) {
      this.selectTab(e.target.value);
    },

    submitForm() {
      this.submitting = true;
      if (!this.formData.GameId){
        this.formData.GameId = this.$gameStore.game.gameId;
      }

      GameService.addStory(this.formData).then(() => {
        this.stories = this.$gameStore.game.stories;

        this.formData = {
          Story: '',
          As: '',
          Like: '',
          So: '',
          Notes: '',
        }

        this.changeStory();

        this.$socketStore.emitEvent(GameEvents.GAME_UPDATE, {gameId: this.$gameStore.game.gameId});
        this.submitting = false;
      });
    },

    cancel() {
      if (this.hasStories) {
        return;
      }

      GameService.deleteGame().then(status => {
        if (status) {
          this.$socketStore.emitEvent(GameEvents.GAME_DELETE, {gameId: this.$gameStore.game.gameId});
          this.$router.push('/')}
      })
    },

    toggleStoryCreation(enable) {
      if (enable) {
        this.tabs = [
          {name: 'Free-Form', storyType: 0, current: false},
          {name: 'Structured', storyType: 1, current: false},
          {name: 'Stories', storyType: -1, current: false},
        ]

        this.selectTab('Structured')
      } else {
        this.tabs = [
          {name: 'Stories', storyType: -1, current: false}
        ]
        this.selectTab('Stories')
      }
    },

    changeStory() {
      this.$emit('change-story')
    }
  },

  watch: {
    toggleCreateStory(newVal, oldVal) {
      if (newVal === oldVal) {
        return;
      }

      this.toggleStoryCreation(newVal);
    }
  }
}
</script>
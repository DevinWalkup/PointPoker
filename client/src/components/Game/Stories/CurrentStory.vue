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
        <div :id="`structured_body_${$gameStore.currentStory.storyId}`">
          <div class="p-4 text-center space-y-4">
            <div v-if="!isStructured">
              <p class="font-bold text-textLight dark:text-textDark border-b border-gray-300 pt-2 pb-2">
                Story
              </p>
              <p class="text-sm text-textLight dark:text-textDark">{{ $gameStore.currentStory.story }}</p>
            </div>
            <div v-if="isStructured">
              <p class="font-bold text-textLight dark:text-textDark border-b border-gray-300 pt-2 pb-2">
                As A
              </p>
              <p class="text-sm text-textLight dark:text-textDark">{{ $gameStore.currentStory.as }}</p>
            </div>
            <div v-if="isStructured">
              <p class="font-bold text-textLight dark:text-textDark border-b border-gray-300 pt-2 pb-2">
                I Would Like
              </p>
              <p class="text-sm text-textLight dark:text-textDark">{{ $gameStore.currentStory.like }}</p>
            </div>
            <div v-if="isStructured">
              <p class="font-bold text-textLight dark:text-textDark border-b border-gray-300 pt-2 pb-2">
                So That
              </p>
              <p class="text-sm text-textLight dark:text-textDark">{{ $gameStore.currentStory.so }}</p>
            </div>
            <div v-if="$gameStore.currentStory.notes">
              <p class="font-bold text-textLight dark:text-textDark border-b border-gray-300 pt-2 pb-2">
                Notes
              </p>
              <p class="text-sm text-textLight dark:text-textDark">{{ $gameStore.currentStory.notes }}</p>
            </div>
            <div v-if="$gameStore.currentStory.url">
              <p class="font-bold text-textLight dark:text-textDark border-b border-gray-300 pt-2 pb-2">
                Story Url
              </p>
              <a :href="handleStoryUrl($gameStore.currentStory.url)" target="_blank" class="text-blue-600 hover:text-blue-800">{{$gameStore.currentStory.url}}</a>
            </div>
            <div
                v-if="!$gameStore.currentStory.votesVisible && !currentVote || editVote">
              <p class="font-bold text-textLight dark:text-textDark border-b border-gray-300 pt-2 pb-2">
                Vote
              </p>
              <div class="flex flex-1 justify-center mt-2">
                <div class="px-2 w-full justify-between">
                  <ul class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
                    <li v-for="(point, idx) in points" :key="idx"
                        class="col-span-2 bg-secondaryLight dark:bg-secondaryDark rounded-lg shadow divide-y divide-gray-200 hover:bg-primaryLight dark:hover:bg-secondaryDarkHover"
                        @click="castVote(point)">
                      <div class="w-full flex items-center justify-between text-center p-3 space-x-3">
                        <div class="flex-1 text-center">
                          <h3 class="text-textLight dark:text-textDark text-lg font-medium truncate">{{ point }}</h3>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div v-if="currentVote && (!$gameStore.currentStory.votesVisible || !editVote)">
              <p class="font-bold text-textLight dark:text-textDark border-b border-gray-300">
                Current Vote
              </p>
              <div class="col-span-2 bg-secondaryLight dark:bg-secondaryDark rounded-lg shadow">
                <div class="w-full p-2">
<!--                  <SwitchGroup as="div" class="flex items-center" v-if="$gameStore.hasStories && !$gameStore.currentStory.storyPoint">-->
<!--                    <Switch v-model="editVote"-->
<!--                            :class="[editVote ? 'bg-cyan-600' : 'bg-gray-200', 'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500']">-->
<!--                      <span class="sr-only">Toggle Add Stories</span>-->
<!--                      <span aria-hidden="true"-->
<!--                            :class="[editVote ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200']"/>-->
<!--                    </Switch>-->
<!--                    <SwitchLabel as="span" class="ml-3">-->
<!--                      <span class="text-sm font-medium text-textLight dark:text-textDark">Edit Vote</span>-->
<!--                    </SwitchLabel>-->
<!--                  </SwitchGroup>-->
                </div>
                <div class="w-full flex items-center justify-between text-center pb-3 space-x-3">
                  <div class="flex-1 text-center">
                    <h3 class="text-textLight dark:text-textDark text-lg font-medium truncate">{{ currentVote }}</h3>
                  </div>
                </div>
              </div>
            </div>
            <div class="w-full p-2" v-if="currentVote">
              <Button type="submit" @click="toggleEditVote" :show-loader="submittingVoteChange">{{editVoteText}}</Button>
            </div>
            <div v-if="$gameStore.currentStory.votesVisible">
              <p class="font-bold text-textLight dark:text-textDark border-b border-gray-300 pt-2 pb-2">
                Votes
              </p>
              <div class="flex flex-1 justify-center pb-3 mt-2">
                <div class="px-2 w-full justify-between">
                  <ul class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
                    <li v-for="(vote, idx) in $gameStore.currentStory.votes" :key="idx"
                        class="col-span-2 bg-secondaryLight dark:bg-secondaryDark rounded-lg shadow divide-y divide-gray-200 hover:bg-primaryLight dark:hover:bg-secondaryDarkHover">
                      <div class="w-full flex items-center justify-between text-center p-3">
                        <div class="flex-1 text-center">
                          <h3 class="text-textLight dark:text-textDark text-lg font-bold truncate">{{
                              vote.castedVote
                            }}</h3>
                          <p class="text-textLight dark:text-textDark font-normal text-sm">{{ vote.name }}</p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-if="canEdit">
        <div :id="`structured_body_${$gameStore.currentStory.storyId}`">
          <div class="p-4 text-center space-y-4">
            <div v-if="!isStructured">
              <p class="font-bold text-textLight dark:text-textDark border-b border-gray-300 pt-2 pb-2">
                Story
              </p>
              <Input type="text" required validator="empty" id="current_story_story" placeholder="Story..."
                     v-model="storyData.story"/>
            </div>
            <div v-if="isStructured">
              <p class="font-bold text-textLight dark:text-textDark border-b border-gray-300 pt-2 pb-2">
                As A
              </p>
              <Input placeholder="As a..." id="current_story_as" validator="empty" required v-model="storyData.as"/>
            </div>
            <div v-if="isStructured">
              <p class="font-bold text-textLight dark:text-textDark border-b border-gray-300 pt-2 pb-2">
                I Would Like
              </p>
              <Input placeholder="I would like..." id="current_story_like" validator="empty" required
                     v-model="storyData.like"/>
            </div>
            <div v-if="isStructured">
              <p class="font-bold text-textLight dark:text-textDark border-b border-gray-300 pt-2 pb-2">
                So That
              </p>
              <Input placeholder="So that..." id="current_story_so" validator="empty" required v-model="storyData.so"/>
            </div>
            <div>
              <p class="font-bold text-textLight dark:text-textDark border-b border-gray-300 pt-2 pb-2">
                Notes
              </p>
              <TextArea placeholder="Notes.." id="current_story_notes" v-model="storyData.notes"/>
            </div>
            <div v-if="$gameStore.currentStory.url">
              <p class="font-bold text-textLight dark:text-textDark border-b border-gray-300 pt-2 pb-2">
                Current Url
              </p>
              <a :href="handleStoryUrl($gameStore.currentStory.url)" target="_blank" class="text-blue-600 hover:text-blue-800">{{$gameStore.currentStory.url}}</a>
            </div>
            <div>
              <p class="font-bold text-textLight dark:text-textDark border-b border-gray-300 pt-2 pb-2">
                Story Url
              </p>
              <Input id="url" v-model="storyData.url">Story Url</Input>
            </div>
            <div
                v-if="!$gameStore.currentStory.votesVisible && !currentVote || editVote">
              <p class="font-bold text-textLight dark:text-textDark border-b border-gray-300 pt-2 pb-2">
                Vote
              </p>
              <div class="flex flex-1 justify-center mt-2">
                <div class="px-2 w-full justify-between">
                  <ul class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
                    <li v-for="(point, idx) in points" :key="idx"
                        class="col-span-2 bg-secondaryLight dark:bg-secondaryDark rounded-lg shadow divide-y divide-gray-200 hover:bg-primaryLight dark:hover:bg-secondaryDarkHover"
                        @click="castVote(point)">
                      <div class="w-full flex items-center justify-between text-center p-3 space-x-3">
                        <div class="flex-1 text-center">
                          <h3 class="text-textLight dark:text-textDark text-lg font-medium truncate">{{ point }}</h3>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div v-if="currentVote && (!$gameStore.currentStory.votesVisible || !editVote)">
              <p class="font-bold text-textLight dark:text-textDark border-b border-gray-300">
                Current Vote
              </p>
              <div class="col-span-2 bg-secondaryLight dark:bg-secondaryDark rounded-lg shadow">
                <div class="w-full flex items-center justify-between text-center pb-3 space-x-3">
                  <div class="flex-1 text-center">
                    <h3 class="text-textLight dark:text-textDark text-lg font-medium truncate">{{ currentVote }}</h3>
                  </div>
                </div>
              </div>
            </div>
            <div class="w-full p-2" v-if="currentVote">
              <Button type="submit" @click="toggleEditVote" :show-loader="submittingVoteChange">{{editVoteText}}</Button>
            </div>
            <div v-if="$gameStore.currentStory.votesVisible">
              <p class="font-bold text-textLight dark:text-textDark border-b border-gray-300 pt-2 pb-2">
                Votes
              </p>
              <div class="flex flex-1 justify-center pb-3 mt-2">
                <div class="px-2 w-full justify-between">
                  <ul class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
                    <li v-for="(vote, idx) in $gameStore.currentStory.votes" :key="idx"
                        class="col-span-2 bg-secondaryLight dark:bg-secondaryDark rounded-lg shadow divide-y divide-gray-200 hover:bg-primaryLight dark:hover:bg-secondaryDarkHover">
                      <div class="w-full flex items-center justify-between text-center p-3">
                        <div class="flex-1 text-center">
                          <h3 class="text-textLight dark:text-textDark text-lg font-bold truncate">{{
                              vote.castedVote
                            }}</h3>
                          <p class="text-textLight dark:text-textDark font-normal text-sm">{{ vote.name }}</p>
                        </div>
                      </div>
                    </li>
                  </ul>
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
import GameService from "../../../services/GameService";
import Input from "../../Fields/Input.vue";
import TextArea from "../../Fields/TextArea.vue";
import utilMixin from "../../../scripts/util-mixin";
import {Switch, SwitchGroup, SwitchLabel} from '@headlessui/vue'
import {GameEvents} from "../../../constants/contants";
import Button from '../../Fields/Button.vue';

export default {
  components: {
    Input,
    TextArea,
    Switch,
    SwitchGroup,
    SwitchLabel,
    Button
  },

  mixins: [utilMixin],

  props: {
    forceReload: {
      type: Boolean,
      required: false
    }
  },

  data() {
    return {
      points: null,
      currentVote: null,
      isMounted: false,
      editVote: false,
      submittingVoteChange: false,

      storyData: {},

      originalData: {}
    }
  },

  computed: {
    isStructured() {
      return this.$gameStore.currentStory.storyType === "1";
    },

    canEdit() {
      return this.$userStore.isEditor();
    },

    editVoteText() {
      return this.editVote ? 'Cancel Editing Vote' : 'Edit Vote';
    }
  },

  mounted() {
    this.isMounted = false;

    if (!this.$gameStore.currentStory) {
      this.isMounted = true;
      return;
    }

    this.setLocalData();

    this.points = this.$gameStore.currentPoints;
    this.getCurrentVote();

    this.isMounted = true;
  },

  methods: {
    castVote(point) {
      this.submittingVoteChange = true;
      this.currentVote = point;

      let data = {gameId: this.$gameStore.game.gameId, storyId: this.$gameStore.currentStory.storyId, vote: point};

      GameService.castVote(data).then(() => {
        this.$socketStore.emitEvent(GameEvents.GAME_UPDATE, {gameId: this.$gameStore.game.gameId});
        if (this.editVote) {
          this.editVote = false;
        }
        this.submittingVoteChange = false;
      });
    },

    setLocalData() {
      this.storyData = {...this.$gameStore.currentStory}
      this.originalData = JSON.parse(JSON.stringify(this.storyData));
    },

    getCurrentVote() {
      if (!this.$gameStore.currentStory || !this.$gameStore.currentStory.votes || this.$gameStore.currentStory.votes.length === 0) {
        this.currentVote = null;
      }

      this.currentVote = this.$gameStore.currentStory ? this.$gameStore.currentStory.votes.filter(vote => vote.userId === this.$userStore.user.userId)[0]?.castedVote : null;
    },

    updateCurrentStory() {
      let data = {gameId: this.$gameStore.game.gameId, ...this.storyData};


      GameService.UpdateStory(data).then(() => {
        this.$socketStore.emitEvent(GameEvents.GAME_UPDATE, {gameId: this.$gameStore.game.gameId});
        this.setLocalData();
      })
    },

    handleStoryUpdate() {
      this.points = this.$gameStore.currentPoints;
      this.setLocalData();
      this.getCurrentVote();
      this.$forceUpdate();
    },

    toggleEditVote() {
      this.editVote = !this.editVote;
    },

    handleStoryUrl(url) {
      if (!url) {
        return;
      }

      if (url.includes("https://") || url.includes("http://")) {
        return url;
      }

      let newUrl = url;

      if (!url.includes("https://")) {
        newUrl = `https://${newUrl}`
      }

      return newUrl;
    }
  },

  watch: {
    storyData: {
      deep: true,
      handler(newVal) {
        if (!this.isMounted) {
          return;
        }

        if (this.areEquivalent(newVal, this.originalData)) {
          return;
        }

        this.points = this.$gameStore.currentPoints;

        this.debounce(this.updateCurrentStory, 2000);
      }
    },

    forceReload(newVal, oldVal) {
      if (oldVal && newVal === false) {
        this.handleStoryUpdate();
      }
    }
  }
}
</script>

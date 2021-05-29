<template>
  <div class="w-full md:w-9/12 grid items-center mx-auto pb-5">
    <form class="p-4 space-y-8 divide-y divide-gray-200 bg-secondaryLight dark:bg-secondaryDark rounded-lg p-3 shadow-lg" @submit.prevent="submitForm">
      <div class="space-y-8 divide-y divide-gray-200 sm:space-y-5">
        <div>
          <div>
            <h2 class="text-3xl pb-3 leading-8 font-extrabold tracking-tight text-callToAttention">
              Start a game
            </h2>
            <p class="mt-3 max-w-2xl text-sm text-textLight dark:text-textDark">
              Once you have filled out the information below, you will be provided a link to share with others
            </p>
          </div>

          <div class="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
              <Input validator="empty" placeholder="Enter your name..." id="user_name" auto-complete="name" v-model="formData.userName" required>Name</Input>
              <Input validator="empty" placeholder="Game name..." id="game_name" v-model="formData.gameName" required>Game Name</Input>
              <Select v-if="hasPointTypes" validator="select" id="game_point_type" :items="pointTypes" :show-select-option="false" :default-selected-item="defaultPointType" v-model="formData.gamePointType" required zero-acceptable>Estimate Type</Select>
              <TextArea placeholder="Game description..." id="game_description" v-model="formData.gameDescription">Game Description</TextArea>
              <TextArea placeholder="Game stories..." id="game_stories" v-model="formData.gameStories" description="Copy and paste to import stories into your game">Game Stories</TextArea>
              <Toggle v-model="formData.autoShowVotes">Automatically show votes when all users vote?</Toggle>
              <Toggle v-model="formData.autoSwitchStory">Automatically switch to the next story when estimate has been set?</Toggle>
          </div>
        </div>
      </div>

      <div class="pt-5">
        <div class="flex justify-start space-x-4">
          <Button type="submit">
            Save
          </Button>
          <Button
              @click="cancel"
              type="button">
            Cancel
          </Button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import {useMeta} from "vue-meta";
import Input from "../../components/Fields/Input.vue";
import TextArea from "../../components/Fields/TextArea.vue";
import Select from "../../components/Fields/Select.vue";
import GameService from '../../services/GameService'
import Button from "../../components/Fields/Button.vue";
import points from "../../stores/PointStore"

import UserService from "../../services/UserService";
import Toggle from "../../components/Fields/Toggle.vue";

export default {
  name: "New Game",

  components: {
    Toggle,
    Button,
    Select,
    TextArea,
    Input,

  },

  data() {
    return {
      formData: {
        userName: '',
        gameName: '',
        gameDescription: '',
        gameStories: '',
        gamePointType: 0,
        autoShowVotes: false,
        autoSwitchStory: false,
      },
      pointTypes: [],
      defaultPointType: 0
    }
  },

  setup() {
    useMeta({
      title: `New Game`,
      meta: [
        {name:'description', content: 'Start a new Point Poker game!'},
        {property: 'og:title', content: `New Game`},
        {name: 'robots', content:'index,follow'}
      ]
    })
  },

  beforeMount() {
    this.pointTypes = points.PointTypes;
  },

  mounted() {
    UserService.GetCurrentUser().then(() => {
      if (this.$userStore.user) {
        this.formData.userName = this.$userStore.user.name;
      }
    })
  },

  computed: {
    hasPointTypes() {
      return this.pointTypes.length > 0;
    }
  },

  methods: {
    submitForm() {
      GameService.createGame(this.formData).then((gameId) => {
        if (!gameId) {
          this.$alertStore.error({"message": "An unknown error occurred"})
          this.cancel();
          return;
        }

        GameService.loadGame(gameId).then((resp) => {
          this.$router.push(`/game/${gameId}`);
        });

      })
    },

    cancel() {
      this.$router.push('/');
    }
  }
}
</script>
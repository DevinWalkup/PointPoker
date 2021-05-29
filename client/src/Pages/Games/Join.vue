<template>
  <div class="w-full md:w-9/12 grid items-center mx-auto pb-5">
    <Loader loader-size="large" v-if="!pageReady"/>
    <form
        class="p-4 space-y-8 divide-y divide-gray-200 bg-secondaryLight dark:bg-secondaryDark rounded-lg p-3 shadow-lg"
        @submit.prevent="submitForm" v-if="pageReady">
      <div class="space-y-8 divide-y divide-gray-200 sm:space-y-5">
        <div>
          <div>
            <h2 class="text-3xl pb-3 leading-8 font-extrabold tracking-tight text-callToAttention">
              Join Game: {{ $gameStore.game.name }}
            </h2>
            <p class="mt-3 max-w-2xl text-sm text-textLight dark:text-textDark">
              All you need to do is just enter your name and then you can join the game!
            </p>
          </div>

          <div class="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
            <Input validator="empty" placeholder="Enter your name..." id="user_name" auto-complete="name"
                   v-model="formData.userName" required>Name</Input>
          </div>
        </div>
      </div>

      <div class="pt-5">
        <div class="flex justify-start space-x-4">
          <Button type="submit" :show-loader="submitting">
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
import AlertStore from "../../stores/AlertStore";
import UserService from "../../services/UserService";
import GameService from "../../services/GameService";
import Loader from "../../components/Loader.vue";
import Input from "../../components/Fields/Input.vue";
import Button from "../../components/Fields/Button.vue";


export default {
  name: "Join",

  components: {Loader, Input, Button},

  data() {
    return {
      pageReady: false,

      formData: {
        userName: '',
        submitting: false
      }
    }
  },

  mounted() {
    GameService.loadGame(this.$route.params.id).then(() => {
      if (this.$userStore.user) {
        this.joinGame();
      }

      this.pageReady = true;
    })
  },

  methods: {
    submitForm() {
      this.submitting = true;
      if (!this.$route.params.id) {
        AlertStore.error({"message": "The game was not found. Please try again later!"});
        return;
      }

      this.joinGame();
    },

    joinGame() {
      let data = {gameId: this.$route.params.id};

      if (this.$userStore.user) {
        data.name = this.$userStore.user.name;
      } else {
        data.name = this.formData.userName;
      }

      UserService.JoinGame(data).then((success) => {
        if (success) {
          if (!this.$route.params.id) {
            AlertStore.error({"message": "There was a problem joining the game. Please try again later!"});
            this.$router.push('/');
            return;
          }

          this.submitting = false;
          this.$router.push(`/game/${this.$route.params.id}`);
        } else {
          AlertStore.error({"message": "There was a problem joining the game. Please try again later!"});
          this.$router.push('/');
        }
      })
    },

    cancel() {
      this.$router.push('/');
    }

  }
}
</script>
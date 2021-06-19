<template>
  <Modal :open="showChangeRoleModal" confirm-variant="success" @cancel="showChangeRoleModal = false;"
         @confirm="changeUserRole">
    <template #title>
      Set user role
    </template>
    <template #body>
      <span class="font-bold">{{ selectedUser.name }}</span> is currently <span class="font-bold">{{
        selectedUser.role
      }}</span>.
      Do you want to make them <span class="font-bold">{{ resultingRole }}</span>?
    </template>
    <template #confirmText>
      Yes
    </template>
  </Modal>
  <div id="userList">
    <p class="font-bold text-textLight dark:text-textDark border-b border-gray-300 pt-2 pb-2">
      Users
    </p>
    <div class="flex flex-1 justify-center pb-3 mt-2">
      <div class="px-2 w-full justify-between">
        <ul class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-8">
          <li v-for="(user, idx) in $gameStore.users()" :key="idx"
              class="col-span-2 bg-primaryLight dark:bg-primaryDark rounded-lg shadow divide-y divide-gray-200 hover:bg-secondaryLightHover dark:hover:bg-secondaryDarkHover"
              @click="setUser(user)">
            <div v-if="hasVoted(user)" class="flex flex-1 py-3 px-2">
              <div class="w-6 h-6 flex">
                <CheckIcon class="text-green-400"/>
              </div>
              <p class="text-textLight text-center w-full dark:text-textDark text-md font-bold">
                {{ user.name  }}
              </p>
            </div>
            <div class="w-full flex items-center justify-between text-center p-3" v-else>
              <div class="flex-1 text-center w-full">
                <h3 class="text-textLight dark:text-textDark text-md font-bold">{{ user.name }}</h3>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import UserService from "../../services/UserService";
import {RoleType, UserEvents} from "../../constants/contants";
import Modal from "../../components/Modal.vue";
import {CheckIcon} from '@heroicons/vue/outline'

export default {
  name: "UserList",

  props: {
    forceUpdate: {
      type: Boolean,
      required: true
    }
  },

  components: {
    Modal,
    CheckIcon
  },

  data() {
    return {
      showChangeRoleModal: false,
      selectedUser: {
        name: '',
        role: ''
      },
      resultingRole: null,
      resultingRoleId: null,
    }
  },

  methods: {
    setUser(user) {
      if (user.userId === this.$userStore.user.userId) {
        return;
      }

      if (!this.$userStore.isAdmin()) {
        return;
      }

      UserService.GetUser(user.userId).then((usr) => {
        this.selectedUser = usr;

        switch (usr.roleType) {
          case 2:
            this.selectedUser.role = `a ${RoleType[usr.roleType].toLowerCase()}`;
            this.resultingRoleId = RoleType.EDITOR;
            this.resultingRole = `an ${RoleType[RoleType.EDITOR].toLowerCase()}`;
            break;
          default:
            this.selectedUser.role = `an ${RoleType[usr.roleType].toLowerCase()}`;
            this.resultingRoleId = RoleType.USER;
            this.resultingRole = `a ${RoleType[RoleType.USER].toLowerCase()}`;
        }

        this.showChangeRoleModal = true;
      })
    },

    changeUserRole() {
      if (!this.$userStore.isAdmin()) {
        return;
      }

      let data = {
        currentUserId: this.$userStore.user.userId,
        userId: this.selectedUser.userId,
        roleType: this.resultingRoleId
      };

      this.showChangeRoleModal = false

      UserService.UpdateUserRole(data).then((user) => {
        this.selectedUser = {
          name: '',
          role: ''
        };
        this.resultingRoleId = null;
        this.resultingRole = null;

        if (!user) {
          return;
        }

        this.$socketStore.emitEvent(UserEvents.ROLE_CHANGE, {userId: user.userId});
      })
    },

    hasVoted(user) {
      if (!this.$gameStore.currentStory || !this.$gameStore.currentStory.votes) {
        return false;
      }

      return this.$gameStore.currentStory.votes.some((vote) => {return vote.userId === user.userId});
    },
  },

  watch: {
    forceUpdate(newVal, oldVal) {
      if (oldVal && newVal === false) {
        this.$forceUpdate();
      }
    }
  }
}
</script>
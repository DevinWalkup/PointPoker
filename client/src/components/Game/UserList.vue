<template>
  <Modal :open="showChangeRoleModal" confirm-variant="success" @cancel="showChangeRoleModal = false;"
         @confirm="changeUserRole" icon="ClipboardListIcon" body-height="h-64">
    <template #title>
      Set user role
    </template>
    <template #body>
      <div class="w-full h-5/6">
        <div>
          <span class="font-bold">{{ selectedUser.name }}</span>
          currently has the role: <span class="font-bold">{{ selectedUser.role }}</span>.
        </div>
        <div class="w-full">
          <Select id="select-user-role"
                  :required="true"
                  name-key="role"
                  value-key="roleId"
                  :items="availableRoles"
                  v-model="resultingRoleId"
                  :validation-message="userRoleValidation">
            What Role do you want to assign to this user?
          </Select>
        </div>
      </div>
    </template>
    <template #confirmText>
      Change Role
    </template>
  </Modal>
  <Modal :open="showUserIconHelpModal" confirm-variant="success" @cancel="toggleUserIconHelpModal"
         icon="ClipboardListIcon" :show-ok-button="false" close-button-text="Close">
    <template #title>
      User Icons
    </template>
    <template #body>
      <div class="w-full h-full mt-5 p-5 mb-5">
        <h1 class="text-textLight dark:text-textDark font-bold tracking-tight border-b border-gray-500 dark:border-gray-300">
          What do the icons next to the users mean?
        </h1>
        <div class="mt-2 space-y-6 bg-secondaryLight dark:bg-secondaryDark p-5 rounded-md text-textLight dark:text-textDark">
          <div class="flex flex-1 items-center">
            <CheckIcon class="text-green-400 w-6 h-6 mr-2"/>
            <p class="text-sm"> - User has voted for the current story</p>
          </div>
          <div class="flex flex-1 items-center">
            <StatusOfflineIcon class="text-red-400 w-6 h-6 mr-2"/>
            <p class="text-sm"> - User is disconnected from the game</p>
          </div>
          <div class="flex flex-1 items-center">
            <SearchCircleIcon class="text-textLight dark:text-textDark w-6 h-6 mr-2"/>
            <p class="text-sm">- User is a viewer of the game. This user cannot participate in voting for the story estimate</p>
          </div>
          <div class="flex flex-1 items-center">
            <UserGroupIcon class="text-textLight dark:text-textDark w-6 h-6 mr-2"/>
            <p class="text-sm"> - User is the admin of the game.</p>
          </div>
          <div class="flex flex-1 items-center">
            <PencilIcon class="text-textLight dark:text-textDark w-6 h-6 mr-2"/>
            <p class="text-sm"> - User is an editor for the game.</p>
          </div>
          <div class="flex flex-1 items-center">
            <UserIcon class="text-textLight dark:text-textDark w-6 h-6 mr-2"/>
            <p class="text-sm"> - User is a regular player of the game.</p>
          </div>
        </div>
      </div>
    </template>
  </Modal>
  <div id="userList">
    <div class="flex flex-1 space-x-3 border-b border-gray-500 dark:border-gray-300 items-center">
      <p class="font-bold text-textLight dark:text-textDark pt-2 pb-2">
        Users
      </p>
      <QuestionMarkCircleIcon class="w-5 h-5 text-textLight dark:text-textDark cursor-pointer"
                              @click="toggleUserIconHelpModal"/>
    </div>
    <div class="flex flex-1 justify-center pb-3 mt-2">
      <div class="px-2 w-full justify-between">
        <ul class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <li v-for="(user, idx) in $gameStore.users()" :key="idx"
              class="col-span-2 bg-primaryLight dark:bg-primaryDark rounded-lg shadow divide-y divide-gray-200 hover:bg-secondaryLightHover dark:hover:bg-secondaryDarkHover"
              @click="setUser(user)">
            <div v-if="userOffline(user)" class="flex flex-1 py-3 px-2 items-center">
              <div class="ml-1 flex">
                <CheckIcon class="text-green-400 w-6 h-6" v-if="hasVoted(user)"/>
                <StatusOfflineIcon class="text-red-400 w-6 h-6"/>
              </div>
              <p class="text-textLight text-center w-full dark:text-textDark text-md font-bold">
                {{ user.name }}
              </p>
            </div>
            <div v-else-if="userIsViewer(user)" class="flex flex-1 py-3 px-2 items-center">
              <div class="ml-1 flex">
                <CheckIcon class="text-green-400 w-6 h-6" v-if="hasVoted(user)"/>
                <SearchCircleIcon class="text-textLight dark:text-textDark w-6 h-6"/>
              </div>
              <p class="text-textLight text-center w-full dark:text-textDark text-md font-bold">
                {{ user.name }}
              </p>
            </div>
            <!--            <div v-else-if="hasVoted(user)" class="flex flex-1 py-3 px-2">-->
            <!--              <div class="w-6 h-6 flex">-->
            <!--                <CheckIcon class="text-green-400"/>-->
            <!--              </div>-->
            <!--              <p class="text-textLight text-center w-full dark:text-textDark text-md font-bold">-->
            <!--                {{ user.name }}-->
            <!--              </p>-->
            <!--            </div>-->
            <div v-else-if="userIsAdmin(user)" class="flex flex-1 py-3 px-2 items-center">
              <div class="ml-1 flex">
                <CheckIcon class="text-green-400 w-6 h-6" v-if="hasVoted(user)"/>
                <UserGroupIcon class="text-textLight dark:text-textDark w-6 h-6"/>
              </div>
              <p class="text-textLight text-center w-full dark:text-textDark text-md font-bold">
                {{ user.name }}
              </p>
            </div>
            <div v-else-if="userIsEditor(user)" class="flex flex-1 py-3 px-2 items-center">
              <div class="ml-1 flex">
                <CheckIcon class="text-green-400 w-6 h-6" v-if="hasVoted(user)"/>
                <PencilIcon class="text-textLight dark:text-textDark w-6 h-6"/>
              </div>
              <p class="text-textLight text-center w-full dark:text-textDark text-md font-bold">
                {{ user.name }}
              </p>
            </div>
            <div v-else class="flex flex-1 py-3 px-2 items-center">
              <div class="ml-1 flex">
                <CheckIcon class="text-green-400 w-6 h-6" v-if="hasVoted(user)"/>
                <UserIcon class="text-textLight dark:text-textDark w-6 h-6"/>
              </div>
              <p class="text-textLight text-center w-full dark:text-textDark text-md font-bold">
                {{ user.name }}
              </p>
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
import {CheckIcon, StatusOfflineIcon} from '@heroicons/vue/outline'
import Select from "../../components/Fields/Select.vue";

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
    CheckIcon,
    StatusOfflineIcon,
    Select
  },

  data() {
    return {
      showChangeRoleModal: false,
      selectedUser: {
        name: '',
        role: ''
      },
      availableRoles: [],
      resultingRoleId: null,
      showUserIconHelpModal: false,
    }
  },

  computed: {
    roleTypes() {
      return [
        {
          role: "Editor",
          roleId: RoleType.EDITOR
        },
        {
          role: "Viewer",
          roleId: RoleType.VIEWER
        },
        {
          role: "User",
          roleId: RoleType.USER
        }
      ]
    },

    userRoleValidation() {
      if (!this.showChangeRoleModal) {
        return null;
      }

      if (!this.resultingRoleId) {
        return "This field is required";
      }
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
          case RoleType.USER:
            this.selectedUser.role = "User";
            this.availableRoles = this.roleTypes.filter((role) => role.roleId !== RoleType.USER);
            break;
          case RoleType.EDITOR:
            this.selectedUser.role = "Editor";
            this.availableRoles = this.roleTypes.filter((role) => role.roleId !== RoleType.EDITOR);
            break;
          case RoleType.VIEWER:
            this.selectedUser.role = "Viewer";
            this.availableRoles = this.roleTypes.filter((role) => role.roleId !== RoleType.VIEWER);
            break;
          default:
            this.$alertStore.error("An unexpected error occurred");
            return;
        }

        this.showChangeRoleModal = true;
      })
    },

    changeUserRole() {
      if (!this.$userStore.isAdmin()) {
        return;
      }

      if (!this.resultingRoleId) {
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

        if (!user) {
          return;
        }

        this.$socketStore.emitEvent(UserEvents.ROLE_CHANGE, {userId: user.userId});
        this.$nextTick(() => this.$forceUpdate());
      })
    },

    userIsViewer(user) {
      let gameUser = this.$gameStore.getUserById(user.userId);

      if (!gameUser) {
        return false
      }

      return gameUser.roleType === RoleType.VIEWER;
    },

    userIsAdmin(user) {
      let gameUser = this.$gameStore.getUserById(user.userId);

      if (!gameUser) {
        return false;
      }

      return gameUser.roleType === RoleType.ADMIN;
    },

    userIsEditor(user) {
      let gameUser = this.$gameStore.getUserById(user.userId);

      if (!gameUser) {
        return false;
      }

      return gameUser.roleType === RoleType.EDITOR;
    },

    hasVoted(user) {
      if (!this.$gameStore.currentStory || !this.$gameStore.currentStory.votes) {
        return false;
      }

      return this.$gameStore.currentStory.votes.some((vote) => {
        return vote.userId === user.userId
      });
    },

    userOffline(user) {
      return !this.$gameStore.state.onlineUsers.includes(user.userId);
    },

    toggleUserIconHelpModal() {
      this.showUserIconHelpModal = !this.showUserIconHelpModal;
    }
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
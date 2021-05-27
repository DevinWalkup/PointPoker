<template>
  <div class="bg-green-50 border-l-4 border-green-400 p-4">
    <div class="flex">
      <div class="flex-shrink-0">
        <CheckCircleIcon class="h-5 w-5 text-green-400" aria-hidden="true" />
      </div>
      <div class="ml-3">
        <h3 class="text-sm font-medium text-green-800">
          {{message}}
        </h3>
        <div class="mt-2 text-sm text-green-700" v-if="hasListMessages">
          <ul class="list-disc pl-5 space-y-1">
            <li v-for="(item, idx) in listMessages" :key="idx">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="mt-4">
      <div class="-mx-2 -my-1.5 flex">
        <button
            @click="removeAlert"
            type="button"
            class="ml-3 bg-green-50 px-2 py-1.5 rounded-md text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600">
          Dismiss
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { CheckCircleIcon } from '@heroicons/vue/solid'
import AlertStore from "../../stores/AlertStore";

export default {
  name: "SuccessAlert",

  components: {
    CheckCircleIcon,
  },

  props: {
    alert: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      message: '',
      listMessages: []
    }
  },

  computed: {
    hasListMessages() {
      return this.listMessages.length > 0;
    }
  },

  mounted() {
    this.message = this.alert.Content;
    this.listMessages = this.alert.List;
  },

  methods: {
    removeAlert() {
      AlertStore.removeAlert(this.alert);
    }
  }
}
</script>
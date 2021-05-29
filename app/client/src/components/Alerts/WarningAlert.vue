<template>
  <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
    <div class="flex">
      <div class="flex-shrink-0">
        <ExclamationIcon class="h-5 w-5 text-yellow-400" aria-hidden="true" />
      </div>
      <div class="ml-3">
        <h3 class="text-sm font-medium text-yellow-800">
          {{message}}
        </h3>
        <div class="mt-2 text-sm text-yellow-700" v-if="hasListMessages">
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
            class="ml-3 bg-yellow-50 px-2 py-1.5 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-600">
          Dismiss
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ExclamationIcon } from '@heroicons/vue/solid'
import AlertStore from "../../stores/AlertStore";

export default {
  name: "WarningAlert",

  components: {
    ExclamationIcon,
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
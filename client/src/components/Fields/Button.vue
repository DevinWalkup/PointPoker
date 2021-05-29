<template>
  <button
      v-if="isSubmit"
      type="submit"
      class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
      @click="onClick">
    <slot></slot>
  </button>
  <button
      v-if="isError"
      @click="onClick"
      type="button"
      class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
      >
    <slot></slot>
  </button>
  <button
      v-if="isSuccess"
      @click="onClick"
      type="button"
      class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
      >
    <slot></slot>
  </button>
  <button
      @click="onClick"
      v-if="isRegular"
      type="button"
      class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
    <slot></slot>
  </button>

</template>

<script>
export default {
  name: "Button",

  emits: ['click'],

  props: {
    type: {
      type: String,
      required: true
    }
  },

  methods: {
    onClick() {
      return this.$emit('click')
    }
  },

  computed: {
    isSubmit() {
      return this.type.toLowerCase() === "submit";
    },
    isError() {
      return this.type.toLowerCase() === "error";
    },
    isSuccess() {
      return this.type.toLowerCase() === "success";
    },

    isRegular() {
      return (!this.isSubmit && !this.isError && !this.isSuccess)
    }
  }
}
</script>

<style scoped>

</style>
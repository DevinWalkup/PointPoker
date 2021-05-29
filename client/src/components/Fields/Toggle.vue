<template>
  <SwitchGroup as="div" class="flex items-center">
    <Switch v-model="toggleValue"
            :class="[toggleValue ? 'bg-cyan-600' : 'bg-gray-200', 'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500']">
      <span class="sr-only">Toggle Add Stories</span>
      <span aria-hidden="true"
            :class="[toggleValue ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200']"/>
    </Switch>
    <SwitchLabel as="span" class="ml-3">
      <span class="text-sm font-medium text-textLight dark:text-textDark"><slot></slot></span>
    </SwitchLabel>
  </SwitchGroup>
</template>

<script>
import {Switch, SwitchGroup, SwitchLabel} from '@headlessui/vue'

export default {
  name: "Toggle",

  components: {
    Switch,
    SwitchGroup,
    SwitchLabel,
  },

  props: ['modelValue'],

  data() {
    return {
      toggleValue: false
    }
  },

  mounted() {
    this.toggleValue = this.modelValue;
  },

  watch: {
    toggleValue(newVal, oldVal) {
      if (newVal === oldVal) {
        return;
      }

      this.$emit('update:modelValue', newVal);
    }
  }
}
</script>

<style scoped>

</style>
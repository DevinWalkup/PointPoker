<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" static class="fixed z-10 inset-0 overflow-y-auto" @close="open = false" :open="open">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
                         leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <DialogOverlay class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
        </TransitionChild>

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <TransitionChild as="template" enter="ease-out duration-300"
                         enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                         enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
                         leave-from="opacity-100 translate-y-0 sm:scale-100"
                         leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
          <div
              class="inline-block align-bottom bg-white dark:bg-primaryDark h-full rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg md:max-w-3xl sm:w-full sm:p-6">
            <div class="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
              <button type="button"
                      class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                      @click="cancel">
                <span class="sr-only">Close</span>
                <XIcon class="h-6 w-6" aria-hidden="true"/>
              </button>
            </div>
            <div class="flex align-middle items-center">
              <div
                  v-if="!isHelp"
                  class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10"
                  :class="{'bg-green-100' : isSuccess, 'bg-red-100': !isSuccess}">
                <ExclamationIcon class="h-6 w-6 text-red-600" aria-hidden="true" v-if="!isSuccess"/>
                <CheckCircleIcon class="h-6 w-6 text-green-600" aria-hidden="true" v-else-if="!icon"/>
                <component :is="icon" class="h-6 w-6 text-green-600" v-else />
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <DialogTitle as="h3" class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  <slot name="title" v-if="!isHelp">

                  </slot>
                </DialogTitle>
              </div>
            </div>
            <div class="mt-2" :class="bodyHeight">
              <slot name="body">

              </slot>
            </div>
            <div class="mt-5 sm:mt-4 sm:flex space-x-3">
              <Button :type="confirmVariant" @click="confirm" v-if="!isHelp && showOkButton">
                <slot name="confirmText"></slot>
              </Button>
              <Button type="button" @click="cancel">
                {{ closeButtonText }}
              </Button>
            </div>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import {Dialog, DialogOverlay, DialogTitle, TransitionChild, TransitionRoot} from '@headlessui/vue'
import Button from "./Fields/Button.vue";

export default {
  props: {
    open: {
      type: Boolean,
      default: false
    },
    confirmVariant: {
      type: String,
      default: "error"
    },
    icon: {
      type: String,
      default: null
    },
    showOkButton: {
      type: Boolean,
      default: true
    },
    closeButtonText: {
      type: String,
      default: "Cancel"
    },
    bodyHeight: {
      type: String,
      default: "h-full"
    }
  },

  components: {
    Button,
    Dialog,
    DialogOverlay,
    DialogTitle,
    TransitionChild,
    TransitionRoot
  },

  methods: {
    confirm() {
      this.$emit('confirm');
    },

    cancel() {
      this.$emit('cancel')
    }
  },

  computed: {
    isSuccess() {
      return this.confirmVariant.toLowerCase() === "success";
    },

    isHelp() {
      return this.confirmVariant.toLowerCase() === "help";
    }
  }
}
</script>
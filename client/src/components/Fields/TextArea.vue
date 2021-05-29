<template>
    <label :for="id" class="block text-sm font-medium text-textLight dark:text-textDark sm:mt-px sm:pt-2" v-if="hasLabel">
      <p><slot></slot> <span v-if="required">*</span></p>
    </label>
    <div class="mt-1 sm:mt-0" :class="{'pt-2' : !hasLabel}">
      <textarea
          :id="id"
          :name="id"
          :rows="rows"
          :placeholder="placeholder"
          class="cursor-text sm:col-span-2 shadow-sm block w-full m:text-sm rounded-md"
          :class="{'border-red-500 focus:outline-none focus:ring focus:ring-red-500' : !fieldValid && validationField, 'border-gray-400 focus:outline-none focus:ring focus:ring-cyan-500' : fieldValid && validationField}"
          :required="required"
          v-model="localValue"
        />
      <p class="text-red-500 dark:text-red-300 text-sm italic" v-if="validationField && !fieldValid">{{ validationText }}</p>
      <p class="mt-2 text-sm text-textLight dark:text-textDark" v-if="description">{{ description }}</p>
    </div>
</template>

<script>
import fieldMixin from '../../scripts/field-mixin'

export default {
  name: "TextArea",

  mixins: [fieldMixin],

  props: {
    id: {
      type: String,
      required: true
    },

    rows: {
      type: Number,
      default: 3
    },

    description: {
      type: String,
      required: false
    },

    validator: {
      type: String,
      required: false
    },

    required: {
      type: Boolean,
      default: false
    },

    validationPattern: {
      type: String,
      required: false,
    },

    customValidationMessage: {
      type: String,
      required: false,
    },

    placeholder: {
      type: String,
      required: false,
      default: ""
    },

    modelValue: {
      default: ''
    }
  },

  data() {
    return {
      localValue: ''
    }
  },

  mounted() {
    this.localValue = this.modelValue;

    this.initializeValidationProps(this.$props);
  },

  computed: {
    validationField() {
      return !!this.validator;
    },

    hasLabel() {
      return this.$slots.default !== undefined
    }
  },

  watch: {
    modelValue(newVal) {
      this.localValue = newVal;
    },

    localValue: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal === oldVal) {
          return;
        }

        this.$emit('update:modelValue', newVal.trim());

        if (!this.validationField) {
          return;
        }

        this.handleValidation(newVal);
      }
    }

  }
}
</script>

<style scoped>

</style>
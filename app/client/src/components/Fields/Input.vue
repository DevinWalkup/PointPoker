<template>
  <label for="first_name" class="block text-sm font-medium text-textLight dark:text-textDark sm:mt-px sm:pt-2" v-if="hasLabel">
    <p>
      <slot></slot>
      <span v-if="required">*</span></p>
  </label>
  <div class="mt-1 sm:mt-0" :class="{'pt-2' : !hasLabel}">
    <input
        :type="type"
        :name="id"
        :id="id"
        :autocomplete="autoComplete"
        :placeholder="placeholder"
        class="block w-full sm:col-span-2 shadow-sm focus:ring-indigo-500 focus:border-cyan-500 sm:text-sm rounded-md"
        :class="{'border-red-500 focus:outline-none focus:ring focus:ring-red-500' : !fieldValid && validationField, 'border-gray-400 focus:outline-none focus:ring focus:ring-cyan-500' : fieldValid && validationField}"
        v-model="localValue"
        :required="required"
    />
    <p class="text-red-500 dark:text-red-300 text-sm italic" v-if="validationField && !fieldValid">{{
        validationText
      }}</p>
  </div>
</template>

<script>
import * as Validators from '../../validators/validators'
import fieldMixin from '../../scripts/field-mixin.js'

export default {
  name: "Input",

  props: {
    required: {
      type: Boolean,
      default: false
    },
    autoComplete: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'text'
    },
    validator: {
      type: String,
      required: false
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
      default: ''
    },
    modelValue: {
      default: ''
    }
  },

  mixins: [fieldMixin],

  data() {
    return {
      localValue: ''
    }
  },

  computed: {
    validationField() {
      return !!this.validator;
    },

    hasLabel() {
      return this.$slots.default !== undefined;
    }
  },

  mounted() {
    this.localValue = this.modelValue;
    this.initializeValidationProps(this.$props);
  },

  methods: {
    cleanInput(value) {
      if (!value) {
        return;
      }

      if (this.type === "number" && value) {
        return parseInt(value);
      } else {
        return value.trim();
      }
    },
  },

  watch: {
    modelValue: function (newVal, oldVal) {
      this.localValue = newVal;
    },

    localValue: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal === oldVal) {
          return;
        }

        this.$emit('update:modelValue', this.cleanInput(newVal));

        if (!this.validationField) {
          return;
        }

        this.handleValidation(newVal);
      }
    }
  }
}
</script>
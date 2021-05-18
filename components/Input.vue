<template>
  <div>
    <label class="block text-sm font-medium text-gray-700" :for="id">
      {{ label }}
    </label>
    <div class="transition duration-200 relative mt-1 flex-col">
      <div class="flex">
        <div
          v-if="prepend"
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          {{ prepend }}
        </div>
        <input
          :id="id"
          v-model="query"
          :class="getVariant"
          name="unit"
          :placeholder="placeholder"
          :readonly="readonly"
          :type="type"
        >
        <div
          v-if="append"
          class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
        >
          {{ append }}
        </div>
      </div>
      <div v-if="variant === 'error' && !append" class="transition duration-200 absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <span class="text-red-600 sm:text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </span>
      </div>
      <div v-if="variant === 'success' && !append" class="transition duration-200 absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <span class="text-green-600 sm:text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
        </span>
      </div>
    </div>
    <slot name="message" />
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'Input',
  props: {
    label: {
      type: String,
      required: true
    },
    variant: {
      type: String,
      default: 'primary'
    },
    value: {
      type: String,
      default: ''
    },
    prepend: {
      type: String,
      default: null
    },
    append: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      id: _.uniqueId(),
      query: this.value
    }
  },
  computed: {
    getVariant () {
      if (this.prepend) {
        return `${this.variant} pl-10`
      } else {
        return this.variant
      }
    }
  },
  watch: {
    query () {
      this.$emit('input', this.query)
    },
    value () {
      this.query = this.value
    }
  }
}
</script>

<style scoped>
.success {
  @apply transition placeholder-green-300 text-green-700 duration-200 block w-full text-sm py-2.5 rounded-md border-green-300 bg-green-50 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-green-50
}

.primary {
  @apply transition placeholder-gray-300 text-gray-700 duration-200 block w-full text-sm py-2.5 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-blue-50
}

.error {
  @apply transition placeholder-red-300 text-red-700 duration-200 block w-full text-sm py-2.5 rounded-md border-red-300 bg-red-50 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50
}
</style>

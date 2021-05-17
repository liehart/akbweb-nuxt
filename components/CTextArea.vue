<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1" :for="id">
      {{ label }}
    </label>
    <textarea
      v-model="query"
      :id="id"
      rows="2"
      :class="variant"
    />
    <slot name="message"/>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'CTextArea',
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
    }
  },
  data () {
    return {
      id: _.uniqueId(),
      query: this.value
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
  @apply transition duration-200 text-sm py-2.5 block w-full rounded-md border-green-300 bg-green-50 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-green-50
}

.primary {
  @apply transition duration-200 text-sm py-2.5 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-blue-50
}

.error {
  @apply transition duration-200 text-sm py-2.5 block w-full rounded-md border-red-300 bg-red-50 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50
}
</style>

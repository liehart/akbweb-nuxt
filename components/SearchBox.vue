<template>
  <transition name="bounce">
    <div
      class="relative rounded-md shadow-sm"
    >
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span class="text-gray-500 sm:text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
        </span>
      </div>
      <input
        id="search"
        ref="search"
        v-model="query"
        type="text"
        name="search"
        class="searchBox focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
        :class="{ 'searchBox-grow' : onFocus }"
        :placeholder="placeholder"
        @focus="onFocus = true"
        @blur="checkBlur"
        @keyup.esc="checkBlur"
      >
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <div v-if="query.length > 0 && onFocus" class="transition duration-200 cursor-pointer hover:opacity-70" @click="clear">
          <span class="text-gray-500 sm:text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'SearchBox',
  props: {
    placeholder: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      onFocus: false,
      query: ''
    }
  },
  watch: {
    query: _.debounce(function () {
      this.$emit('input', this.query)
    }, 500)
  },
  methods: {
    clear () {
      this.query = ''
      this.onFocus = false
    },
    checkBlur () {
      if (this.query.length > 0) {
        this.onFocus = true
      } else {
        this.onFocus = false
      }
      this.$refs.search.blur()
    }
  }
}
</script>

<style scoped>

.searchBox-grow {
  @apply w-96;
  @apply duration-200;
  transition-property: width;
}

.searchBox {
  @apply duration-200;
  transition-property: width;
}
</style>

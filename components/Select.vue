<template>
  <div>
    <div v-click-outside="closeDropdown" class="relative w-full mt-1 text-gray-500">
      <span class="inline-block w-full rounded-md shadow-sm">
        <button
          aria-expanded="true"
          :disabled="disabled === 1"
          aria-haspopup="listbox"
          aria-labelledby="listbox-label"
          class="relative w-full rounded-md border border-gray-300 bg-white pl-3
                          pr-10 py-2 text-left focus:outline-none focus:shadow-outline-blue focus:border-blue-300
                          sm:text-sm sm:leading-5"
          type="button"
          :class="[disabled ? 'cursor-default bg-gray-50' : 'cursor-pointer', error ? 'border-red-600' : '']"
          @click="openDropdown"
        >
          <div class="flex items-center space-x-3">
            <span
              v-if="selected.name"
              :class="[disabled ? 'text-gray-300' : 'text-black']"
            >
              {{ selected.name }}
            </span>
            <span v-else class="text-gray-300">
              Pilih Salah Satu
            </span>
          </div>
          <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 20 20">
              <path
                d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
              />
            </svg>
          </span>
        </button>
      </span>
      <div v-show="isOpen" class="fixed border border-gray-200 mt-1 rounded-md bg-white shadow-lg">
        <ul
          aria-activedescendant="listbox-item-0"
          aria-labelledby="listbox-label"
          class="max-h-56 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto
                          focus:outline-none sm:text-sm sm:leading-5"
          role="listbox"
          tabindex="-1"
        >
          <li
            v-for="(d, key) in list"
            id="listbox-item-0"
            :key="key"
            class="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 cursor-pointer hover:text-white
                            hover:bg-red-600 focus:outline-none focus:text-white focus:bg-red-600"
            role="option"
            tabindex="0"
            @click="select(d)"
          >
            <div class="flex items-center space-x-3">
              <span
                :class="{ 'font-normal' : !isSelected(d) , 'font-semibold text-red-500' : isSelected(d)}"
                class="block truncate"
              >
                {{ d.name }}
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Select',
  // eslint-disable-next-line vue/require-prop-types
  props: ['list', 'error', 'value', 'disabled'],
  data () {
    return {
      isOpen: false,
      selected: []
    }
  },
  computed: {
    data () {
      return {
        isOpen: false
      }
    }
  },
  watch: {
    value: {
      immediate: true,
      handler () {
        if (this.value) {
          this.list.forEach((d) => {
            if (d.value === this.value) {
              this.select(d)
            }
          })
        }
      }
    }
  },
  methods: {
    isSelected (value) {
      return this.selected === value
    },
    closeDropdown () {
      this.isOpen = false
    },
    openDropdown () {
      this.isOpen = true
    },
    select (value) {
      this.isOpen = false
      this.selected = value
      this.$emit('input', value.value)
    }
  }
}
</script>

<style scoped>

</style>

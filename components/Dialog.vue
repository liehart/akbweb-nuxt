<template>
  <transition name="ease" @after-enter="isOpen = true">
    <div
      v-show="value"
      class="fixed inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      @click="!persistent ? closeModal : null"
    >
      <div
        class="transition flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        :class="[value ? 'ease-out duration-300 opacity-100' : 'ease-in duration-200 opacity-0']"
      >
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" aria-hidden="true" />
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <transition name="modal">
          <div
            v-show="isOpen"
            class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden
            shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            @click.stop
          >
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="mt-3">
                <div class="mb-8">
                  <h3 id="modal-title" class="text-2xl leading-6 font-medium text-gray-900">
                    <slot name="title" />
                  </h3>
                </div>
                <div class="mt-2 w-full">
                  <p class="text-sm text-gray-500">
                    <slot name="body" />
                  </p>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 border-t px-4 py-5 mt-5 sm:px-6 sm:flex sm:flex-row-reverse flex gap-5">
              <Button
                label="Simpan"
                variant="primary"
                :disabled="loading"
                :loading="loading"
                :icon="true"
                @click="confirmModal"
              >
                <template #icon>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                  </svg>
                </template>
              </Button>
              <Button label="Batal" variant="secondary" :disabled="loading" @click="closeModal" />
            </div>
          </div>
        </transition>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Dialog',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    persistent: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isOpen: false
    }
  },
  methods: {
    closeModal () {
      this.isOpen = false
      this.$emit('input', false)
    },
    confirmModal () {
      this.$emit('click')
    }
  }
}
</script>

<style scoped>
.ease-enter-active, .ease-leave-active {
  transition: ease-out;
  transition-duration: 100ms;
}
.ease-enter, .ease-leave-to /* .ease-leave-active below version 2.1.8 */ {
  transition: ease-in;
  transition-duration: 100ms;
  opacity: 0;
}
.modal-enter-active, .modal-leave-active {
  transition: ease-out;
  transition-duration: 100ms;
}
.modal-enter, .modal-leave-to /* .modal-leave-active below version 2.1.8 */ {
  transition: ease-in;
  transition-duration: 100ms;
  opacity: 0;
  transform: scale(0.75)
}
</style>

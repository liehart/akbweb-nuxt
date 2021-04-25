<template>
  <div class="container mx-auto">
    <div class="flex pt-10">
      <div class="text-center w-full">
        <img class="w-96 mx-auto" src="~/assets/error.svg">
        <h1 class="text-3xl font-bold text-gray-600">
          <span v-if="error.statusCode === 404">
            Halaman tidak ditemukan
          </span>
          <span v-else>
            Telah terjadi error
          </span>
        </h1>
        <div class="mt-5">
          <button
            class="text-white px-5 py-2.5 rounded-lg text-sm shadow-sm font-semibold text-center inline-block
              hover:shadow-md bg-red-500 hover:bg-red-600 focus:bg-red-700 focus:shadow-sm focus:ring-4
              focus:ring-red-500 focus:ring-opacity-50 focus:outline-none"
            @click="goToHome"
          >
            Kembali ke Halaman Utama
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'error',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  methods: {
    goToHome () {
      this.$router.push('/')
    }
  }
}
</script>

<template>
  <div>
    <div class="mb-5">
      <h1 class="text-4xl font-bold">
        Data Jabatan
      </h1>
      <p>Selamat datang di menu pengelolaan data jabatan</p>
    </div>
    <div class="mb-5 flex">
      <div class="flex w-full relative">
        <input
          ref="search"
          v-model="search"
          type="text"
          name="search"
          class="w-full border rounded-lg px-3 py-2 text-sm w-full focus:ring-2
              focus:ring-blue-600 focus:outline-none"
          placeholder="Cari Jabatan"
          @input="isTyping = true"
        >
      </div>
      <NuxtLink
        to="/dashboard/jabatan/create"
        class="ml-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm
            text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none
            focus:ring-2 focus:ring-offset-2 focus:ring-red-500 whitespace-nowrap"
      >
        Tambah Jabatan
      </NuxtLink>
    </div>
    <div
      class="shadow bg-white overflow-hidden border-b border-gray-200 sm:rounded-lg"
    >
      <div
        class="h-1"
        :class="[ loadingAPI ? 'bg-red-200' : 'bg-gray-50' ]"
      >
        <div v-if="loadingAPI">
          <div class="loading-bar h-1 bg-red-500" />
        </div>
      </div>
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="w-1/3 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nama Jabatan
            </th>
            <th scope="col" class="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Jabatan Inti
            </th>
            <th scope="col" class="relative px-4 py-3">
              <span class="sr-only">Edit</span>
            </th>
            <th scope="col" class="relative px-4 py-3">
              <span class="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody v-if="loading" class="bg-white divide-y divide-gray-200">
          <tr>
            <td colspan="4" class="text-center py-5 text-gray-500 text-sm">
              Loading...
            </td>
          </tr>
        </tbody>
        <tbody v-else-if="!loading && roles.data.length > 0" class="bg-white divide-y divide-gray-200">
          <tr v-for="role in roles.data" :key="role.id">
            <td class="px-4 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">
                {{ role.name }}
              </div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">
                <span v-if="role.locked" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Ya
                </span>
                <span v-else class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                  Tidak
                </span>
              </div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">
                <div class="flex -space-x-1 overflow-hidden">
                  <div v-for="(employee, key) in role.employees" :key="key" class="flex-shrink-0 h-6 w-6">
                    <img
                      v-if="employee.image_path"
                      class="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-white"
                      :src="employee.image_path"
                      alt=""
                    >
                    <div
                      class="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-gray-400 flex justify-center items-center text-xs text-gray-200"
                    >
                      {{ employee.name[0].toUpperCase() }}
                    </div>
                  </div>
                  <div v-if="role.count > 0" class="flex-shrink-0 h-6 w-6">
                    <div
                      style="font-size: 7pt"
                      class="inline-block h-6 w-6 rounded-full ring-2
                      ring-white bg-gray-400 flex justify-center items-center
                      text-gray-200"
                    >
                      {{ role.count }}+
                    </div>
                  </div>
                </div>
              </div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                class="text-red-600 hover:text-red-900"
                @click="showDetail(role)"
              >
                Detail
              </button>
            </td>
          </tr>
        </tbody>
        <tbody v-else class="bg-white divide-y divide-gray-200">
          <tr>
            <td colspan="4" class="text-center py-5 text-gray-500 text-sm">
              Tidak ada data
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!loading && roles.data.length > 0" class="py-4 px-4 border-t flex justify-between">
        <div class="my-auto">
          <p class="text-sm text-gray-700">
            Menampilkan
            <span class="font-bold">{{ roles.from }}</span>
            ke
            <span class="font-bold">{{ roles.to }}</span>
            dari
            <span class="font-bold">{{ roles.total }}</span>
            hasil
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              class="relative inline-flex items-center px-2 py-2 rounded-l-md
              border border-gray-300 bg-white text-sm font-medium text-gray-500
              hover:bg-gray-50"
              :disabled="roles.prev_page_url === null"
              :class="[ roles.prev_page_url === null ? 'bg-gray-100 hover:bg-gray-100 cursor-default' : 'cursor-pointer' ]"
              @click="getPage(roles.prev_page_url)"
            >
              <span class="sr-only">Previous</span>
              <!-- Heroicon name: solid/chevron-left -->
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
            <button
              v-for="(data, key) in roles.links.slice(1, -1)"
              :key="key"
              class="inline-flex relative items-center px-4 py-2 border
              border-gray-300 bg-white text-sm font-medium text-gray-500
              hover:bg-gray-50"
              :disabled="data.active || data.url === null"
              :class="[ data.active || data.url === null ? 'bg-gray-100 hover:bg-gray-100 cursor-default' : 'cursor-pointer']"
              @click="getPage(data.url)"
            >
              <span
                :class="{ 'font-bold text-gray-700' : data.active }"
              >{{ data.label }}</span>
            </button>
            <button
              class="relative inline-flex items-center px-2 py-2 rounded-r-md
              border border-gray-300 bg-white text-sm font-medium text-gray-500
              hover:bg-gray-100"
              :disabled="roles.next_page_url === null"
              :class="[ roles.next_page_url === null ? 'bg-gray-100 hover:bg-gray-100 cursor-default' : 'cursor-pointer' ]"
              @click="getPage(roles.next_page_url)"
            >
              <span class="sr-only">Next</span>
              <!-- Heroicon name: solid/chevron-right -->
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  data () {
    return {
      isTyping: false,
      search: '',
      loading: true,
      loadingAPI: true,
      roles: []
    }
  },
  async fetch () {
    await this.$axios.$get('role').then((res) => {
      this.loading = false
      this.loadingAPI = false
      this.roles = res.data
    })
  },
  head () {
    return {
      title: 'Data Jabatan'
    }
  },
  watch: {
    search: _.debounce(function () {
      this.isTyping = false
    }, 500),
    isTyping (state) {
      if (!state) {
        this.searchRole()
      }
    }
  },
  methods: {
    showDetail (data) {
      this.$router.push('/dashboard/jabatan/' + data.id)
    },
    async getPage (link) {
      this.loadingAPI = true
      let url = 'role' + link
      if (this.search !== '') {
        url = 'search/role?query=' + this.search + '&' + link.substring(1)
      }
      await this.$axios.$get(url).then((res) => {
        this.loadingAPI = false
        this.roles = res.data
      })
    },
    async searchRole () {
      this.loadingAPI = true
      await this.$axios.$get('search/role?query=' + this.search).then((res) => {
        this.loadingAPI = false
        this.roles = res.data
      })
    }
  }
}
</script>

<style scoped>
.loading-bar {
  animation: indeterminate 2800ms infinite linear
}
@keyframes indeterminate {
  0% {
    transform: translateX(-100%) scaleX(0.2) }

  20% {
    transform: translateX(-40%) scaleX(0.2) }

  30% {
    transform: translateX(0%) scaleX(0.5) }

  55% {
    transform: translateX(100%) scaleX(0.7) }

  55.99% {
    transform: scaleX(0) }

  56% {
    transform: translateX(-100%) scaleX(0) }

  56.99% {
    transform: translateX(-100%) scaleX(0.6) }

  75% {
    transform: translateX(-5%) scaleX(0.6) }

  85% {
    transform: translateX(30%) scaleX(0.3) }

  98% {
    transform: translateX(100%) scaleX(0.2)}

  99.99% {
    transform: scaleX(0) }
  100% {
    transform: translateX(-100%)}
}
</style>

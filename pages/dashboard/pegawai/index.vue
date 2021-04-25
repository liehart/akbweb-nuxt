<template>
  <div>
    <div class="mb-5">
      <h1 class="text-4xl font-bold">
        Data Pegawai
      </h1>
      <p>Selamat datang di menu pengelolaan data pegawai</p>
    </div>
    <div class="mb-5 flex">
      <input
        ref="search"
        v-model="search"
        type="text"
        name="search"
        class="border rounded-lg px-3 py-2 text-sm w-full focus:ring-2
              focus:ring-blue-600 focus:outline-none"
        placeholder="Cari Pegawai"
        @input="isTyping = true"
      >
      <NuxtLink
        v-if="$auth.hasScope('employee.create')"
        to="/dashboard/pegawai/create"
        class="ml-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm
            text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none
            focus:ring-2 focus:ring-offset-2 focus:ring-red-500 whitespace-nowrap"
      >
        Tambah Pegawai
      </NuxtLink>
    </div>
    <div
      class="shadow overflow-hidden border-b bg-white border-gray-200 sm:rounded-lg"
    >
      <div
        class="h-1"
        :class="[ loadingAPI ? 'bg-red-200' : 'bg-gray-50' ]"
      >
        <div v-if="loadingAPI">
          <div class="loading-bar h-1 bg-red-500" />
        </div>
      </div>
      <table class="table-fixed min-w-full divide-y divide-gray-200">
        <thead v-if="!loading && employees.data.length > 0" class="bg-gray-50">
          <tr>
            <th scope="col" class="w-1/2 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nama
            </th>
            <th scope="col" class="w-1/5 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" class="w-1/5 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Jabatan
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
        <tbody v-else-if="!loading && employees.data.length > 0" class="bg-white divide-y divide-gray-200">
          <tr v-for="employee in employees.data" :key="employee.id">
            <td class="px-4 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <img
                    v-if="employee.image_path"
                    class="h-10 w-10 rounded-full"
                    :src="employee.image_path"
                    alt=""
                  >
                  <div
                    v-else
                    class="h-10 w-10 rounded-full bg-gray-500 flex justify-center items-center
                    text-white"
                  >
                    {{ employee.name[0].toUpperCase() }}
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ employee.name }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ employee.email }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
              <span v-if="!employee.is_disabled" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                Aktif
              </span>
              <span v-else class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                Tidak Aktif
              </span>
            </td>
            <td class="px-4 py-4">
              <div class="text-sm text-gray-500">
                <span v-if="employee.role">
                  {{ employee.role.name }}
                </span>
                <span v-else class="italic text-gray-400">
                  Tanpa Jabatan
                </span>
              </div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                class="text-red-600 hover:text-red-900"
                @click="showDetail(employee)"
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
      <div v-if="!loading && employees.data.length > 0" class="py-4 px-4 border-t flex justify-between">
        <div class="my-auto">
          <p class="text-sm text-gray-700">
            Menampilkan
            <span class="font-bold">{{ employees.from }}</span>
            ke
            <span class="font-bold">{{ employees.to }}</span>
            dari
            <span class="font-bold">{{ employees.total }}</span>
            hasil
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              class="relative inline-flex items-center px-2 py-2 rounded-l-md
              border border-gray-300 bg-white text-sm font-medium text-gray-500
              hover:bg-gray-50"
              :disabled="employees.prev_page_url === null"
              :class="[ employees.prev_page_url === null ? 'bg-gray-100 hover:bg-gray-100 cursor-default' : 'cursor-pointer' ]"
              @click="getPage(employees.prev_page_url)"
            >
              <span class="sr-only">Previous</span>
              <!-- Heroicon name: solid/chevron-left -->
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
            <button
              v-for="(data, key) in employees.links.slice(1, -1)"
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
              :disabled="employees.next_page_url === null"
              :class="[ employees.next_page_url === null ? 'bg-gray-100 hover:bg-gray-100 cursor-default' : 'cursor-pointer' ]"
              @click="getPage(employees.next_page_url)"
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
  middleware: 'employee/read',
  data () {
    return {
      isTyping: false,
      search: '',
      loading: true,
      loadingAPI: true,
      employees: []
    }
  },
  async fetch () {
    await this.$axios.$get('employee').then((res) => {
      this.loading = false
      this.loadingAPI = false
      this.employees = res.data
    })
  },
  head () {
    return {
      title: 'Data Pegawai'
    }
  },
  watch: {
    search: _.debounce(function () {
      this.isTyping = false
    }, 500),
    isTyping (state) {
      if (!state) {
        this.searchAPI()
      }
    }
  },
  methods: {
    showDetail (data) {
      this.$router.push('/dashboard/pegawai/' + data.id)
    },
    async getPage (link) {
      this.loadingAPI = true
      let url = 'employee' + link
      if (this.search !== '') {
        url = 'search/employee?query=' + this.search + '&' + link.substring(1)
      }
      await this.$axios.$get(url).then((res) => {
        this.loadingAPI = false
        this.employees = res.data
      })
    },
    async searchAPI () {
      this.loadingAPI = true
      await this.$axios.$get('search/employee?query=' + this.search).then((res) => {
        this.loadingAPI = false
        this.employees = res.data
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

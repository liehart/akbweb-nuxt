<template>
  <div>
    <div class="mb-5 flex justify-between items-center">
      <h1 class="text-4xl font-medium tracking-normal">
        Menu
      </h1>
      <NuxtLink
        v-if="$auth.hasScope('menu.create')"
        to="/dashboard/reservasi/create"
        class="h-full inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm
            text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none
            focus:ring-2 focus:ring-offset-2 focus:ring-red-500 whitespace-nowrap justify-between flex"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
        </svg>
        <span class="pl-2">
          Menu
        </span>
      </NuxtLink>
    </div>
    <div class="mb-5 flex justify-between">
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
            id="price"
            type="text"
            name="price"
            class="searchBox focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
            :class="{ 'searchBox-grow' : searchFocus }"
            placeholder="Search menu"
            @focus="searchFocus = true"
            @blur="searchFocus = false"
          >
        </div>
      </transition>
      <div class="flex items-center gap-2 text-sm text-gray-700">
        <div>
          Menampilkan
        </div>
        <div>
          <label for="currency" class="sr-only">Currency</label>
          <select id="currency" name="currency" class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-8 sm:text-sm border-gray-300 rounded-md">
            <option>10</option>
            <option>15</option>
            <option>25</option>
            <option>50</option>
          </select>
        </div>
        <div>
          hasil
        </div>
      </div>
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
            <th scope="col" class="w-1/2 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nama
            </th>
            <th scope="col" class="w-1/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Satuan
            </th>
            <th scope="col" class="w-1/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Jenis Menu
            </th>
            <th scope="col" class="w-1/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tersedia
            </th>
            <th scope="col" class="w-1/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Harga
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
        <tbody v-else-if="!loading && customers.data.length > 0" class="bg-white divide-y divide-gray-200">
          <tr v-for="customer in customers.data" :key="customer.id">
            <td class="px-4 py-4 whitespace-normal">
              <div class="flex flex-row items-center">
                <div class="w-20 mr-4">
                  <img class="h-14 rounded-md" src="https://1.bp.blogspot.com/-d0c5aPdkVLo/TiYR0bn1WEI/AAAAAAAAB64/y0kYhsI8qaU/s1600/korean-bbq-011.jpg" />
                </div>
                <div class="w-4/5">
                  <div class="text-sm text-gray-500">
                    <div class="font-medium">
                      {{ customer.name }}
                    </div>
                    <div class="text-sm text-gray-400">
                      {{ customer.description }}
                    </div>
                  </div>
                </div>
              </div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">
                {{ customer.unit }}
              </div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">
                <div v-if="customer.menu_type === 'main'" class="flex">
                  Utama
                </div>
                <div v-else-if="customer.menu_type === 'side_dish'" class="flex">
                  Side Dish
                </div>
                <div v-else-if="customer.menu_type === 'drink'" class="flex">
                  Minuman
                </div>
              </div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500 font-medium">
                <div v-if="customer.is_available === 1" class="flex gap-2 text-green-500">
                  <div class="h-2 w-2 bg-green-500 rounded-full my-auto" />
                  Ada
                </div>
                <div v-else class="flex gap-2 text-gray-500">
                  <div class="h-2 w-2 bg-gray-500 rounded-full my-auto" />
                  Kosong
                </div>
              </div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">
                {{ formatPrice(customer.price) }}
              </div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                class="text-red-600 hover:text-red-900"
                @click="showDetail(customer)"
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
      <div v-if="!loading && customers.data.length > 0" class="py-4 px-4 border-t flex justify-between">
        <div class="my-auto">
          <p class="text-sm text-gray-700">
            Menampilkan
            <span class="font-bold">{{ customers.from }}</span>
            ke
            <span class="font-bold">{{ customers.to }}</span>
            dari
            <span class="font-bold">{{ customers.total }}</span>
            hasil
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              class="relative inline-flex items-center px-2 py-2 rounded-l-md
              border border-gray-300 bg-white text-sm font-medium text-gray-500
              hover:bg-gray-50"
              :disabled="customers.prev_page_url === null"
              :class="[ customers.prev_page_url === null ? 'bg-gray-100 hover:bg-gray-100 cursor-default' : 'cursor-pointer' ]"
              @click="getPage(customers.prev_page_url)"
            >
              <span class="sr-only">Previous</span>
              <!-- Heroicon name: solid/chevron-left -->
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
            <button
              v-for="(data, key) in customers.links.slice(1, -1)"
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
              :disabled="customers.next_page_url === null"
              :class="[ customers.next_page_url === null ? 'bg-gray-100 hover:bg-gray-100 cursor-default' : 'cursor-pointer' ]"
              @click="getPage(customers.next_page_url)"
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
  middleware: 'menu/read',
  data () {
    return {
      searchFocus: false,
      isTyping: false,
      search: '',
      loading: true,
      loadingAPI: true,
      customers: []
    }
  },
  async fetch () {
    await this.$axios.$get('menu').then((res) => {
      console.log(res)
      this.loading = false
      this.loadingAPI = false
      this.customers = res.data
    })
  },
  head () {
    return {
      title: 'Data Pelanggan'
    }
  },
  watch: {
    search: _.debounce(function () {
      this.isTyping = false
    }, 500),
    isTyping (state) {
      if (!state) {
        this.searchCustomer()
      }
    }
  },
  methods: {
    formatPrice (data) {
      return data.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })
    },
    showDetail (data) {
      this.$router.push('/dashboard/pelanggan/' + data.id)
    },
    async getPage (link) {
      this.loadingAPI = true
      await this.$axios.$get('customer' + link).then((res) => {
        this.loadingAPI = false
        this.customers = res.data
      })
    },
    async searchCustomer () {
      this.loadingAPI = true
      await this.$axios.$get('search/customer?query=' + this.search).then((res) => {
        this.loadingAPI = false
        this.customers = res.data
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

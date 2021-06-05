<template>
  <div>
    <div class="mb-5 flex justify-between items-center">
      <h1 class="text-4xl font-medium tracking-normal">
        Reservasi
      </h1>
      <NuxtLink
        v-if="$auth.hasScope('reservation.create')"
        to="/dashboard/reservasi/create"
        class="h-full inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm
            text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none
            focus:ring-2 focus:ring-offset-2 focus:ring-red-500 whitespace-nowrap justify-between flex"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
        </svg>
        <span class="pl-2">
          Reservasi
        </span>
      </NuxtLink>
    </div>
    <div class="mb-3 grid grid-cols-8 gap-2">
      <div class="flex w-full relative col-span-6">
        <input
          v-model="filter.search"
          ref="search"
          type="text"
          name="search"
          class="placeholder-gray-300 flex-1 text-black block w-full rounded-md sm:text-sm border-gray-300"
          placeholder="Cari nama pelanggan"
          @input="isTyping = true"
        >
      </div>
      <div class="col-span-2">
        <t-datepicker v-model="filter.date" placeholder="Pilih range tanggal" range />
      </div>
    </div>
    <div class="mb-3 flex gap-5">
      <div class="my-auto col-span-2 flex gap-2">
        <div class="text-sm my-auto font-medium text-gray-500">
          Hide past reservation:
        </div>
        <t-toggle v-model="filter.hide" />
      </div>
      <div class="my-auto col-span-2 flex gap-2">
        <div class="text-sm my-auto font-medium text-gray-500 flex">
          <div>
            Filter:
          </div>
          <div class="flex ml-2">
            <t-checkbox-group v-model="filter.status" :options="filterCheck"></t-checkbox-group>
          </div>
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
            <th scope="col" class="w-1/12 text-center px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Meja
            </th>
            <th scope="col" class="w-1/4 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tanggal
            </th>
            <th scope="col" class="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nama Pelanggan
            </th>
            <th scope="col" class="relative px-4 py-3">
              <span class="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody v-if="loading" class="bg-white divide-y divide-gray-200">
          <tr>
            <td colspan="5" class="text-center py-5 text-gray-500 text-sm">
              Loading...
            </td>
          </tr>
        </tbody>
        <tbody v-else-if="!loading && reservations.data.length > 0" class="bg-white divide-y divide-gray-200">
          <tr v-for="reservation in reservations.data" :key="reservation.id">
            <td class="px-4 py-4">
              <div class="text-sm text-gray-500 flex m-auto">
                <div class="flex m-auto">
                  <div>
                    {{ reservation.table_number }}
                  </div>
                  <div v-if="!reservation.table && reservation.status === 'new'" class="has-tooltip my-auto text-red-500 cursor-pointer ml-1">
                    <span class="tooltip text-xs text-gray-500 bg-white rounded border border-gray-200 shadow-lg ml-7 px-2 p-1 -mt-3.5">
                      <span class="font-bold">Meja telah dihapus</span>
                      <br>
                      Ganti meja untuk melanjutkan reservasi
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500 font-medium flex gap-2">
                {{ format_date(reservation.date) }}
                <div class="text-sm text-gray-500 my-auto">
                  <div v-if="reservation.session === 'lunch'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-yellow-100 text-yellow-800">
                    <div class="my-auto mr-1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      Lunch
                    </div>
                  </div>
                  <div v-else-if="reservation.session === 'dinner'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-blue-100 text-blue-800">
                    <div class="my-auto mr-1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                      </svg>
                    </div>
                    <div>
                      Dinner
                    </div>
                  </div>
                </div>
              </div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500 font-medium">
                <div v-if="reservation.status === 'new'" class="flex gap-2 text-green-500">
                  <div class="h-2 w-2 bg-green-500 rounded-full my-auto" />
                  New
                </div>
                <div v-else-if="reservation.status === 'in'" class="flex gap-2 text-yellow-500">
                  <div class="h-2 w-2 bg-yellow-500 rounded-full my-auto" />
                  On Seat
                </div>
                <div v-else-if="reservation.status === 'done'" class="flex gap-2 text-blue-500">
                  <div class="h-2 w-2 bg-blue-500 rounded-full my-auto" />
                  Finished
                </div>
                <div v-else class="flex gap-2">
                  <div class="h-2 w-2 bg-gray-500 rounded-full my-auto" />
                  Cancelled
                </div>
              </div>
            </td>
            <td class="px-4 py-4">
              <div class="text-sm text-gray-500">
                <span v-if="!reservation.customer.deleted_at">
                  {{ reservation.customer.name }}
                </span>
                <span v-else class="italic text-gray-300">
                  {{ reservation.customer.name }} (dihapus)
                </span>
              </div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                class="text-red-600 hover:text-red-900"
                @click="showDetail(reservation)"
              >
                Detail
              </button>
            </td>
          </tr>
        </tbody>
        <tbody v-else class="bg-white divide-y divide-gray-200">
          <tr>
            <td colspan="5" class="text-center py-5 text-gray-500 text-sm">
              Tidak ada data
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!loading && reservations.data.length > 0" class="py-4 px-4 border-t flex justify-between">
        <div class="my-auto">
          <p class="text-sm text-gray-700">
            Menampilkan
            <span class="font-bold">{{ reservations.from }}</span>
            ke
            <span class="font-bold">{{ reservations.to }}</span>
            dari
            <span class="font-bold">{{ reservations.total }}</span>
            hasil
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              class="relative inline-flex items-center px-2 py-2 rounded-l-md
              border border-gray-300 bg-white text-sm font-medium text-gray-500
              hover:bg-gray-50"
              :disabled="reservations.prev_page_url === null"
              :class="[ reservations.prev_page_url === null ? 'bg-gray-100 hover:bg-gray-100 cursor-default' : 'cursor-pointer' ]"
              @click="getPage(reservations.prev_page_url)"
            >
              <span class="sr-only">Previous</span>
              <!-- Heroicon name: solid/chevron-left -->
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
            <button
              v-for="(data, key) in reservations.links.slice(1, -1)"
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
              :disabled="reservations.next_page_url === null"
              :class="[ reservations.next_page_url === null ? 'bg-gray-100 hover:bg-gray-100 cursor-default' : 'cursor-pointer' ]"
              @click="getPage(reservations.next_page_url)"
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
import moment from 'moment'
import _ from 'lodash'

moment.locale('id')

export default {
  middleware: 'reservation/read',
  data () {
    return {
      loading: true,
      loadingAPI: true,
      reservations: [],
      isTyping: false,
      filter: {
        date: [],
        from: '',
        to: '',
        hide: true,
        status: ['in', 'new'],
        search: ''
      },
      filterCheck: [
        {
          value: 'new',
          text: 'New'
        },
        {
          value: 'in',
          text: 'On Seat'
        },
        {
          value: 'done',
          text: 'Selesai'
        },
        {
          value: 'cancelled',
          text: 'Batal'
        }
      ]
    }
  },
  watch: {
    'filter.search': _.debounce(function () {
      this.isTyping = false
    }, 500),
    isTyping (state) {
      if (!state) {
        this.fetchData()
      }
    },
    'filter.hide' () {
      this.fetchData()
    },
    'filter.status' () {
      this.fetchData()
    },
    'filter.date' () {
      this.filter.from = this.filter.date[0]
      this.filter.to = this.filter.date[1]
      this.fetchData()
    }
  },
  async fetch () {
    await this.$axios.post(
      'search/reservation', this.filter
    ).then((res) => {
      console.log(res)
      this.loading = false
      this.loadingAPI = false
      this.reservations = res.data.data
    })
  },
  head () {
    return {
      title: 'Data Reservasi'
    }
  },
  methods: {
    fetchData () {
      this.loading = true
      this.loadingAPI = true
      this.$axios.post(
        'search/reservation', this.filter
      ).then((res) => {
        this.loading = false
        this.loadingAPI = false
        this.reservations = res.data.data
      })
    },
    format_date (value) {
      if (value) {
        return moment(String(value)).format('LL')
      }
    },
    showDetail (data) {
      this.$router.push('/dashboard/reservasi/' + data.id)
    },
    async getPage (link) {
      this.loadingAPI = true
      await this.$axios.$get('reservation' + link).then((res) => {
        this.loadingAPI = false
        this.reservations = res.data
      })
    }
  }
}
</script>

<style lang="postcss" scoped>
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

.tooltip {
  @apply invisible absolute
}

.has-tooltip:hover .tooltip {
  @apply visible z-50
}
</style>

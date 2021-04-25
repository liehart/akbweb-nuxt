<template>
  <div>
    <div class="mb-5">
      <h1 class="text-4xl font-bold">
        Data Reservasi
      </h1>
      <p>Selamat datang di menu pengelolaan data reservasi</p>
    </div>
    <div class="mb-5 flex">
      <div class="flex w-full relative">
        <input
          ref="search"
          type="text"
          name="search"
          class="w-full border rounded-lg px-3 py-2 text-sm w-full focus:ring-2
              focus:ring-blue-600 focus:outline-none"
          placeholder="Cari Reservasi"
        >
      </div>
      <NuxtLink
        v-if="$auth.hasScope('reservation.create')"
        to="/dashboard/reservasi/create"
        class="ml-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm
            text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none
            focus:ring-2 focus:ring-offset-2 focus:ring-red-500 whitespace-nowrap"
      >
        Tambah Reservasi
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
            <th scope="col" class="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tanggal
            </th>
            <th scope="col" class="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sesi
            </th>
            <th scope="col" class="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nomor Meja
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
            <td colspan="4" class="text-center py-5 text-gray-500 text-sm">
              Loading...
            </td>
          </tr>
        </tbody>
        <tbody v-else-if="!loading && reservations.data.length > 0" class="bg-white divide-y divide-gray-200">
          <tr v-for="reservation in reservations.data" :key="reservation.id">
            <td class="px-4 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">
                {{ reservation.date }}
              </div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">
                <span v-if="reservation.session === 'lunch'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                  Makan Siang
                </span>
                <span v-else-if="reservation.session === 'dinner'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  Makan Malam
                </span>
                <span v-else class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                  Tanpa Reservasi
                </span>
              </div>
            </td>
            <td class="px-4 py-4">
              <div class="text-sm text-gray-500">
                {{ reservation.table_number }}
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
            <td colspan="4" class="text-center py-5 text-gray-500 text-sm">
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
export default {
  middleware: 'reservation/read',
  data () {
    return {
      loading: true,
      loadingAPI: true,
      reservations: []
    }
  },
  async fetch () {
    await this.$axios.$get('reservation').then((res) => {
      this.loading = false
      this.loadingAPI = false
      this.reservations = res.data
    })
  },
  head () {
    return {
      title: 'Data Reservasi'
    }
  },
  methods: {
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

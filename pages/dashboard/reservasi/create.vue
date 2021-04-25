<template>
  <div>
    <div class="mb-5 antialiased">
      <div class="flex justify-between">
        <div class="flex-col my-auto">
          <h1 class="text-4xl font-bold">
            Tambah Reservasi Baru
          </h1>
          <p>Menu untuk menambah reservasi baru</p>
        </div>
        <div class="flex my-auto">
          <button
            class="text-gray-500 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm
            font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2
            focus:ring-offset-2 focus:ring-gray-500"
            @click="back()"
          >
            Batal
          </button>
          <button
            class="ml-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm
            text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none
            focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            @click="createReservation"
          >
            Tambah
          </button>
        </div>
      </div>
    </div>
    <div>
      <div class="grid grid-cols-4 gap-6">
        <div class="col-span-1">
          <div class="px-4 sm:px-0">
            <h3 class="text-lg font-medium leading-6 text-gray-900">
              Data Pelangan
            </h3>
            <p class="mt-1 text-sm text-gray-600">
              Bagian ini berisi data pelanggan yang melakukan reservasi.
            </p>
          </div>
        </div>
        <div class="col-span-3">
          <div
            class="shadow bg-white overflow-hidden border-b border-gray-200 sm:rounded-lg"
          >
            <div
              :class="[ loadingAPI ? 'bg-red-200' : 'bg-white' ]"
              class="h-1"
            >
              <div v-if="loadingAPI">
                <div class="loading-bar h-1 bg-red-500" />
              </div>
            </div>
            <div class="p-5">
              <label class="block text-sm font-medium text-gray-700" for="name">
                Cari Nama Pelanggan
              </label>
              <div class="mt-1 flex-col">
                <input
                  id="name"
                  v-model="search"
                  class="placeholder-gray-300 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                  name="name"
                  placeholder="Nama Pelanggan"
                  type="text"
                  @input="isTyping = true"
                >
              </div>
            </div>
            <div v-if="loading" class="text-center py-5 text-gray-500 text-sm">
              Loading...
            </div>
            <div v-else-if="!loading && customers.data.length > 0">
              <div class="grid grid-cols-3 gap-4 pt-0 p-5">
                <div v-for="(data, key) in customers.data" :key="key" @click="selectCustomer(data.id)">
                  <div
                    class="transition duration-200 select-none grid grid-cols-9 p-5 rounded-md cursor-pointer border"
                    :class="[ form.customer_id === data.id ? 'border-red-500 bg-red-50 hover:bg-red-100 border-red-500' : 'hover:bg-gray-50 border-gray-300' ]"
                  >
                    <div class="flex-col col-span-8 text-sm">
                      <div
                        class="font-semibold truncate"
                        :class="[ form.customer_id === data.id ? 'text-red-600' : '' ]"
                      >
                        {{ data.name }}
                      </div>
                      <div
                        class="text-xs text-gray-700"
                      >
                        <span v-if="data.email !== null">
                          {{ data.email }}
                        </span>
                        <span v-else>
                          -
                        </span>
                      </div>
                      <div
                        class="text-xs text-gray-700"
                      >
                        <span v-if="data.phone !== null">
                          {{ data.phone }}
                        </span>
                        <span v-else>
                          -
                        </span>
                      </div>
                    </div>
                    <div class="col-span-1 text-sm h-5 w-5 my-auto">
                      <div v-if="form.customer_id === data.id" class="h-5 w-5 text-red-500 my-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <span v-if="submitted && !$v.form.customer_id.minValue" class="text-xs text-red-500">
                  Pelanggan harus dipilih
                </span>
              </div>
            </div>
            <div v-else class="text-center py-5 text-gray-500 text-sm mb-5">
              Data pelanggan tidak ditemukan
            </div>
            <div v-if="!loading" class="py-4 px-4 border-t flex justify-between">
              <div class="my-auto">
                <p class="text-sm text-gray-700">
                  Menampilkan
                  <span v-if="customers.data.length > 0">
                    <span class="font-bold">{{ customers.from }}</span>
                    ke
                    <span class="font-bold">{{ customers.to }}</span>
                    dari
                  </span>
                  <span class="font-bold">{{ customers.total }}</span>
                  hasil
                </p>
              </div>
              <div>
                <nav aria-label="Pagination" class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    :class="[ customers.prev_page_url === null ? 'bg-gray-100 hover:bg-gray-100 cursor-default' : 'cursor-pointer' ]"
                    :disabled="customers.prev_page_url === null"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md
                    border border-gray-300 bg-white text-sm font-medium text-gray-500
                    hover:bg-gray-50"
                    @click="getPage(customers.prev_page_url)"
                  >
                    <span class="sr-only">Previous</span>
                    <!-- Heroicon name: solid/chevron-left -->
                    <svg
                      aria-hidden="true"
                      class="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        clip-rule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        fill-rule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    v-for="(data, key) in customers.links.slice(1, -1)"
                    :key="key"
                    :class="[ data.active || data.url === null ? 'bg-gray-100 hover:bg-gray-100 cursor-default' : 'cursor-pointer']"
                    :disabled="data.active || data.url === null"
                    class="inline-flex relative items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    @click="getPage(data.url)"
                  >
                    <span
                      :class="{ 'font-bold text-gray-700' : data.active }"
                    >{{ data.label }}</span>
                  </button>
                  <button
                    :class="[ customers.next_page_url === null ? 'bg-gray-100 hover:bg-gray-100 cursor-default' : 'cursor-pointer' ]"
                    :disabled="customers.next_page_url === null"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-100"
                    @click="getPage(customers.next_page_url)"
                  >
                    <span class="sr-only">Next</span>
                    <!-- Heroicon name: solid/chevron-right -->
                    <svg
                      aria-hidden="true"
                      class="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        clip-rule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        fill-rule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" class="hidden sm:block">
        <div class="py-5">
          <div class="border-t border-gray-200" />
        </div>
      </div>
      <div class="grid md:grid-cols-4 md:gap-6">
        <div class="col-span-1">
          <div class="px-4 sm:px-0">
            <h3 class="text-lg font-medium leading-6 text-gray-900">
              Data Reservasi
            </h3>
            <p class="mt-1 text-sm text-gray-600">
              Bagian ini berisi data utama dari reservasi.
            </p>
          </div>
        </div>
        <div class="col-span-3">
          <div class="shadow sm:rounded-md sm:overflow-hidden">
            <div class="px-4 py-5 bg-white space-y-6 sm:p-6">
              <div class="grid grid-cols-2 gap-6">
                <div class="col-span-2 sm:col-span-2">
                  <label class="block text-sm font-medium text-gray-700">
                    Sesi Reservasi
                  </label>
                  <div class="grid grid-cols-3 gap-4 mt-1">
                    <div v-for="(data, key) in sessionList" :key="key" @click="selectSession(data.value)">
                      <div
                        class="transition duration-200 select-none grid grid-cols-9 p-5 rounded-md cursor-pointer border"
                        :class="[ form.session === data.value ? 'border-red-500 bg-red-50 hover:bg-red-100 border-red-500' : 'hover:bg-gray-50 border-gray-300' ]"
                      >
                        <div class="flex-col col-span-8 text-sm">
                          <div
                            class="font-semibold truncate"
                            :class="[ form.session === data.value ? 'text-red-600' : '' ]"
                          >
                            {{ data.data.name }}
                          </div>
                          <div
                            class="text-xs text-gray-700"
                          >
                            {{ data.data.time }}
                          </div>
                        </div>
                        <div class="col-span-1 text-sm h-5 w-5 my-auto">
                          <div v-if="form.session === data.value" class="h-5 w-5 text-red-500 my-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                    <span v-if="submitted && !$v.form.session.required" class="text-xs text-red-500">
                      Sesi reservasi harus dipilih
                    </span>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-6">
                <div class="col-span-2 sm:col-span-2">
                  <label class="block text-sm font-medium text-gray-700">
                    Tanggal Reservasi
                  </label>
                  <div class="grid grid-cols-9 gap-2 mt-1 mb-2">
                    <button
                      :disabled="prevDateState || isOffHoursReservation"
                      :class="[ prevDateState || isOffHoursReservation ? 'text-gray-500 bg-gray-100 hover:bg-gray-100 cursor-default' : 'cursor-pointer']"
                      class="transition duration-200 select-none grid p-2 rounded-md
                      border text-sm hover:bg-gray-50 border-gray-300 focus:outline-none
                      text-left"
                      @click="prevDate"
                    >
                      <div
                        class="font-semibold"
                      >
                        7 hari
                      </div>
                      <div
                        class="text-xs text-gray-700"
                      >
                        Prev
                      </div>
                    </button>
                    <button
                      v-for="(data, key) in dateList"
                      :key="key"
                      :disabled="isOffHoursReservation"
                      :class="[ isOffHoursReservation ? 'text-gray-500 bg-gray-100 hover:bg-gray-100 cursor-default' : 'cursor-pointer hover:bg-gray-50 border-gray-300']"
                      class="transition rounded-md duration-200 select-none grid
                      text-sm border-gray-300 focus:outline-none
                      text-left"
                      @click="selectDate(data.date)"
                    >
                      <div
                        class="select-none grid p-2 rounded-md border"
                        :class="[ form.date === data.date ? 'border-red-500 bg-red-50 hover:bg-red-100 border-red-500' : '']"
                      >
                        <div class="flex-col text-sm">
                          <div
                            class="font-semibold"
                            :class="[ form.date === data.date ? 'text-red-600' : '' ]"
                          >
                            {{ data.day }}
                          </div>
                          <div
                            class="text-xs text-gray-700"
                          >
                            {{ data.prettyDate }}
                          </div>
                        </div>
                      </div>
                    </button>
                    <button
                      :disabled="isOffHoursReservation"
                      :class="[ isOffHoursReservation ? 'text-gray-500 bg-gray-100 hover:bg-gray-100 cursor-default' : 'cursor-pointer']"
                      class="transition duration-200 select-none grid p-2 rounded-md
                      border text-sm hover:bg-gray-50 border-gray-300 focus:outline-none
                      text-left"
                      @click="nextDate"
                    >
                      <div
                        class="font-semibold"
                      >
                        7 hari
                      </div>
                      <div
                        class="text-xs text-gray-700"
                      >
                        Next
                      </div>
                    </button>
                  </div>
                </div>
                <span v-if="submitted && !$v.form.date.required" class="text-xs text-red-500">
                  Tanggal harus dipilih
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" class="hidden sm:block">
        <div class="py-5">
          <div class="border-t border-gray-200" />
        </div>
      </div>
      <div class="grid grid-cols-4 gap-6">
        <div class="col-span-1">
          <div class="px-4 sm:px-0">
            <h3 class="text-lg font-medium leading-6 text-gray-900">
              Data Meja
            </h3>
            <p class="mt-1 text-sm text-gray-600">
              Bagian ini berisi data meja yang dipilih saat reservasi.
            </p>
          </div>
        </div>
        <div class="col-span-3">
          <div
            class="shadow bg-white overflow-hidden border-b border-gray-200 sm:rounded-lg"
          >
            <div
              :class="[ loadingTableAPI ? 'bg-red-200' : 'bg-white' ]"
              class="h-1"
            >
              <div v-if="loadingTableAPI">
                <div class="loading-bar h-1 bg-red-500" />
              </div>
            </div>
            <div class="p-5">
              <label class="block text-sm font-medium text-gray-700" for="table_number">
                Cari No Meja
              </label>
              <div class="mt-1 flex-col">
                <input
                  id="table_number"
                  v-model="searchTable"
                  class="placeholder-gray-300 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                  name="name"
                  placeholder="Nomor Meja"
                  type="text"
                  @input="isTypingTable = true"
                >
              </div>
            </div>
            <div v-if="loadingTable" class="text-center py-5 text-gray-500 text-sm">
              Loading...
            </div>
            <div v-else-if="!loadingTable && tables.data.length > 0">
              <div class="grid grid-cols-3 gap-4 pt-0 p-5">
                <div v-for="(data, key) in tables.data" :key="key" @click="selectTable(data.table_number)">
                  <div
                    class="transition duration-200 select-none flex justify-between p-5 rounded-md cursor-pointer border"
                    :class="[ form.table_number === data.table_number ? 'border-red-500 bg-red-50 hover:bg-red-100 border-red-500' : 'hover:bg-gray-50 border-gray-300' ]"
                  >
                    <div class="flex gap-2 text-sm">
                      <div
                        class="font-semibold truncate"
                        :class="[ form.table_number === data.table_number ? 'text-red-600' : '' ]"
                      >
                        {{ data.table_number }}
                      </div>
                      <div>
                        <span v-if="!data.is_empty" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Kosong
                        </span>
                        <span v-else class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Terisi
                        </span>
                      </div>
                    </div>
                    <div class="col-span-1 text-sm h-5 w-5 my-auto">
                      <div v-if="form.table_number === data.table_number" class="h-5 w-5 text-red-500 my-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <span v-if="submitted && !$v.form.table_number.minValue" class="text-xs text-red-500">
                  Meja harus dipilih
                </span>
              </div>
            </div>
            <div v-else class="text-center py-5 text-gray-500 text-sm mb-5">
              Data meja tidak ditemukan
            </div>
            <div v-if="!loadingTable" class="py-4 px-4 border-t flex justify-between">
              <div class="my-auto">
                <p class="text-sm text-gray-700">
                  Menampilkan
                  <span v-if="tables.data.length > 0">
                    <span class="font-bold">{{ tables.from }}</span>
                    ke
                    <span class="font-bold">{{ tables.to }}</span>
                    dari
                  </span>
                  <span class="font-bold">{{ tables.total }}</span>
                  hasil
                </p>
              </div>
              <div>
                <nav aria-label="Pagination" class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    :class="[ tables.prev_page_url === null ? 'bg-gray-100 hover:bg-gray-100 cursor-default' : 'cursor-pointer' ]"
                    :disabled="tables.prev_page_url === null"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md
                    border border-gray-300 bg-white text-sm font-medium text-gray-500
                    hover:bg-gray-50"
                    @click="getPageTable(tables.prev_page_url)"
                  >
                    <span class="sr-only">Previous</span>
                    <!-- Heroicon name: solid/chevron-left -->
                    <svg
                      aria-hidden="true"
                      class="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        clip-rule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        fill-rule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    v-for="(data, key) in tables.links.slice(1, -1)"
                    :key="key"
                    :class="[ data.active || data.url === null ? 'bg-gray-100 hover:bg-gray-100 cursor-default' : 'cursor-pointer']"
                    :disabled="data.active || data.url === null"
                    class="inline-flex relative items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    @click="getPageTable(data.url)"
                  >
                    <span
                      :class="{ 'font-bold text-gray-700' : data.active }"
                    >{{ data.label }}</span>
                  </button>
                  <button
                    :class="[ tables.next_page_url === null ? 'bg-gray-100 hover:bg-gray-100 cursor-default' : 'cursor-pointer' ]"
                    :disabled="tables.next_page_url === null"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-100"
                    @click="getPageTable(tables.next_page_url)"
                  >
                    <span class="sr-only">Next</span>
                    <!-- Heroicon name: solid/chevron-right -->
                    <svg
                      aria-hidden="true"
                      class="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        clip-rule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        fill-rule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { minValue, required } from 'vuelidate/lib/validators'
import _ from 'lodash'
import moment from 'moment'

moment.locale('id')

export default {
  middleware: 'reservation/create',
  validations: {
    form: {
      customer_id: {
        required,
        minValue: minValue(1)
      },
      table_number: {
        required,
        minValue: minValue(1)
      },
      session: {
        required
      },
      date: {
        required
      }
    }
  },
  data () {
    return {
      form: {
        customer_id: 0,
        session: '',
        date: '',
        table_number: 0
      },
      submitted: false,
      isTyping: false,
      search: '',
      isTypingTable: false,
      searchTable: '',
      loading: true,
      loadingAPI: true,
      loadingTable: true,
      loadingTableAPI: true,
      customers: [],
      tables: [],
      dateList: [],
      sessionList: [
        {
          data: {
            name: 'Lunch',
            time: '11.00-14.00'
          },
          value: 'lunch'
        },
        {
          data: {
            name: 'Dinner',
            time: '19.00-22.00'
          },
          value: 'dinner'
        },
        {
          data: {
            name: 'Off Hours',
            time: 'No Time (Hanya dilayani hari H)'
          },
          value: 'other'
        }
      ]
    }
  },
  async fetch () {
    await this.$axios.$get('customer').then((res) => {
      this.loading = false
      this.loadingAPI = false
      this.customers = res.data
    })
    await this.$axios.$get('table').then((res) => {
      this.loadingTable = false
      this.loadingTableAPI = false
      this.tables = res.data
    })
    const now = moment()
    this.form.date = now.format('YYYY-MM-DD')
    await this.generateDate(now)
  },
  head () {
    return {
      title: 'Tambah Pegawai'
    }
  },
  computed: {
    prevDateState () {
      if (this.dateList.length > 0) {
        if (moment(this.dateList[0].date).isSameOrAfter(moment())) {
          return false
        }
      }
      return true
    },
    isOffHoursReservation () {
      return this.form.session === 'other'
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
    },
    searchTable: _.debounce(function () {
      this.isTypingTable = false
    }, 500),
    isTypingTable (state) {
      if (!state) {
        this.searchAPITable()
      }
    }
  },
  methods: {
    prevDate () {
      const date = moment(this.dateList[0].date)
      date.subtract(6, 'days')
      this.generateDate(date)
    },
    nextDate () {
      const date = moment(this.dateList[0].date)
      date.add(6, 'days')
      this.generateDate(date)
    },
    generateDate (now) {
      const dates = []
      _.times(7, () => {
        const data = {
          date: now.format('YYYY-MM-DD'),
          day: now.format('dddd'),
          prettyDate: now.format('Do MMM')
        }
        dates.push(data)
        now.add(1, 'days')
      })
      this.dateList = dates
    },
    back () {
      this.$router.push('/dashboard/reservasi')
    },
    selectCustomer (id) {
      if (this.form.customer_id === id) {
        this.form.customer_id = 0
      } else {
        this.form.customer_id = id
      }
      this.$v.form.customer_id.$touch()
    },
    selectDate (date) {
      if (this.form.date === date) {
        this.form.date = ''
      } else {
        this.form.date = date
      }
      this.$v.form.date.$touch()
    },
    selectSession (value) {
      if (this.form.session === value) {
        this.form.session = ''
      } else {
        this.form.session = value
        if (this.form.session === 'other') {
          const now = moment()
          this.form.date = now.format('YYYY-MM-DD')
          this.generateDate(now)
        }
      }
      this.$v.form.session.$touch()
    },
    selectTable (value) {
      if (this.form.table_number === value) {
        this.form.table_number = 0
      } else {
        this.form.table_number = value
      }
      this.$v.form.table_number.$touch()
    },
    createReservationAPI () {
      this.$axios.post('reservation', this.form).then((res) => {
        this.back()
        this.$toast.show({
          type: 'success',
          title: 'Berhasil',
          message: 'Data reservasi berhasil dibuat.',
          timeout: 3
        })
      }).catch((err) => {
        if (err.response) {
          if (err.response.data.message === 'V_ERR') {
            const errors = err.response.data.data
            for (const key in errors) {
              this.$toast.show({
                type: 'danger',
                title: 'Error',
                message: errors[key][0],
                timeout: 3
              })
            }
          }
        }
      })
    },
    createReservation () {
      this.$v.$touch()
      this.submitted = true
      if (!this.$v.$error) {
        this.createReservationAPI()
      }
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
    },
    async getPageTable (link) {
      this.loadingAPI = true
      let url = 'table' + link
      if (this.search !== '') {
        url = 'search/table?query=' + this.search + '&' + link.substring(1)
      }
      await this.$axios.$get(url).then((res) => {
        this.loadingAPI = false
        this.tables = res.data
      })
    },
    async searchAPITable () {
      this.loadingAPI = true
      await this.$axios.$get('search/table?query=' + this.searchTable).then((res) => {
        this.loadingAPI = false
        this.tables = res.data
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
    transform: translateX(-100%) scaleX(0.2)
  }

  20% {
    transform: translateX(-40%) scaleX(0.2)
  }

  30% {
    transform: translateX(0%) scaleX(0.5)
  }

  55% {
    transform: translateX(100%) scaleX(0.7)
  }

  55.99% {
    transform: scaleX(0)
  }

  56% {
    transform: translateX(-100%) scaleX(0)
  }

  56.99% {
    transform: translateX(-100%) scaleX(0.6)
  }

  75% {
    transform: translateX(-5%) scaleX(0.6)
  }

  85% {
    transform: translateX(30%) scaleX(0.3)
  }

  98% {
    transform: translateX(100%) scaleX(0.2)
  }

  99.99% {
    transform: scaleX(0)
  }
  100% {
    transform: translateX(-100%)
  }
}
</style>

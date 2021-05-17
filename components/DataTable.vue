<template>
  <div>
    <div class="mb-5 flex justify-between">
      <div>
        <SearchBox v-model="filter.query" placeholder="Search by name" />
      </div>
      <div class="flex items-center gap-2 text-sm text-gray-700">
        <div v-if="filters.length > 0">
          Filter
        </div>
        <div v-for="(f, k) in filters" :key="k">
          <div v-if="f.type === 'date' || f.type === 'date.range'">
            <div v-if="f.type === 'date'">
              <t-datepicker v-model="filterOut.filters[k]" :placeholder="`Pilih ${f.label}`" @change="change"/>
            </div>
            <div v-else-if="f.type === 'date.range'">
              <t-datepicker v-model="filterOut.filters[k]" :placeholder="`Pilih ${f.label}`" :range="true" @change="change"/>
            </div>
          </div>
          <div v-else>
            <t-rich-select
              v-model="filterOut.filters[k]"
              multiple
              :hide-search-box="true"
              :close-on-select="false"
              :options="f.rules"
              value-attribute="value"
              text-attribute="name"
              :placeholder="`Pilih ${f.label}`"
              @change="change"
            />
          </div>
        </div>
        <div>
          Results per page
        </div>
        <div>
          <t-rich-select
            v-model="filter.show"
            :hide-search-box="true"
            :options="perPageView"
            variant="simple"
            class="w-20"
            @change="change"
          />
        </div>
      </div>
    </div>
    <div
      class="shadow bg-white overflow-hidden border-b border-gray-200 sm:rounded-lg"
    >
      <div
        class="h-1"
        :class="[ loadingAPI ? 'bg-blue-200' : 'bg-gray-50' ]"
      >
        <div v-if="loadingAPI">
          <div class="loading-bar h-1 bg-blue-500" />
        </div>
      </div>
      <table class="max-w-full w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="(v, k) in headers"
              :key="k"
              scope="col"
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              :class="[(v.sort === false) ? '' : 'hover:opacity-70 cursor-pointer'] + ` w-${v.width}`"
              @click="(v.sort === false) ? null : changeSort(v.value)"
            >
              <div class="flex items-center gap-2">
                <div class="truncate select-none">
                  {{ v.name }}
                </div>
                <div v-if="filter.sort === v.value">
                  <div v-if="filter.asc">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z" />
                    </svg>
                  </div>
                  <div v-else>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody v-if="loading" class="bg-white divide-y divide-gray-200">
          <tr>
            <td :colspan="headers.length + 1" class="text-center py-5 text-gray-500 text-sm">
              Loading...
            </td>
          </tr>
        </tbody>
        <tbody v-else-if="!loading && data.data.length > 0" class="bg-white divide-y divide-gray-200">
          <tr v-for="menu in data.data" :key="menu.id">
            <td
              v-for="(v, k) in headers"
              :key="k"
              :ref="v.value"
              class="px-4 py-4 whitespace-normal"
              :class="`w-${v.width}`"
            >
              <div class="text-sm text-gray-500" :class="v.align">
                <slot :name="v.value" :item="menu">
                  {{ lo.get(menu, v.value) }}
                </slot>
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-else class="bg-white divide-y divide-gray-200">
          <tr>
            <td :colspan="headers.length + 1" class="text-center py-5 text-gray-500 text-sm">
              Tidak ada data
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!loading && data.data.length > 0" class="py-4 px-4 border-t flex justify-between">
        <div class="my-auto">
          <p class="text-sm text-gray-700">
            Menampilkana
            <span class="font-bold">{{ data.from }}</span>
            ke
            <span class="font-bold">{{ data.to }}</span>
            dari
            <span class="font-bold">{{ data.total }}</span>
            hasil
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              class="relative inline-flex items-center px-2 py-2 rounded-l-md
              border border-gray-300 bg-white text-sm font-medium text-gray-500
              hover:bg-gray-50 focus:outline-none"
              :disabled="data.prev_page_url === null"
              :class="[ data.prev_page_url === null ? 'bg-gray-100 hover:bg-gray-100 cursor-default' : 'cursor-pointer' ]"
              @click="changePage(data.prev_page_url)"
            >
              <span class="sr-only">Previous</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
            <button
              v-for="(v, key) in data.links.slice(1, -1)"
              :key="key"
              class="inline-flex relative items-center px-4 py-2 border
              border-gray-300 bg-white text-sm font-medium text-gray-500
              hover:bg-gray-50 focus:outline-none"
              :disabled="v.active || v.url === null"
              :class="[ v.active || v.url === null ? 'bg-gray-100 hover:bg-gray-100 cursor-default' : 'cursor-pointer']"
              @click="changePage(v.url)"
            >
              <span
                :class="{ 'font-bold' : v.active }"
              >{{ v.label }}</span>
            </button>
            <button
              class="relative inline-flex items-center px-2 py-2 rounded-r-md
              border border-gray-300 bg-white text-sm font-medium text-gray-500
              hover:bg-gray-50 focus:outline-none"
              :disabled="data.next_page_url === null"
              :class="[ data.next_page_url === null ? 'bg-gray-100 hover:bg-gray-100 cursor-default' : 'cursor-pointer' ]"
              @click="changePage(data.next_page_url)"
            >
              <span class="sr-only">Next</span>
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
  name: 'DataTable',
  props: {
    loading: {
      type: Boolean,
      required: true
    },
    data: {
      required: true
    },
    loadingAPI: {
      type: Boolean,
      required: true
    },
    headers: {
      required: true
    },
    value: {
      default: null
    },
    filters: {
      default: [],
      required: false
    }
  },
  data () {
    return {
      filterOut: {
        filters: [],
        filtersName: this.filters ? this.filters.map(({ name }) => name) : []
      },
      filter: {
        query: '',
        sort: this.value.sort ?? '',
        asc: true,
        show: 10,
        page: 1,
        filter: []
      },
      perPageView: [
        10,
        25,
        50,
        100
      ],
      lo: _
    }
  },
  watch: {
    filter: {
      deep: true,
      handler () {
        this.$emit('input', this.filter)
      }
    }
  },
  methods: {
    change () {
      this.filter.filter = this.filters.map(function (x, i) {
        return { name: x.name, type: x.type ?? 'default', value: this.filterOut.filters[i] || [] }
      }.bind(this))
      this.filter.page = 1
    },
    changePage (page) {
      this.filter.page = page.replace(/\D/g, '')
    },
    changeSort (sort) {
      this.filter.page = 1
      if (this.filter.sort === sort) {
        this.filter.asc = !this.filter.asc
      } else {
        this.filter.sort = sort
        this.filter.asc = true
      }
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

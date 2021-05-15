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
    <DataTable
      v-model="filter"
      :loading="loading"
      :loading-a-p-i="loadingAPI"
      :data="menus"
      :headers="headers"
      :filters="filters"
    >
      <template #name="{ item }">
        <div class="flex flex-row items-start">
          <div class="w-16 mr-4 flex-shrink-0">
            <div v-if="item.image_path">
              <img class="h-16 w-16 rounded-md" :src="item.image_path">
            </div>
            <div v-else>
              <img
                class="h-16 w-16 rounded-md"
                src="https://atmakoreanbbq.s3-ap-southeast-1.amazonaws.com/public/no_image.png"
              >
            </div>
          </div>
          <div class="w-4/5">
            <div class="text-sm text-gray-500">
              <div class="font-medium">
                {{ item.name }}
              </div>
              <div class="text-sm text-gray-400">
                {{ item.description }}
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #menu_type="{ item }">
        <div class="text-sm text-gray-500">
          <div v-if="item.menu_type === 'main'" class="flex">
            Utama
          </div>
          <div v-else-if="item.menu_type === 'side_dish'" class="flex">
            Side Dish
          </div>
          <div v-else-if="item.menu_type === 'drink'" class="flex">
            Minuman
          </div>
        </div>
      </template>
      <template #is_available="{ item }">
        <div class="text-sm text-gray-500 font-medium">
          <div v-if="item.is_available === 1" class="flex gap-2 text-green-500">
            <div class="h-2 w-2 bg-green-500 rounded-full my-auto" />
            Ada
          </div>
          <div v-else class="flex gap-2 text-gray-500">
            <div class="h-2 w-2 bg-gray-500 rounded-full my-auto" />
            Kosong
          </div>
        </div>
      </template>
      <template #price="{ item }">
        <div class="text-sm text-gray-500">
          <span v-if="item.price > 0">
            {{ formatPrice(item.price) }}
          </span>
          <span v-else>
            Gratis
          </span>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script>
import { category, perPageView } from '@/const'
import queryString from 'query-string'

export default {
  middleware: 'menu/read',
  data () {
    return {
      searchFocus: false,
      isTyping: false,
      search: '',
      loading: true,
      loadingAPI: true,
      menus: [],
      categoryFilter: category,
      perPageViewFilter: perPageView,
      filter: {
        sort: 'name'
      },
      filters: [
        {
          name: 'menu_type',
          label: 'Kategori',
          rules: [
            {
              name: 'Main Course',
              value: 'main'
            },
            {
              name: 'Side Dish',
              value: 'side_dish'
            },
            {
              name: 'Drink',
              value: 'drink'
            }
          ]
        },
        {
          name: 'is_available',
          label: 'Ketersediaan',
          rules: [
            {
              name: 'Tersedia',
              value: 1
            },
            {
              name: 'Tidak Tersedia',
              value: 0
            }
          ]
        }
      ],
      headers: [
        {
          name: 'Nama',
          value: 'name',
          width: '1/2'
        },
        {
          name: 'Satuan',
          value: 'unit',
          width: '1/12'
        },
        {
          name: 'Kategori',
          value: 'menu_type',
          width: '1/12'
        },
        {
          name: 'Tersedia',
          value: 'is_available',
          width: '1/12'
        },
        {
          name: 'Harga',
          value: 'price',
          width: '1/12'
        }
      ]
    }
  },
  async fetch () {
    await this.getAPI().then(() => {
      this.loading = false
    })
  },
  head () {
    return {
      title: 'Menu | Atma Korean BBQ  '
    }
  },
  watch: {
    filter: {
      deep: true,
      handler () {
        if (!this.loadingAPI) {
          this.getAPI()
        }
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
    async getAPI () {
      this.loadingAPI = true
      const query = queryString.stringify({ v: JSON.stringify(this.filter) })
      await this.$axios.$get(`menu?${query}`).then((res) => {
        this.loadingAPI = false
        this.menus = res.data
      })
    },
    showDetail (data) {
      this.$router.push('/dashboard/menu/' + data.id)
    }
  }
}
</script>

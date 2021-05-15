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
    {{ filter }}
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
            <div class="flex items-center gap-2">
              <div class="flex gap-2 items-center">
                <div class="h-2 w-2 bg-gray-500 rounded-full my-auto" />
                <div>
                  Kosong
                </div>
              </div>
              <div v-if="!item.ingredient" class="relative has-tooltip my-auto text-red-500 cursor-pointer">
                <span class="absolute left-0 tooltip text-xs text-gray-500 bg-white rounded border border-gray-200 shadow-lg ml-7 px-2 p-1 -mt-3.5">
                  <span class="font-bold">Menu tidak memiliki bahan</span>
                  <br>
                  Harap mengisi data bahan untuk menu ini.
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
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
      <template #actions="{ item }">
        <div class="text-sm text-gray-500 flex gap-2">
          <div class="hover:opacity-70 cursor-pointer text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
              <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
            </svg>
          </div>
          <div
            class="hover:opacity-70 cursor-pointer text-gray-400"
            @click="setModal(item)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </template>
    </DataTable>
    <Modal v-model="modal.state" class="z-50" @click="deleteAPI">
      <template #title>
        Hapus Menu
      </template>
      <template #body>
        Apakah anda yakin akan menghapus menu <span class="font-bold">{{ modal.data.name }}</span>?
      </template>
    </Modal>
  </div>
</template>

<script>
import { category, perPageView } from '@/const'
import queryString from 'query-string'

export default {
  middleware: 'menu/read',
  data () {
    return {
      modal: {
        state: false,
        data: []
      },
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
        },
        {
          name: 'Actions',
          value: 'actions',
          width: '1/12',
          sort: false
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
    setModal (item) {
      this.modal.state = true
      this.modal.data = item
    },
    formatPrice (data) {
      return data.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })
    },
    async deleteAPI () {
      await this.$axios.$delete(`menu/${this.modal.data.id}`).then(() => {
        this.$toast.show({
          type: 'success',
          title: 'Berhasil',
          message: 'Data menu ' + this.modal.data.name + ' berhasil dihapus.',
          timeout: 3
        })
        this.modal.data = []
        this.getAPI()
      }).catch((e) => {
        this.$toast.show({
          type: 'danger',
          title: 'Error',
          message: e.response.data.message || e.response.data || e.message || e,
          timeout: 3
        })
      })
    },
    async getAPI () {
      this.loadingAPI = true
      const query = queryString.stringify({ v: JSON.stringify(this.filter) })
      await this.$axios.$get(`menu?${query}`).then((res) => {
        this.menus = res.data
      }).catch((e) => {
        this.$toast.show({
          type: 'danger',
          title: 'Error',
          message: e.response.data.message || e.response.data || e.message || e,
          timeout: 3
        })
      }).finally(() => {
        this.loadingAPI = false
      })
    },
    showDetail (data) {
      this.$router.push('/dashboard/menu/' + data.id)
    }
  }
}
</script>

<style scoped>
.tooltip {
  @apply invisible absolute
}

.has-tooltip:hover .tooltip {
  @apply visible z-50
}
</style>

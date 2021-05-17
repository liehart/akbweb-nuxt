<template>
  <div>
    <div class="mb-5 flex justify-between items-center">
      <h1 class="text-4xl font-medium tracking-normal">
        Stok Keluar
      </h1>
      <NuxtLink
        v-if="$auth.hasScope('stock.create')"
        to="/dashboard/reservasi/create"
        class="h-full inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm
            text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none
            focus:ring-2 focus:ring-offset-2 focus:ring-red-500 whitespace-nowrap justify-between flex"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
        </svg>
        <span class="pl-2">
          Catatan
        </span>
      </NuxtLink>
    </div>
    <DataTable
      v-model="filter"
      :loading="loading"
      :loading-a-p-i="loadingAPI"
      :data="histories"
      :headers="headers"
      :filters="filters"
    >
      <template #date="{ item }">
        <div>
          <div>
            {{ format_date(item.date, 'LL') }}
          </div>
          <div class="text-xs text-gray-400">
            {{ format_date(item.date, 'LT') }}
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
      <template #category="{ item }">
        <div class="text-sm text-gray-500 font-medium">
          <div v-if="item.category === 'waste'" class="flex gap-2 text-red-500">
            <div class="h-2 w-2 bg-red-500 rounded-full my-auto" />
            <div>
              Dibuang
            </div>
          </div>
          <div v-else class="flex gap-2 text-blue-500">
            <div class="h-2 w-2 bg-blue-500 rounded-full my-auto" />
            <div>
              Terjual
            </div>
          </div>
        </div>
      </template>
      <template #quantity="{ item }">
        {{ item.quantity.toLocaleString() }} {{ item.i_unit }}
        <span class="italic">
          (~{{ Math.floor((item.quantity/item.serving_size)).toLocaleString() }} {{ item.m_unit }})
        </span>
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
import moment from 'moment'

moment.locale('id')

export default {
  middleware: 'menu/read',
  data () {
    return {
      math: Math,
      modal: {
        state: false,
        data: []
      },
      searchFocus: false,
      isTyping: false,
      search: '',
      loading: true,
      loadingAPI: true,
      histories: [],
      categoryFilter: category,
      perPageViewFilter: perPageView,
      filter: {
        sort: 'date'
      },
      filters: [
        {
          name: 'menu_type',
          label: 'Kategori Menu',
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
          name: 'category',
          label: 'Kategori',
          rules: [
            {
              name: 'Dibuang',
              value: 'waste'
            },
            {
              name: 'Terjual',
              value: 'sold'
            }
          ]
        },
        {
          name: 'date',
          label: 'Range Tanggal',
          type: 'date.range',
          rules: []
        }
      ],
      headers: [
        {
          name: 'Tanggal Masuk',
          value: 'date',
          width: '1/12'
        },
        {
          name: 'Menu',
          value: 'name',
          width: '1/4'
        },
        {
          name: 'Kategori Menu',
          value: 'menu_type',
          width: '1/12'
        },
        {
          name: 'Kategori',
          value: 'category',
          width: '1/12'
        },
        {
          name: 'Jumlah Keluar',
          value: 'quantity',
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
      title: 'Stok Masuk | Atma Korean BBQ  '
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
    format_date (value, format) {
      if (value) {
        return moment(String(value)).format(format)
      }
    },
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
      await this.$axios.$delete(`history/outgoing/${this.modal.data.id}`).then(() => {
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
      const data = Object.assign({}, this.filter)
      const query = queryString.stringify({ v: JSON.stringify(data) })
      await this.$axios.$get(`history/outgoing?${query}`).then((res) => {
        this.histories = res.data
        console.log(this.histories)
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

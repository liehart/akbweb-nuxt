<template>
  <div>
    <div class="mb-5 flex justify-between items-center">
      <h1 class="text-4xl font-medium tracking-normal">
        Stok Keluar
      </h1>
      <Button v-if="$auth.hasScope('stock.create')" label="Catatan" variant="primary" :icon="true" @click="create">
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
          </svg>
        </template>
      </Button>
    </div>
    <DataTable
      v-model="filter"
      :loading="loading"
      :loading-a-p-i="loadingAPI"
      :data="histories"
      :headers="headers"
      :filters="filters"
    >
      <template #name="{ item }">
        <div>
          <div>
            {{ item.name }}
          </div>
          <div class="text-xs text-gray-400">
            Dicatat oleh {{ item.employee.name }}
          </div>
        </div>
      </template>
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
        <div v-if="item.serving_size" class="text-xs text-gray-400">
          {{ item.quantity % item.serving_size !== 0 ? 'Sekitar' : '' }} {{ Math.floor((item.quantity/item.serving_size)).toLocaleString() }} {{ item.m_unit }}
        </div>
      </template>
      <template #actions="{ item }">
        <div class="text-sm text-gray-500 flex gap-2">
          <div
            v-if="$auth.hasScope('stock.update')"
            class="hover:opacity-70 cursor-pointer text-gray-400"
            @click="edit(item)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
              <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
            </svg>
          </div>
          <div
            v-if="$auth.hasScope('stock.delete')"
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
    <Modal v-model="deleteModal.state" class="z-40" @click="deleteAPI">
      <template #title>
        Hapus Menu
      </template>
      <template #body>
        Apakah anda yakin akan menghapus menu <span class="font-bold">{{ deleteModal.data.name }}</span>?
      </template>
    </Modal>
    <Dialog v-model="modal.state" :persistent="true" :loading="modal.loading" class="z-40" @click="modalAction">
      <template #title>
        {{ modal.title }}
      </template>
      <template #body>
        <div class="flex flex-col gap-5">
          <div>
            <label class="block text-sm font-medium text-gray-700">Pilih Bahan</label>
            <t-rich-select
              v-model="form.ingredient_id"
              class="mt-1"
              :options="modal.status === 'edit' ? [form.ingredient] : null"
              :fetch-options="fetchOptions"
              placeholder="Pilih Bahan"
              :variant="submitted ? ($v.form.ingredient_id.$error ? 'danger' : 'success') : null"
              text-attribute="name"
              @blur="$v.form.ingredient_id.$touch()"
              @focus="$v.form.ingredient_id.$touch()"
            >
              <template
                slot="dropdownDown"
              >
                <div class="mx-4 text-xs my-3">
                  Terdapat {{ selectCount }} pilihan bahan. Hanya menampilkan 5 bahan terbaru, gunakan search untuk menemukan bahan yang lain.
                </div>
              </template>
            </t-rich-select>
            <span v-if="!submitted" class="text-xs text-gray-500">
              Hanya menampilkan 5 bahan terbaru, gunakan search untuk menemukan bahan yang lain.
            </span>
            <span v-if="submitted && !$v.form.ingredient_id.required" class="mt-1 text-xs text-red-500">
              Bahan harus dipilih
            </span>
          </div>
          <Input
            v-model="form.quantity"
            label="Jumlah Bahan Keluar"
            :variant="submitted ? ($v.form.quantity.$error ? 'error' : 'success') : 'primary'"
            type="number"
            :append="serving_size_unit"
            @blur="$v.form.quantity.$touch()"
            @focus="$v.form.quantity.$touch()"
          >
            <template #message>
              <span v-if="!submitted" class="text-xs text-gray-500">
                Jumlah bahan yang masuk dicatat berdasarkan satuan bahannya <span v-if="serving_size_unit">({{ serving_size_unit }})</span>
              </span>
              <span v-if="submitted && !$v.form.quantity.required" class="text-xs text-red-500">
                Jumlah bahan tidak boleh kosong
              </span>
              <span v-if="submitted && !$v.form.quantity.numeric" class="text-xs text-red-500">
                Jumlah bahan menu tidak valid
              </span>
              <span v-if="submitted && !$v.form.quantity.between" class="text-xs text-red-500">
                Jumlah bahan harus berada di range (0 - 2.147.483.647)
              </span>
            </template>
          </Input>
          <Input
            label="Kategori"
            type="text"
            value="Bahan Dibuang"
            readonly
          >
            <template #message>
              <span class="text-xs text-gray-500">
                Menu ini hanya dapat mencatat bahan yang dibuang. Pencatatan bahan keluar terjual dilakukan di menu order oleh chef.
              </span>
            </template>
          </Input>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script>
import { category, perPageView } from '@/const'
import queryString from 'query-string'
import moment from 'moment'
import { between, numeric, required } from 'vuelidate/lib/validators'

moment.locale('id')

export default {
  middleware: 'menu/read',
  validations: {
    form: {
      ingredient_id: {
        required
      },
      quantity: {
        required,
        numeric,
        between: between(0, 2147483647)
      }
    }
  },
  data () {
    return {
      form: {
        ingredient: null,
        ingredient_id: null,
        quantity: null,
        employee_id: this.$auth.user.user.id
      },
      defaultForm: {
        ingredient: null,
        ingredient_id: null,
        quantity: null,
        employee_id: this.$auth.user.user.id
      },
      selectCount: 0,
      serving_size_unit: null,
      submitted: false,
      math: Math,
      modal: {
        state: false,
        status: null,
        loading: false,
        title: ''
      },
      deleteModal: {
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
        sort: 'date',
        asc: false
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
    },
    'form.ingredient_id' () {
      this.fetchServingSize(this.form.ingredient_id)
    }
  },
  methods: {
    async fetchServingSize (id) {
      await this.$axios.$get(`ingredient/${id}`).then((res) => {
        this.serving_size_unit = res.data.unit
      })
    },
    modalAction () {
      this.$v.$touch()
      this.submitted = true
      if (!this.$v.$error) {
        if (this.modal.status === 'create') {
          this.createAction()
        } else {
          this.editAction()
        }
      }
    },
    fetchOptions (q) {
      const filter = {
        query: q,
        select: 'no',
        show: 5,
        sort: 'created_at',
        asc: false
      }
      if (this.modal.status === 'edit') {
        Object.assign(filter, { select_id: this.form.ingredient_id })
      }
      const query = queryString.stringify({ v: JSON.stringify(filter) })
      return this.$axios.$get(`ingredient?${query}`).then(res => ({ results: res.data.data }))
    },
    async getOptionsCount () {
      const filter = {
        select: 'no',
        show: 5,
        sort: 'created_at',
        asc: false
      }
      if (this.modal.status === 'edit') {
        Object.assign(filter, { select_id: this.form.ingredient_id })
      }
      const query = queryString.stringify({ v: JSON.stringify(filter) })
      await this.$axios.$get(`ingredient?${query}`).then((res) => {
        this.selectCount = res.data.total
      })
    },
    edit (data) {
      console.log(data)
      this.$v.$reset()
      this.submitted = false
      this.form = Object.assign({}, data)
      this.modal.state = true
      this.modal.loading = false
      this.modal.status = 'edit'
      this.modal.title = `Edit Catatan Stok Keluar ${this.form.name}`
      this.getOptionsCount()
    },
    editAction () {
      this.modal.loading = true
      this.$axios.put(`history/outgoing/${this.form.id}`, this.form).then(() => {
        this.modal.state = false
        this.getAPI()
        this.$toast.show({
          type: 'success',
          title: 'Berhasil',
          message: 'Data stok masuk ' + this.form.name + ' berhasil diedit.',
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
      }).finally(() => {
        this.modal.loading = false
      })
    },
    createAction () {
      this.modal.loading = true
      this.$axios.post('history/outgoing', this.form).then(() => {
        this.modal.state = false
        this.getAPI()
        this.$toast.show({
          type: 'success',
          title: 'Berhasil',
          message: 'Data stok masuk ' + this.form.name + ' berhasil dibuat.',
          timeout: 3
        })
      }).catch((err) => {
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
        } else {
          this.$toast.show({
            type: 'danger',
            title: 'Error',
            message: err.response.data.message || err.response.data || err.message || err,
            timeout: 3
          })
        }
      }).finally(() => {
        this.modal.loading = false
      })
    },
    create () {
      this.$v.$reset()
      this.submitted = false
      this.form = Object.assign({}, this.defaultForm)
      this.modal.state = true
      this.modal.loading = false
      this.modal.status = 'create'
      this.modal.title = 'Tambah Catatan Stok Keluar'
      this.getOptionsCount()
    },
    format_date (value, format) {
      if (value) {
        return moment(String(value)).format(format)
      }
    },
    setModal (item) {
      this.deleteModal.state = true
      this.deleteModal.data = item
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
      await this.$axios.$delete(`history/outgoing/${this.deleteModal.data.id}`).then(() => {
        this.$toast.show({
          type: 'success',
          title: 'Berhasil',
          message: 'Data menu ' + this.deleteModal.data.name + ' berhasil dihapus.',
          timeout: 3
        })
        this.deleteModal.data = []
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

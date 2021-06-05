<template>
  <div>
    <div class="mb-5 flex justify-between items-center">
      <div>
        <h1 class="text-4xl font-medium tracking-normal">
          Transaksi Pembayaran
        </h1>
        <p>Data pembayaran yang dilakukan pelanggan setelah selesai memesan.</p>
      </div>
    </div>
    <DataTable
      v-model="filter"
      :loading="loading"
      :loading-a-p-i="loadingAPI"
      :data="ingredients"
      :headers="headers"
    >
      <template #created_at="{ item }">
        <div>
          {{ $moment(item.created_at).format('LLLL') }}
        </div>
      </template>
      <template #transaction_sn="{ item }">
        <div class="font-bold">
          {{ item.transaction_sn }}
        </div>
      </template>
      <template #grand_total="{ item }">
        <div>
          {{ formatPrice(item.grand_total) }}
        </div>
      </template>
      <template #payment_method="{ item }">
        <div class="flex items-center gap-2" v-if="item.payment_method === 'cash'">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div>
            Cash
          </div>
        </div>
        <div v-else class="flex items-center gap-2">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd" />
            </svg>
          </div>
          <div>
            <span v-if="item.payment_method === 'debit'">
              Debit Card
            </span>
            <span v-else>
              Credit Card
            </span>
          </div>
        </div>
      </template>
      <template #actions="{ item }">
        <div class="flex flex-row gap-2 justify-end">
          <a :href="`//localhost/receipt/` + item.order.token" target="_blank">
            <Button
              v-if="$auth.hasScope('ingredient.create')"
              variant="secondary"
              label="Cetak"
              :icon="true"
            >
              <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clip-rule="evenodd" />
                </svg>
              </template>
            </Button>
          </a>
          <Button
            v-if="$auth.hasScope('ingredient.create')"
            variant="secondary"
            :icon="true"
            @click="$router.push(`pesanan/${item.order.token}`)"
          >
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
            </template>
          </Button>
        </div>
      </template>
    </DataTable>
    <Modal v-model="deleteModal.state" class="z-50" @click="deleteAPI">
      <template #title>
        Hapus Menu
      </template>
      <template #body>
        Apakah anda yakin akan menghapus menu <span class="font-bold">{{ deleteModal.data.name }}</span>?
      </template>
    </Modal>
    <Dialog v-model="modal.state" :persistent="true" :loading="modal.loading" class="z-50" @click="modalAction">
      <template #title>
        {{ modal.title }}
      </template>
      <template #body>
        <div class="flex flex-col gap-5">
          <Input
            v-model="form.name"
            label="Nama Bahan"
            :variant="submitted ? ($v.form.name.$error ? 'error' : 'success') : 'primary'"
            @blur="$v.form.name.$touch()"
            @focus="$v.form.name.$touch()"
          >
            <template #message>
              <span v-if="submitted && !$v.form.name.required" class="text-xs text-red-500">
                Harap mengisi nama bahan
              </span>
            </template>
          </Input>
          <Input
            v-model="form.unit"
            label="Satuan Bahan"
            :variant="submitted ? ($v.form.unit.$error ? 'error' : 'success') : 'primary'"
            @blur="$v.form.unit.$touch()"
            @focus="$v.form.unit.$touch()"
          >
            <template #message>
              <span v-if="submitted && !$v.form.unit.required" class="text-xs text-red-500">
                Harap mengisi satuan bahan
              </span>
              <span v-if="submitted && !$v.form.unit.alpha" class="text-xs text-red-500">
                Satuan hanya dapat terdiri dari satu kata dan hanya berisi huruf
              </span>
            </template>
          </Input>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script>
import { perPageView } from '@/const'
import queryString from 'query-string'
import { alpha, required } from 'vuelidate/lib/validators'

export default {
  middleware: 'ingredient/read',
  validations: {
    form: {
      name: {
        required
      },
      unit: {
        required,
        alpha
      }
    }
  },
  data () {
    return {
      form: {
        name: '',
        unit: ''
      },
      defaultForm: {
        name: '',
        unit: ''
      },
      submitted: false,
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
      loading: true,
      loadingAPI: true,
      ingredients: [],
      perPageViewFilter: perPageView,
      filter: {
        sort: 'id'
      },
      headers: [
        {
          name: 'Nomor Transaksi',
          value: 'transaction_sn',
          width: '1/12'
        },
        {
          name: 'Metode Pembayaran',
          value: 'payment_method',
          width: '1/12'
        },
        {
          name: 'Total Harga',
          value: 'grand_total',
          width: '1/12'
        },
        {
          name: 'Kasir',
          value: 'cashier.name',
          width: '1/12'
        },
        {
          name: 'Tanggal Transaksi',
          value: 'created_at',
          width: '1/12'
        },
        {
          name: '',
          value: 'actions',
          width: 'auto',
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
      title: 'Bahan | Atma Korean BBQ  '
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
    create () {
      this.$v.$reset()
      this.submitted = false
      this.form = Object.assign({}, this.defaultForm)
      this.modal.state = true
      this.modal.loading = false
      this.modal.status = 'create'
      this.modal.title = 'Buat Bahan Baru'
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
      await this.$axios.$delete(`transaction/${this.deleteModal.data.id}`).then(() => {
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
      const query = queryString.stringify({ v: JSON.stringify(this.filter) })
      await this.$axios.$get(`transaction?${query}`).then((res) => {
        this.ingredients = res.data
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
    edit (data) {
      this.$v.$reset()
      this.submitted = false
      this.form = Object.assign({}, data)
      this.modal.state = true
      this.modal.loading = false
      this.modal.status = 'edit'
      this.modal.title = `Edit Bahan ${this.form.name}`
    },
    createAction () {
      this.modal.loading = true
      this.$axios.post('transaction', this.form).then(() => {
        this.modal.state = false
        this.getAPI()
        this.$toast.show({
          type: 'success',
          title: 'Berhasil Menambahkan Bahan',
          message: 'Bahan ' + this.form.name + ' berhasil ditambahkan.',
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
    editAction () {
      this.modal.loading = true
      this.$axios.put(`transaction/${this.form.id}`, this.form).then(() => {
        this.modal.state = false
        this.getAPI()
        this.$toast.show({
          type: 'success',
          title: 'Berhasil Mengedit Bahan',
          message: 'Bahan ' + this.form.name + ' berhasil diedit.',
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
    }
  }
}
</script>

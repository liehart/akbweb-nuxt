<template>
  <div>
    <div class="mb-5 flex justify-between items-center">
      <h1 class="text-4xl font-medium tracking-normal">
        Bahan
      </h1>
      <Button label="Bahan" variant="primary" :icon="true" @click="create">
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
      :data="ingredients"
      :headers="headers"
    >
      <template #remaining_stock="{ item }">
        <div class="flex gap-1">
          <div v-if="item.remaining_stock > 0">
            {{ item.remaining_stock.toLocaleString() }} {{ item.unit }}
          </div>
          <div v-else>
            Kosong
          </div>
        </div>
      </template>
      <template #actions="{ item }">
        <div class="text-sm text-gray-500 flex gap-2">
          <div
            class="hover:opacity-70 cursor-pointer text-gray-400"
            @click="edit(item)"
          >
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
  middleware: 'menu/read',
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
        sort: 'name'
      },
      headers: [
        {
          name: 'Nama Bahan',
          value: 'name',
          width: '1/2'
        },
        {
          name: 'Satuan Bahan',
          value: 'unit',
          width: '1/12'
        },
        {
          name: 'Jumlah Stok Bahan',
          value: 'remaining_stock',
          width: '1/12'
        },
        {
          name: 'Aksi',
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
      await this.$axios.$delete(`ingredient/${this.deleteModal.data.id}`).then(() => {
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
      await this.$axios.$get(`ingredient?${query}`).then((res) => {
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
      this.$axios.post('ingredient', this.form).then(() => {
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
      this.$axios.put(`ingredient/${this.form.id}`, this.form).then(() => {
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

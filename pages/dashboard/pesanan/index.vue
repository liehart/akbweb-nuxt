<template>
  <div>
    <div class="mb-5 flex justify-between items-center">
      <div>
        <h1 class="text-4xl font-medium tracking-normal">
          Pesanan
        </h1>
        <p>
          Menu ini mengelola data pesanan yang dilakukan pelanggan di restoran
        </p>
      </div>
      <Button
        v-if="$auth.hasScope('ingredient.create')"
        label="Terima Reservasi"
        variant="primary"
        :icon="true"
        @click="create"
      >
        <template #icon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
              clip-rule="evenodd"
            />
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
      :filters="filters"
    >
      <template #order_date="{ item }">
        {{ $moment(item.order_date).format('MMMM Do YYYY, HH:mm') }}
      </template>
      <template #is_paid="{ item }">
        <div v-if="item.is_paid === 1">
          <span class="rounded-md py-1 px-3 text-xs text-green-700 font-medium bg-green-100">
            Lunas
          </span>
        </div>
        <div v-else>
          <span class="rounded-md py-1 px-3 text-xs text-red-700 font-medium bg-red-100">
            Belum Bayar
          </span>
        </div>
      </template>
      <template #session="{ item }">
        <div class="mt-2">
          <div v-if="item.session === 'lunch'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-yellow-100 text-yellow-800">
            <div class="my-auto mr-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div>
              Lunch
            </div>
          </div>
          <div v-else-if="item.session === 'dinner'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-blue-100 text-blue-800">
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
      </template>
      <template #actions="{ item }">
        <div class="text-sm text-gray-500 flex gap-2 items-center justify-end">
          <Button
            v-if="!item.finish_at"
            label="Cetak QR"
            variant="secondary"
            :icon="true"
            @click="showQR(item.token)"
          >
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clip-rule="evenodd" />
              </svg>
            </template>
          </Button>
          <Button
            v-if="$auth.hasScope('ingredient.create')"
            variant="secondary"
            :icon="true"
            @click="$router.push(`pesanan/${item.token}`)"
          >
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
            </template>
          </Button>
          <Button
            v-if="item.total_item <= 0"
            variant="secondary"
            :icon="true"
            @click="setModal(item.id)"
          >
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </template>
          </Button>
          <Button
            v-if="!item.transaction && item.finish_at"
            variant="secondary"
            label="Bayar"
            @click="setModal(item.id)"
          >
          </Button>
        </div>
      </template>
    </DataTable>
    <Modal v-model="deleteModal.state" class="z-50" @click="deleteAPI">
      <template #title>
        Hapus Pesanan
      </template>
      <template #body>
        Apakah anda yakin akan menghapus pesanan
        <span class="font-bold">{{ deleteModal.data.name }}</span>?
      </template>
    </Modal>
    <Dialog
      v-model="modal.state"
      :persistent="true"
      :loading="modal.loading"
      class="z-50"
      :custom-icon="true"
      @click="modalAction"
    >
      <template #title>
        {{ modal.title }}
      </template>
      <template #body>
        <div class="flex flex-col gap-5">
          <Input
            :value="$moment(form.date).format('LL')"
            label="Tanggal Reservasi"
            type="text"
            readonly
          >
            <template #message>
              <span class="text-xs text-gray-500">
                Reservasi yang bisa dipilih adalah reservasi yang terdaftar untuk hari ini.
              </span>
            </template>
          </Input>
          <div>
            <label
              class="block text-sm font-medium text-gray-700"
            >Pilih Sesi Reservasi</label>
            <div class="mt-1 flex-col">
              <div class="grid grid-cols-2 gap-4">
                <div
                  class="transition duration-200 select-none flex justify-between p-5 rounded-md cursor-pointer border"
                  :class="[
                    form.session === 'lunch'
                      ? 'border-blue-500 bg-blue-50 hover:bg-blue-100 border-blue-500'
                      : 'hover:bg-gray-50 border-gray-300',
                  ]"
                  @click="form.session = 'lunch'"
                >
                  <div class="flex gap-2 text-sm">
                    <div class="my-auto mr-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>Lunch</div>
                  </div>
                  <div class="col-span-1 text-sm h-5 w-5 my-auto">
                    <div
                      v-if="form.session === 'lunch'"
                      class="h-5 w-5 text-blue-500 my-auto"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div
                  class="transition duration-200 select-none flex justify-between p-5 rounded-md cursor-pointer border"
                  :class="[
                    form.session === 'dinner'
                      ? 'border-blue-500 bg-blue-50 hover:bg-blue-100 border-blue-500'
                      : 'hover:bg-gray-50 border-gray-300',
                  ]"
                  @click="form.session = 'dinner'"
                >
                  <div class="flex gap-2 text-sm">
                    <div class="my-auto mr-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-3 w-3"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
                        />
                      </svg>
                    </div>
                    <div>Dinner</div>
                  </div>
                  <div class="col-span-1 text-sm h-5 w-5 my-auto">
                    <div
                      v-if="form.session === 'dinner'"
                      class="h-5 w-5 text-blue-500 my-auto"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <Input
              v-model="modal.search"
              label="Pilih Reservasi"
              placeholder="Cari Nama Pelanggan"
              type="text"
              prepend=" "
            >
              <template #prepend>
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="text-gray-500 sm:text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                    </svg>
                  </span>
                </div>
              </template>
            </Input>
            <div class="flex flex-col mt-2">
              <div v-if="options.length > 0">
                <div v-for="(d, v) in options" :key="v" class="w-full">
                  <div
                    class="transition duration-200 select-none flex justify-between px-5 py-3 cursor-pointer border relative"
                    :class="[
                      (form.reservation_id === d.id
                        ? 'border-blue-500 bg-blue-50 hover:bg-blue-100 border-blue-500 z-10'
                        : 'hover:bg-gray-50 border-gray-300'),
                      (
                        v === 0 ? 'rounded-t-md' : 'custom-overlap'
                      ),
                      (
                        v === options.length - 1 ? 'rounded-b-md' : ''
                      )
                    ]"
                    @click="form.reservation_id = d.id"
                  >
                    <div class="flex text-sm items-center gap-5">
                      <div class="text-center">
                        <div class="text-xs">
                          Meja
                        </div>
                        <div class="font-bold">
                          {{ d.table_number }}
                        </div>
                      </div>
                      <div class="flex flex-col">
                        <div class="turncate font-bold">
                          {{ d.customer.name }}
                        </div>
                        <div class="text-xs">
                          {{ d.customer.email || 'Tidak memiliki email' }}
                        </div>
                        <div class="text-xs">
                          {{ d.customer.phone || 'Tidak memiliki nomor telepon' }}
                        </div>
                      </div>
                    </div>
                    <div class="col-span-1 text-sm h-5 w-5 my-auto">
                      <div
                        v-if="form.reservation_id === d.id"
                        class="h-5 w-5 text-blue-500 my-auto"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else>
                <div
                  class="w-full transition duration-200 select-none flex justify-between px-5 py-8 text-center"
                >
                  <div class="flex flex-col text-sm w-full">
                    <div class="turncate">
                      Data Reservasi Kosong
                    </div>
                    <div class="text-xs">
                      <span v-if="modal.search.length > 0">
                        Sepertinya reservasi oleh pelanggan bernama '{{ modal.search }}' tidak ada.
                      </span>
                      <span v-else>
                        Reservasi pada sesi ini kosong.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <span v-if="submitted && !$v.form.reservation_id.required" class="text-xs text-red-500">
              Reservasi harus dipilih
            </span>
            <span v-else class="text-xs text-gray-500">
              Hanya menampilkan 3 reservasi aktif, untuk mencari data selanjutnya harap gunakan fitur search.
            </span>
          </div>
        </div>
      </template>
      <template #icon>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
      </template>
    </Dialog>
    <Dialog
      v-model="modalQR.state"
      class="z-50"
      close-label="Tutup"
      action-label="Cetak"
      :custom-icon="true"
      :hide-action="true"
    >
      <template #icon>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clip-rule="evenodd" />
        </svg>
      </template>
      <template #title>
        Cetak QR Code Pesanan
      </template>
      <template #body>
        <div class="flex flex-col items-center">
          <div id="printMe" class="flex flex-col gap-5 items-center justify-center">
            <vue-qr margin="0" :text="modalQR.token" size="200" />
            <div class="text-center">
              Printed <span class="font-bold">{{ $moment().format('MMMM Do YYYY, h:mm:ss a  ') }}</span> <br>
              by {{ $auth.user.user.name }}
            </div>
          </div>
          <div class="mt-5">
            <Button
              v-print="'#printMe'"
              label="Cetak"
              variant="primary"
              :icon="true"
            >
              <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clip-rule="evenodd" />
                </svg>
              </template>
            </Button>
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script>
import { perPageView } from '@/const'
import queryString from 'query-string'
import { required } from 'vuelidate/lib/validators'
import * as moment from 'moment'
import _ from 'lodash'
import VueQr from 'vue-qr'
import print from 'vue-print-nb'

export default {
  components: {
    VueQr
  },
  directives: {
    print
  },
  middleware: 'ingredient/read',
  validations: {
    form: {
      reservation_id: {
        required
      }
    }
  },
  data () {
    return {
      form: {
        reservation_id: null,
        session: 'lunch',
        date: moment().format().slice(0, 10),
        waiter_id: this.$auth.user.user.id
      },
      defaultForm: {
        reservation_id: null,
        session: 'lunch',
        date: moment().format().slice(0, 10),
        waiter_id: this.$auth.user.user.id
      },
      options: [],
      submitted: false,
      modalQR: {
        state: false,
        token: ''
      },
      modal: {
        state: false,
        status: null,
        loading: false,
        title: '',
        search: ''
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
        sort: 'order_date',
        filter: [
          {
            name: 'is_paid',
            value: [0]
          },
          {
            name: 'date',
            value: [moment().format('YYYY-MM-DD')]
          }
        ]
      },
      filters: [
        {
          name: 'date',
          label: 'Range Tanggal',
          type: 'date.range',
          def: [moment().format('YYYY-MM-DD')],
          rules: []
        },
        {
          name: 'is_paid',
          label: 'Status',
          def: [0],
          rules: [
            {
              name: 'Lunas',
              value: 1
            },
            {
              name: 'Belum Bayar',
              value: 0
            }
          ]
        }
      ],
      headers: [
        {
          name: 'Sesi',
          value: 'session',
          width: '1/12'
        },
        {
          name: 'Nomor Meja',
          value: 'table_number',
          width: '1/12'
        },
        {
          name: 'Nama Pelanggan',
          value: 'name',
          width: '1/12'
        },
        {
          name: 'Waktu Masuk',
          value: 'order_date',
          width: '1/12'
        },
        {
          name: 'Waktu Selesai',
          value: 'finish_at',
          width: '1/12'
        },
        {
          name: 'Waiter',
          value: 'w_name',
          width: '1/12'
        },
        {
          name: 'Total Menu',
          value: 'total_menu',
          width: '1/12'
        },
        {
          name: 'Total Item',
          value: 'total_item',
          width: '1/12'
        },
        {
          name: 'Status',
          value: 'is_paid',
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
    },
    'form.session' () {
      this.form.reservation_id = null
      this.fetchOptions()
    },
    'modal.search': _.debounce(function () {
      this.fetchOptions(this.modal.search)
    }, 500)
  },
  methods: {
    async create () {
      this.$v.$reset()
      await this.fetchOptions()
      this.submitted = false
      this.form = Object.assign({}, this.defaultForm)
      this.modal.state = true
      this.modal.loading = false
      this.modal.status = 'create'
      this.modal.title = 'Terima Reservasi Pelanggan'
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
      await this.$axios
        .$delete(`order/${this.deleteModal.data}`)
        .then(() => {
          this.$toast.show({
            type: 'success',
            title: 'Berhasil',
            message:
              'Data pesanan berhasil dihapus.',
            timeout: 3
          })
          this.deleteModal.data = []
          this.getAPI()
        })
        .catch((e) => {
          this.$toast.show({
            type: 'danger',
            title: 'Error',
            message:
              e.response.data.message || e.response.data || e.message || e,
            timeout: 3
          })
        })
    },
    showQR (token) {
      this.modalQR.token = token
      this.modalQR.state = true
    },
    async getAPI () {
      this.loadingAPI = true
      const query = queryString.stringify({ v: JSON.stringify(this.filter) })
      await this.$axios
        .$get(`order?${query}`)
        .then((res) => {
          this.ingredients = res.data
        })
        .catch((e) => {
          this.$toast.show({
            type: 'danger',
            title: 'Error',
            message:
              e.response.data.message || e.response.data || e.message || e,
            timeout: 3
          })
        })
        .finally(() => {
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
      this.$axios
        .post('order', this.form)
        .then(() => {
          this.modal.state = false
          this.getAPI()
          this.$toast.show({
            type: 'success',
            title: 'Berhasil Menambah Pesanan',
            message: 'Berhasil Menambah Pesanan',
            timeout: 3
          })
        })
        .catch((err) => {
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
        .finally(() => {
          this.modal.loading = false
        })
    },
    editAction () {
      this.modal.loading = true
      this.$axios
        .put(`order/${this.form.id}`, this.form)
        .then(() => {
          this.modal.state = false
          this.getAPI()
          this.$toast.show({
            type: 'success',
            title: 'Berhasil Mengedit Bahan',
            message: 'Bahan ' + this.form.name + ' berhasil diedit.',
            timeout: 3
          })
        })
        .catch((err) => {
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
        .finally(() => {
          this.modal.loading = false
        })
    },
    async fetchOptions (q) {
      const filter = {
        query: q,
        session: this.form.session
      }
      const query = queryString.stringify({ v: JSON.stringify(filter) })
      await this.$axios.$get(`select/reservation?${query}`).then((res) => {
        this.options = res.data
      })
    }
  }
}
</script>

<style scoped>
.custom-overlap {
  margin-top: -1px;
}
</style>

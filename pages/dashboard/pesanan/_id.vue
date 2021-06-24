<template>
  <div class="max-w-screen-lg m-auto">
    <div class="mb-5">
      <div class="flex justify-between">
        <div class="flex-col my-auto">
          <h1 class="text-4xl font-medium tracking-normal">
            Detail Pesanan
          </h1>
        </div>
        <div class="flex gap-5">
          <Button
            v-if="$auth.hasScope('ingredient.create')"
            label="Kembali"
            variant="secondary"
            :icon="true"
            @click="$router.push('/dashboard/pesanan')"
          >
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </template>
          </Button>
        </div>
      </div>
    </div>
    <div class="flex gap-5">
      <div class="w-2/3 bg-white rounded-md p-5 h-full">
        <div v-if="customer.data.details.length > 0">
          <div class="font-bold mb-3">
            Detail Item Pesanan
          </div>
          <div v-for="(value, key) in customer.data.details" :key="key" class="mb-5">
            <div class="font-medium mb-3">
              Pesanan #{{ key + 1 }}
            </div>
            <div class="flex gap-5 ">
              <div class="w-24 flex-shrink-0">
                <img class="rounded-md w-24 flex-shrink-0 h-24 object-cover" :src="value.menu.image_path" crossorigin="anonymous">
              </div>
              <div class="flex flex-row justify-between w-full gap-5">
                <div class="flex flex-col">
                  <div class="font-bold">
                    {{ value.menu.name }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ value.menu.description }}
                  </div>
                  <div class="text-sm">
                    {{ formatPrice(value.menu.price * value.quantity) }}
                  </div>
                  <div class="text-sm">
                    Jumlah Pesanan: {{ value.quantity }} {{ value.menu.unit[0].toUpperCase() + value.menu.unit.slice(1) }}
                  </div>
                </div>
                <div class="flex flex-col gap-3 h-24">
                  <Button
                    v-if="$auth.hasScope('ingredient.create')"
                    label="Ready"
                    variant="secondary"
                    :icon="true"
                    :disabled="value.ready_to_serve_at != null"
                    @click="ready(value.id)"
                  >
                    <template #icon>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                      </svg>
                    </template>
                  </Button>
                  <Button
                    v-if="$auth.hasScope('ingredient.create')"
                    label="Served"
                    variant="secondary"
                    :icon="true"
                    :disabled="value.served_at != null || value.ready_to_serve_at == null"
                    @click="serve(value.id)"
                  >
                    <template #icon>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </template>
                  </Button>
                </div>
              </div>
            </div>
            <div class="font-medium my-3">
              Status Pesanan
            </div>
            <div class="flex justify-between gap-5">
              <div
                class="rounded-md w-1/3 p-2 text-sm text-white"
                :class="[ value.created_at != null ? 'bg-blue-500' : 'bg-gray-100' ]"
              >
                <p>Sedang disiapkan</p>
                <p v-if="value.created_at != null" class="text-xs opacity-75">
                  {{ $moment(value.created_at).format('LLL') }}
                </p>
              </div>
              <div
                class="rounded-md w-1/3 p-2 text-sm text-white"
                :class="[ value.ready_to_serve_at != null ? 'bg-blue-500' : 'bg-gray-100' ]"
              >
                <p>Siap disajikan</p>
                <p v-if="value.ready_to_serve_at != null" class="text-xs opacity-75">
                  {{ $moment(value.ready_to_serve_at).format('LLL') }}
                </p>
              </div>
              <div
                class="rounded-md w-1/3 p-2 text-sm text-white"
                :class="[ value.served_at != null ? 'bg-blue-500' : 'bg-gray-100' ]"
              >
                <p>Telah disajikan</p>
                <p v-if="value.served_at != null" class="text-xs opacity-75">
                  {{ $moment(value.served_at).format('LLL') }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-1/3 h-full">
        <div class="flex flex-col gap-5">
          <div class="bg-white p-5 rounded-md">
            <div class="font-bold mb-3">
              Informasi Reservasi
            </div>
            <div class="flex flex-col gap-2">
              <div class="flex flex-col">
                <div class="text-xs text-gray-500">
                  Nama Pelanggan
                </div>
                <div>
                  {{ customer.data.reservation.customer.name }}
                </div>
              </div>
              <div class="flex flex-col">
                <div class="text-xs text-gray-500">
                  Email Pelanggan
                </div>
                <div v-if="customer.data.reservation.customer.email">
                  {{ customer.data.reservation.customer.email }}
                </div>
                <div v-else>
                  -
                </div>
              </div>
              <div class="flex flex-col">
                <div class="text-xs text-gray-500">
                  Nomor Telepon
                </div>
                <div v-if="customer.data.reservation.customer.phone">
                  {{ customer.data.reservation.customer.phone }}
                </div>
                <div v-else>
                  -
                </div>
              </div>
              <div class="flex flex-col">
                <div class="text-xs text-gray-500">
                  Nomor Meja
                </div>
                <div>
                  Meja {{ customer.data.reservation.table_number }}
                </div>
              </div>
              <div class="flex flex-col">
                <div class="text-xs text-gray-500">
                  Sesi Reservasi
                </div>
                <div class="mt-2">
                  <div v-if="customer.data.reservation.session === 'lunch'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-yellow-100 text-yellow-800">
                    <div class="my-auto mr-1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      Lunch
                    </div>
                  </div>
                  <div v-else-if="customer.data.reservation.session === 'dinner'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-blue-100 text-blue-800">
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
              </div>
            </div>
          </div>
          <div class="bg-white p-5 rounded-md">
            <div class="font-bold mb-3">
              Ringkasan Pembayaran
            </div>
            <div class="flex flex-col gap-2">
              <div class="flex justify-between">
                <div class="">
                  Total
                </div>
                <div>
                  {{ formatPrice(customer.data.price.price) }}
                </div>
              </div>
              <div class="flex justify-between">
                <div class="">
                  Service Fee (.5%)
                </div>
                <div>
                  {{ formatPrice(customer.data.price.service) }}
                </div>
              </div>
              <div class="flex justify-between">
                <div class="">
                  Tax (10%)
                </div>
                <div>
                  {{ formatPrice(customer.data.price.tax) }}
                </div>
              </div>
              <hr>
              <div class="flex justify-between font-medium">
                <div>
                  Total
                </div>
                <div>
                  {{ formatPrice(customer.data.price.total) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Modal v-model="deleteModal" class="z-50" @click="deleteCustomerAPI(customer.data)">
      <template #title>
        Hapus Pelanggan
      </template>
      <template #body>
        Apakah anda yakin akan menghapus data pelanggan <span class="font-bold">{{ customer.data.name }}</span>?
      </template>
    </Modal>
  </div>
</template>

<script>
export default {
  middleware: 'customer/read',
  async asyncData ({ params, $axios, error }) {
    try {
      const customer = await $axios.$get('order/' + params.id)
      return { customer }
    } catch (err) {
      if (err.response.status === 404) {
        error({ statusCode: 404, message: err.message })
      }
    }
  },
  data () {
    return {
      deleteModal: false
    }
  },
  head () {
    return {
      title: this.customer.data.name
    }
  },
  methods: {
    showModal (val) {
      if (!val) {
        this.deactivateModal = true
      } else {
        this.activateModal = true
      }
    },
    formatPrice (data) {
      return data.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })
    },
    async deleteCustomerAPI (data) {
      await this.$axios.$delete('order/' + data.id).then(() => {
        this.$toast.show({
          type: 'success',
          title: 'Berhasil',
          message: 'Data pelanggan ' + data.name + ' berhasil dihapus.',
          timeout: 3
        })
        this.$router.push('/dashboard/pelanggan')
      }).catch((err) => {
        if (err.response) {
          if (err.response.data.message) {
            this.$toast.show({
              type: 'danger',
              title: 'Error',
              message: err.response.data.message,
              timeout: 3
            })
          }
        }
      })
    },
    async ready (data) {
      await this.$axios.$post('order_detail/' + data + '/ready').then(() => {
        this.$toast.show({
          type: 'success',
          title: 'Berhasil',
          message: 'Pesanan diupdate',
          timeout: 3
        })
        this.$nuxt.refresh()
      }).catch((err) => {
        if (err.response) {
          if (err.response.data.message) {
            this.$toast.show({
              type: 'danger',
              title: 'Error',
              message: err.response.data.message,
              timeout: 3
            })
          }
        }
      })
    },
    async serve (data) {
      await this.$axios.$post('order_detail/' + data + '/serve').then(() => {
        this.$toast.show({
          type: 'success',
          title: 'Berhasil',
          message: 'Pesanan diupdate',
          timeout: 3
        })
        this.$nuxt.refresh()
      }).catch((err) => {
        if (err.response) {
          if (err.response.data.message) {
            this.$toast.show({
              type: 'danger',
              title: 'Error',
              message: err.response.data.message,
              timeout: 3
            })
          }
        }
      })
    }
  }
}
</script>

<style scoped>

</style>

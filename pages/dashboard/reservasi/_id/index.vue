<template>
  <div>
    <div class="mb-5">
      <div class="flex justify-between">
        <div class="flex-col my-auto">
          <h1 class="text-4xl font-bold">
            Reservasi {{ reservation.data.customer.name }}
          </h1>
          <p>{{ moment(reservation.data.date).format('DD MMMM YYYY') }} - Meja No {{ reservation.data.table_number }}</p>
        </div>
        <div class="flex my-auto">
          <button
            v-if="$auth.hasScope('reservation.update')"
            class="text-gray-500 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm
            font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2
            focus:ring-offset-2 focus:ring-gray-500"
            @click="edit(reservation.data.id)"
          >
            Edit
          </button>
          <button
            v-if="$auth.hasScope('reservation.delete')"
            type="submit"
            class="ml-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm
            text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none
            focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            @click="deleteModal = true"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="border-t border-gray-200">
        <dl>
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Tanggal Reservasi
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ moment(reservation.data.date).format('DD MMMM YYYY') }}
            </dd>
          </div>
          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Nama Customer
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ reservation.data.customer.name }}
            </dd>
          </div>
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Nomor Meja
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ reservation.data.table_number }}
            </dd>
          </div>
          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Sesi Reservasi
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <span v-if="reservation.data.session === 'lunch'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                Makan Siang
              </span>
              <span v-else-if="reservation.data.session === 'dinner'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                Makan Malam
              </span>
              <span v-else class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                Tanpa Reservasi
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </div>
    <Modal v-model="deleteModal" class="z-50" @click="deleteReservationAPI(reservation.data)">
      <template #title>
        Hapus Reservasi
      </template>
      <template #body>
        Apakah anda yakin akan menghapus data reservasi <span class="font-bold">{{ reservation.data.customer.name }}</span>
        pada <span class="font-bold">{{ moment(reservation.data.date).format('DD MMMM YYYY') }}</span>?
      </template>
    </Modal>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  middleware: 'reservation/read',
  async asyncData ({ params, $axios, error }) {
    try {
      const reservation = await $axios.$get('reservation/' + params.id)
      return { reservation }
    } catch (err) {
      if (err.response.status === 404) {
        error({ statusCode: 404, message: err.message })
      }
    }
  },
  data () {
    return {
      deleteModal: false,
      moment
    }
  },
  head () {
    return {
      title: this.reservation.data.name
    }
  },
  methods: {
    edit (id) {
      this.$router.push('/dashboard/reservasi/' + id + '/edit')
    },
    showModal (val) {
      if (!val) {
        this.deactivateModal = true
      } else {
        this.activateModal = true
      }
    },
    async deleteReservationAPI (data) {
      await this.$axios.$delete('reservation/' + data.id)
      await this.$router.push('/dashboard/reservasi')
      this.$toast.show({
        type: 'success',
        title: 'Berhasil',
        message: 'Data reservasi ' + data.name + ' berhasil dihapus.',
        timeout: 3
      })
    }
  }
}
</script>

<style scoped>

</style>

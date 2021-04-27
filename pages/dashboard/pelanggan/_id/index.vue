<template>
  <div>
    <div class="mb-5">
      <div class="flex justify-between">
        <div class="flex-col my-auto">
          <h1 class="text-4xl font-bold">
            {{ customer.data.name }}
          </h1>
          <p>Detail Pelanggan</p>
        </div>
        <div class="flex my-auto">
          <button
            v-if="$auth.hasScope('customer.update')"
            class="text-gray-500 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm
            font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2
            focus:ring-offset-2 focus:ring-gray-500"
            @click="edit(customer.data.id)"
          >
            Edit
          </button>
          <button
            v-if="$auth.hasScope('customer.delete')"
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
              Nama
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ customer.data.name }}
            </dd>
          </div>
          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Email
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <span v-if="customer.data.email">
                {{ customer.data.email }}
              </span>
              <span v-else>
                -
              </span>
            </dd>
          </div>
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Nomor Telepon
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <span v-if="customer.data.phone">
                {{ customer.data.phone }}
              </span>
              <span v-else>
                -
              </span>
            </dd>
          </div>
        </dl>
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
      const customer = await $axios.$get('customer/' + params.id)
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
    edit (id) {
      this.$router.push('/dashboard/pelanggan/' + id + '/edit')
    },
    showModal (val) {
      if (!val) {
        this.deactivateModal = true
      } else {
        this.activateModal = true
      }
    },
    async deleteCustomerAPI (data) {
      await this.$axios.$delete('customer/' + data.id).then(() => {
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
    }
  }
}
</script>

<style scoped>

</style>

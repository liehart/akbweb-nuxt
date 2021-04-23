<template>
  <div>
    <div class="mb-5">
      <div class="flex justify-between">
        <div class="flex-col my-auto">
          <h1 class="text-4xl font-bold">
            Meja {{ role.data.table_number }}
          </h1>
          <p>Detail data meja</p>
        </div>
        <div class="flex my-auto">
          <button
            class="text-gray-500 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm
            font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2
            focus:ring-offset-2 focus:ring-gray-500"
            @click="edit(role.data.table_number)"
          >
            Edit
          </button>
          <button
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
              Nomor Meja
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ role.data.table_number }}
            </dd>
          </div>
          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Status
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <span v-if="!role.data.is_empty" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                Kosong
              </span>
              <span v-else class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                Terisi
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </div>
    <Modal v-model="deleteModal" class="z-50" @click="deleteEmployeeAPI(role.data)">
      <template #title>
        Hapus Meja
      </template>
      <template #body>
        Apakah anda yakin akan menghapus meja bernomor <span class="font-bold">{{ role.data.table_number }}</span>?
      </template>
    </Modal>
  </div>
</template>

<script>
export default {
  async asyncData ({ params, $axios, error }) {
    try {
      const role = await $axios.$get('table/' + params.id)
      return { role }
    } catch (err) {
      if (err.response.status === 404) {
        error({ statusCode: 404, message: err.message })
      }
    }
  },
  data () {
    return {
      deactivateModal: false,
      activateModal: false,
      deleteModal: false
    }
  },
  head () {
    return {
      title: this.role.data.name
    }
  },
  methods: {
    edit (id) {
      this.$router.push('/dashboard/meja/' + id + '/edit')
    },
    showModal (val) {
      if (!val) {
        this.deactivateModal = true
      } else {
        this.activateModal = true
      }
    },
    async deleteEmployeeAPI (data) {
      await this.$axios.$delete('table/' + data.table_number)
      await this.$router.push('/dashboard/meja')
      this.$toast.show({
        type: 'success',
        title: 'Berhasil',
        message: 'Data meja bernomor ' + data.table_number + ' berhasil dihapus.',
        timeout: 3
      })
    }
  }
}
</script>

<style scoped>

</style>

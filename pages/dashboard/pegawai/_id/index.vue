<template>
  <div>
    <div class="mb-5">
      <div class="flex justify-between">
        <div class="flex-col my-auto">
          <h1 class="text-4xl font-bold">
            {{ employee.data.name }}
          </h1>
          <p>
            <span v-if="employee.data.role">
              {{ employee.data.role.name }}
            </span>
            <span v-else class="italic text-gray-400">
              Tanpa Jabatan
            </span>
          </p>
        </div>
        <div class="flex my-auto">
          <button
            v-if="$auth.hasScope('employee.update')"
            class="text-gray-500 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm
            font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2
            focus:ring-offset-2 focus:ring-gray-500"
            @click="edit(employee.data.id)"
          >
            Edit
          </button>
          <button
            v-if="employee.data.locked !== 1 && $auth.hasScope('employee.update')"
            class="ml-2 text-gray-500 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm
            font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2
            focus:ring-offset-2 focus:ring-gray-500"
            @click="showModal(employee.data.is_disabled)"
          >
            <span v-if="!employee.data.is_disabled">
              Nonaktifkan
            </span>
            <span v-else>
              Aktifkan
            </span>
          </button>
          <button
            v-if="employee.data.locked !== 1 && $auth.hasScope('employee.delete')"
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
          <div style="height: 60px" class="bg-white px-4 my-auto sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500 my-auto">
              Foto Profil
            </dt>
            <dd class="text-sm text-gray-900 my-auto">
              <div class="flex-shrink-0 h-10 w-10">
                <img
                  v-if="employee.data.image_path"
                  class="h-10 w-10 rounded-full"
                  :src="employee.data.image_path"
                  alt=""
                >
                <div
                  v-else
                  class="h-10 w-10 rounded-full bg-gray-500 flex justify-center items-center
                    text-white"
                >
                  {{ employee.data.name[0].toUpperCase() }}
                </div>
              </div>
            </dd>
          </div>
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Nama
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ employee.data.name }}
            </dd>
          </div>
          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Email
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ employee.data.email }}
            </dd>
          </div>
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Nomor Telepon
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ employee.data.phone }}
            </dd>
          </div>
          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Tanggal Bergabung
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ employee.data.date_join }}
            </dd>
          </div>
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Status
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <span v-if="!employee.data.is_disabled" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                Aktif
              </span>
              <span v-else class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                Tidak Aktif
              </span>
            </dd>
          </div>
          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Jabatan
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <span v-if="employee.data.role">
                {{ employee.data.role.name }}
              </span>
              <span v-else class="italic text-gray-400">
                Tanpa Jabatan
              </span>
            </dd>
          </div>
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Jenis Kelamin
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ employee.data.gender[0].toUpperCase() + employee.data.gender.slice(1) }}
            </dd>
          </div>
        </dl>
      </div>
    </div>
    <Modal v-model="deactivateModal" class="z-50" @click="deactivateEmployeeAPI(employee.data)">
      <template #title>
        Nonaktifkan Pegawai
      </template>
      <template #body>
        Apakah anda yakin akan menonaktifkan akun pegawai <span class="font-bold">{{ employee.data.name }}</span>?
      </template>
    </Modal>
    <Modal v-model="activateModal" class="z-50" @click="activateEmployeeAPI(employee.data)">
      <template #title>
        Aktifkan Pegawai
      </template>
      <template #body>
        Apakah anda yakin akan mengaktifkan akun pegawai <span class="font-bold">{{ employee.data.name }}</span>?
      </template>
    </Modal>
    <Modal v-model="deleteModal" class="z-50" @click="deleteEmployeeAPI(employee.data)">
      <template #title>
        Hapus Pegawai
      </template>
      <template #body>
        Apakah anda yakin akan menghapus akun pegawai <span class="font-bold">{{ employee.data.name }}</span>?
      </template>
    </Modal>
  </div>
</template>

<script>
export default {
  middleware: 'employee/read',
  async asyncData ({ params, $axios, error }) {
    try {
      const employee = await $axios.$get('employee/' + params.id)
      return { employee }
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
      title: this.employee.data.name
    }
  },
  methods: {
    edit (id) {
      this.$router.push('/dashboard/pegawai/' + id + '/edit')
    },
    showModal (val) {
      if (!val) {
        this.deactivateModal = true
      } else {
        this.activateModal = true
      }
    },
    async deactivateEmployeeAPI (data) {
      await this.$axios.$post('employee/' + data.id + '/deactivate').then(() => {
        this.$toast.show({
          type: 'success',
          title: 'Berhasil',
          message: 'Pegawai ' + data.name + ' berhasil dinonaktifkan.',
          timeout: 3
        })
        this.$nuxt.refresh()
      })
    },
    async activateEmployeeAPI (data) {
      await this.$axios.$post('employee/' + data.id + '/activate').then(() => {
        this.$toast.show({
          type: 'success',
          title: 'Berhasil',
          message: 'Pegawai ' + data.name + ' berhasil diaktifkan.',
          timeout: 3
        })
        this.$nuxt.refresh()
      })
    },
    async deleteEmployeeAPI (data) {
      await this.$axios.$delete('employee/' + data.id)
      await this.$router.push('/dashboard/pegawai')
      this.$toast.show({
        type: 'success',
        title: 'Berhasil',
        message: 'Data pegawai ' + data.name + ' berhasil dihapus.',
        timeout: 3
      })
    }
  }
}
</script>

<style scoped>

</style>

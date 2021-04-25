<template>
  <div>
    <div class="mb-5">
      <div class="flex justify-between">
        <div class="flex-col my-auto">
          <h1 class="text-4xl font-bold">
            {{ role.data.name }}
          </h1>
          <p>Detail data jabatan</p>
        </div>
        <div class="flex my-auto">
          <button
            v-if="role.data.locked !== 1"
            class="text-gray-500 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm
            font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2
            focus:ring-offset-2 focus:ring-gray-500"
            @click="edit(role.data.id)"
          >
            Edit
          </button>
          <button
            v-if="role.data.locked !== 1"
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
          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Nama
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ role.data.name }} <span class="italic text-gray-500">({{ role.data.slug }})</span>
            </dd>
          </div>
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Jabatan Inti
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <span v-if="role.data.locked" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                Ya
              </span>
              <span v-else class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                Tidak
              </span>
            </dd>
          </div>
          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Permissions
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <div v-for="(data, key) in role.data.permission" :key="key" class="mb-2">
                <p>{{ data.label }} <span class="italic text-gray-500">({{ data.name }})</span></p>
                <p class="text-xs text-gray-700">
                  {{ data.description }}
                </p>
              </div>
            </dd>
          </div>
        </dl>
      </div>
    </div>
    <Modal v-model="deleteModal" class="z-50" @click="deleteEmployeeAPI(role.data)">
      <template #title>
        Hapus Jabatan Pegawai
      </template>
      <template #body>
        Apakah anda yakin akan menghapus jabatan pegawai <span class="font-bold">{{ role.data.name }}</span>?
      </template>
    </Modal>
  </div>
</template>

<script>
export default {
  middleware: 'role/read',
  async asyncData ({ params, $axios, error }) {
    try {
      const role = await $axios.$get('role/' + params.id)
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
      deleteModal: false,
      form: {
        checkbox: [
          {
            name: 'Read',
            acls: [1, 2, 3, 4, 5]
          },
          {
            name: 'Create',
            acls: [3, 4, 5]
          },
          {
            name: 'Modify',
            acls: [2, 4, 5]
          },
          {
            name: 'Delete',
            acls: [5]
          }
        ]
      }
    }
  },
  head () {
    return {
      title: this.role.data.name
    }
  },
  methods: {
    edit (id) {
      this.$router.push('/dashboard/jabatan/' + id + '/edit')
    },
    showModal (val) {
      if (!val) {
        this.deactivateModal = true
      } else {
        this.activateModal = true
      }
    },
    async deleteEmployeeAPI (data) {
      await this.$axios.$delete('role/' + data.id)
      await this.$router.push('/dashboard/jabatan')
      this.$toast.show({
        type: 'success',
        title: 'Berhasil',
        message: 'Data jabatan ' + data.name + ' berhasil dihapus.',
        timeout: 3
      })
    }
  }
}
</script>

<style scoped>

</style>

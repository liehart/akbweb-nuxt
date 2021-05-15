<template>
  <div>
    <div class="mb-5">
      <div class="flex justify-between">
        <div class="flex-col my-auto">
          <h1 class="text-4xl font-bold">
            Menu {{ menu.data.name }}
          </h1>
          <p>Detail Menu</p>
        </div>
        <div class="flex my-auto">
          <button
            v-if="$auth.hasScope('menu.update')"
            class="text-gray-500 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm
            font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2
            focus:ring-offset-2 focus:ring-gray-500"
            @click="edit(menu.data.id)"
          >
            Edit
          </button>
          <button
            v-if="$auth.hasScope('menu.delete')"
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
              Gambar
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <div class="mr-4 flex-shrink-0">
                <div v-if="menu.data.image_path">
                  <img class="h-20 w-20 rounded-md" :src="menu.data.image_path" :alt="`Menu image for ` + menu.data.name">
                </div>
                <div v-else>
                  <img class="h-20 w-20 rounded-md" src="https://atmakoreanbbq.s3-ap-southeast-1.amazonaws.com/public/no_image.png" :alt="`No menu image for ` + menu.data.name">
                </div>
              </div>
            </dd>
          </div>
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Nama
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ menu.data.name }}
            </dd>
          </div>
          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Deskripsi
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <span>
                {{ menu.data.description }}
              </span>
            </dd>
          </div>
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Satuan
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <span>
                {{ menu.data.unit }}
              </span>
            </dd>
          </div>
          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Status
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <div class="text-sm text-gray-500 font-medium">
                <div v-if="menu.data.is_available === 1" class="flex gap-2 text-green-500">
                  <div class="h-2 w-2 bg-green-500 rounded-full my-auto" />
                  Ada
                </div>
                <div v-else class="flex gap-2 text-gray-500">
                  <div class="h-2 w-2 bg-gray-500 rounded-full my-auto" />
                  Kosong
                </div>
              </div>
            </dd>
          </div>
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Harga
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <span>
                {{ menu.data.price }}
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </div>
    <Modal v-model="deleteModal" class="z-50" @click="deleteMenuAPI(menu.data)">
      <template #title>
        Hapus Menu
      </template>
      <template #body>
        Apakah anda yakin akan menghapus data menu <span class="font-bold">{{ menu.data.name }}</span>?
      </template>
    </Modal>
  </div>
</template>

<script>
export default {
  middleware: 'menu/read',
  async asyncData ({ params, $axios, error }) {
    try {
      const menu = await $axios.$get('menu/' + params.id)
      return { menu }
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
      title: this.menu.data.name
    }
  },
  methods: {
    edit (id) {
      this.$router.push('/dashboard/menu/' + id + '/edit')
    },
    showModal (val) {
      if (!val) {
        this.deactivateModal = true
      } else {
        this.activateModal = true
      }
    },
    async deleteMenuAPI (data) {
      await this.$axios.$delete('menu/' + data.id).then(() => {
        this.$toast.show({
          type: 'success',
          title: 'Berhasil',
          message: 'Data menu ' + data.name + ' berhasil dihapus.',
          timeout: 3
        })
        this.$router.push('/dashboard/menu')
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

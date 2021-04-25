<template>
  <div>
    <div class="mb-5 antialiased">
      <div class="flex justify-between">
        <div class="flex-col my-auto">
          <h1 class="text-4xl font-bold">
            Edit Meja No {{ title }}
          </h1>
          <p>Menu untuk mengedit meja</p>
        </div>
        <div class="flex my-auto">
          <button
            class="text-gray-500 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm
            font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2
            focus:ring-offset-2 focus:ring-gray-500"
            @click="back()"
          >
            Batal
          </button>
          <button
            class="ml-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm
            text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none
            focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            @click="createTable"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
    <div>
      <div class="grid grid-cols-4 gap-6">
        <div class="col-span-1">
          <div class="px-4 sm:px-0">
            <h3 class="text-lg font-medium leading-6 text-gray-900">
              Data Utama
            </h3>
            <p class="mt-1 text-sm text-gray-600">
              Bagian ini berisi data utama dari data meja.
            </p>
          </div>
        </div>
        <div class="col-span-3">
          <form action="#" method="POST">
            <div class="shadow rounded-md overflow-hidden">
              <div class="p-6 bg-white space-y-3">
                <div class="grid grid-cols-2 gap-6">
                  <div class="col-span-2">
                    <label class="block text-sm font-medium text-gray-700">
                      Status Meja
                    </label>
                    <div class="mt-1 flex-col">
                      <div class="grid grid-cols-2 gap-4">
                        <div
                          class="transition duration-200 select-none flex justify-between p-5 rounded-md cursor-pointer border"
                          :class="[ form.is_empty === 0 ? 'border-red-500 bg-red-50 hover:bg-red-100 border-red-500' : 'hover:bg-gray-50 border-gray-300' ]"
                          @click="form.is_empty = 0"
                        >
                          <div class="flex gap-2 text-sm">
                            <div
                              class="font-semibold truncate"
                              :class="[ form.is_empty === 0 ? 'text-red-600' : '' ]"
                            >
                              Kosong
                            </div>
                          </div>
                          <div class="col-span-1 text-sm h-5 w-5 my-auto">
                            <div v-if="form.is_empty === 0" class="h-5 w-5 text-red-500 my-auto">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div
                          class="transition duration-200 select-none flex justify-between p-5 rounded-md cursor-pointer border"
                          :class="[ form.is_empty === 1 ? 'border-red-500 bg-red-50 hover:bg-red-100 border-red-500' : 'hover:bg-gray-50 border-gray-300' ]"
                          @click="form.is_empty = 1"
                        >
                          <div class="flex gap-2 text-sm">
                            <div
                              class="font-semibold truncate"
                              :class="[ form.is_empty === 1 ? 'text-red-600' : '' ]"
                            >
                              Terisi
                            </div>
                          </div>
                          <div class="col-span-1 text-sm h-5 w-5 my-auto">
                            <div v-if="form.is_empty === 1" class="h-5 w-5 text-red-500 my-auto">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { between } from 'vuelidate/lib/validators'

export default {
  middleware: 'table/update',
  validations: {
    form: {
      is_empty: {
        between: between(0, 1)
      }
    }
  },
  data () {
    return {
      form: {
        is_empty: 2
      },
      submitted: false
    }
  },
  async fetch () {
    await this.$axios.get('table/' + this.$route.params.id).then((res) => {
      this.form = res.data.data
      this.title = res.data.data.table_number
    })
  },
  head () {
    return {
      title: 'Edit Meja'
    }
  },
  methods: {
    back () {
      this.$router.push('/dashboard/meja')
    },
    createTableAPI () {
      this.$axios.put('table/' + this.form.table_number, this.form).then((res) => {
        this.back()
        this.$toast.show({
          type: 'success',
          title: 'Berhasil',
          message: 'Data meja ' + this.form.table_number + ' berhasil diedit.',
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
    createTable () {
      this.$v.$touch()
      this.submitted = true
      if (!this.$v.$error) {
        this.createTableAPI()
      }
    }
  }
}
</script>

<template>
  <div>
    <div class="mb-5 antialiased">
      <div class="flex justify-between">
        <div class="flex-col my-auto">
          <h1 class="text-4xl font-bold">
            Tambah Meja Baru
          </h1>
          <p>Menu untuk menambah meja baru</p>
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
            @click="createRole"
          >
            Tambah
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
              Bagian ini berisi data utama dari meja pegawai.
            </p>
          </div>
        </div>
        <div class="col-span-3">
          <form action="#" method="POST">
            <div class="shadow rounded-md overflow-hidden">
              <div class="p-6 bg-white space-y-3">
                <div class="grid grid-cols-2 gap-6">
                  <div class="col-span-2">
                    <label class="block text-sm font-medium text-gray-700" for="table_number">
                      Nomor Meja
                    </label>
                    <div class="mt-1 flex-col">
                      <input
                        id="table_number"
                        v-model="form.table_number"
                        :class="{ 'border-red-600' : submitted && $v.form.table_number.$error }"
                        class="placeholder-gray-300 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                        name="table_number"
                        placeholder="Nomor meja"
                        type="number"
                        @blur="$v.form.table_number.$touch()"
                        @focus="$v.form.table_number.$touch()"
                      >
                      <span v-if="submitted && !$v.form.table_number.required" class="text-xs text-red-500">
                        Nomor meja tidak boleh kosong
                      </span>
                      <span v-else-if="submitted && !$v.form.table_number.numeric" class="text-xs text-red-500">
                        Nomor meja tidak valid
                      </span>
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
import { numeric, required } from 'vuelidate/lib/validators'

export default {
  validations: {
    form: {
      table_number: {
        required,
        numeric
      }
    }
  },
  data () {
    return {
      form: {
        table_number: null
      },
      serverErrors: [],
      submitted: false
    }
  },
  head () {
    return {
      title: 'Tambah Pegawai'
    }
  },
  computed: {
    generateSlug () {
      return this.form.name.trim().replace(/\s+/g, '-').toLowerCase()
    }
  },
  methods: {
    back () {
      this.$router.push('/dashboard/meja')
    },
    createTableAPI () {
      this.$axios.post('table', this.form).then(() => {
        this.back()
        this.$toast.show({
          type: 'success',
          title: 'Berhasil',
          message: 'Data meja bernomor ' + this.form.table_number + ' berhasil dibuat.',
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
    createRole () {
      this.$v.$touch()
      this.submitted = true
      this.serverErrors = []
      if (!this.$v.$error) {
        this.createTableAPI()
      }
    }
  }
}
</script>

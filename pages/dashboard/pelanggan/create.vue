<template>
  <div>
    <div class="mb-5 antialiased">
      <div class="flex justify-between">
        <div class="flex-col my-auto">
          <h1 class="text-4xl font-bold">
            Tambah Pelanggan Baru
          </h1>
          <p>Menu untuk menambah pelanggan baru</p>
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
            @click="createCustomer"
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
              Data Diri
            </h3>
            <p class="mt-1 text-sm text-gray-600">
              Bagian ini berisi data diri dari pelanggan.
            </p>
          </div>
        </div>
        <div class="col-span-3">
          <form action="#" method="POST">
            <div class="shadow rounded-md overflow-hidden">
              <div class="p-6 bg-white space-y-3">
                <div class="grid grid-cols-2 gap-6">
                  <div class="col-span-2">
                    <label class="block text-sm font-medium text-gray-700" for="name">
                      Nama Pelanggan
                    </label>
                    <div class="mt-1 flex-col">
                      <input
                        id="name"
                        v-model="form.name"
                        :class="{ 'border-red-600' : submitted && $v.form.name.$error }"
                        class="placeholder-gray-300 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                        name="name"
                        placeholder="Nama Pelanggan"
                        type="text"
                        @blur="$v.form.name.$touch()"
                        @focus="$v.form.name.$touch()"
                      >
                      <span v-if="submitted && !$v.form.name.required" class="text-xs text-red-500">
                        Nama pelanggan tidak boleh kosong
                      </span>
                      <span v-if="submitted && !$v.form.name.maxLength" class="text-xs text-red-500">
                        Nama pelanggan tidak boleh lebih dari 100 karakter
                      </span>
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-6">
                  <div class="col-span-1">
                    <label class="block text-sm font-medium text-gray-700" for="telephone">
                      Nomor Telepon
                    </label>
                    <div class="mt-1 flex-col">
                      <input
                        id="telephone"
                        v-model="form.phone"
                        :class="{ 'border-red-600' : submitted && $v.form.phone.$error }"
                        class="flex-1 placeholder-gray-300 block w-full rounded-md sm:text-sm border-gray-300"
                        name="telephone"
                        placeholder="Nomor Telepon Pelanggan"
                        type="tel"
                        @blur="$v.form.phone.$touch()"
                        @focus="$v.form.phone.$touch()"
                      >
                      <span v-if="submitted && !$v.form.phone.numeric" class="text-xs text-red-500">
                        Nomor telepon tidak valid
                      </span>
                      <span v-else-if="submitted && !$v.form.phone.maxLength" class="text-xs text-red-500">
                        Nomor telepon lebih dari 13 digit
                      </span>
                      <span v-else-if="submitted && !$v.form.phone.minLength" class="text-xs text-red-500">
                        Nomor telepon kurang dari 10 digit
                      </span>
                    </div>
                  </div>
                  <div class="col-span-1">
                    <label class="block text-sm font-medium text-gray-700" for="email">
                      Email Pelanggan
                    </label>
                    <div class="mt-1 flex-col">
                      <input
                        id="email"
                        v-model="form.email"
                        type="email"
                        class="flex-1 placeholder-gray-300 block w-full rounded-md sm:text-sm border-gray-300"
                        :class="{ 'border-red-600' : submitted && $v.form.email.$error }"
                        name="email"
                        placeholder="customer@gmail.com"
                        @blur="$v.form.email.$touch()"
                        @focus="$v.form.email.$touch()"
                      >
                      <span v-if="submitted && !$v.form.email.email" class="text-xs text-red-500">
                        Email tidak valid
                      </span>
                      <span v-else-if="submitted && !$v.form.email.maxLength" class="text-xs text-red-500">
                        Email lebih dari 100 digit
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
import { email, maxLength, minLength, numeric, required } from 'vuelidate/lib/validators'
export default {
  middleware: 'customer/create',
  validations: {
    form: {
      name: {
        required,
        maxLength: maxLength(100)
      },
      email: {
        email,
        maxLength: maxLength(100)
      },
      phone: {
        numeric,
        minLength: minLength(10),
        maxLength: maxLength(13)
      }
    }
  },
  data () {
    return {
      form: {
        name: '',
        email: '',
        phone: ''
      },
      submitted: false
    }
  },
  head () {
    return {
      title: 'Tambah Pegawai'
    }
  },
  methods: {
    back () {
      this.$router.push('/dashboard/pelanggan')
    },
    createCustomerAPI () {
      this.$axios.post('customer', this.form).then(() => {
        this.back()
        this.$toast.show({
          type: 'success',
          title: 'Berhasil',
          message: 'Data pelanggan ' + this.form.name + ' berhasil dibuat.',
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
    createCustomer () {
      this.$v.$touch()
      this.submitted = true
      if (!this.$v.$error) {
        this.createCustomerAPI()
      }
    }
  }
}
</script>

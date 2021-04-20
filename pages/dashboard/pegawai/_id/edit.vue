<template>
  <div>
    <div class="mb-5 antialiased">
      <div class="flex justify-between">
        <div class="flex-col my-auto">
          <h1 class="text-4xl font-bold">
            Edit {{ title }}
          </h1>
          <p>Menu untuk mengedit pegawai</p>
        </div>
        <div class="flex my-auto">
          <button
            class="text-gray-500 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm
            font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2
            focus:ring-offset-2 focus:ring-gray-500"
            @click="back"
          >
            Batal
          </button>
          <button
            class="ml-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm
            text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none
            focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            @click="createEmployee"
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
              Data Pribadi
            </h3>
            <p class="mt-1 text-sm text-gray-600">
              Bagian ini berisi data pribadi dari pegawai.
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
                      Nama Pegawai
                    </label>
                    <div class="mt-1 flex-col">
                      <input
                        id="name"
                        v-model="form.name"
                        :class="{ 'border-red-600' : submitted && $v.form.name.$error }"
                        class="placeholder-gray-300 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                        name="name"
                        placeholder="Nama Pegawai"
                        type="text"
                        @blur="$v.form.name.$touch()"
                        @focus="$v.form.name.$touch()"
                      >
                      <span v-if="submitted && !$v.form.name.required" class="text-xs text-red-500">
                        Nama pegawai tidak boleh kosong
                      </span>
                      <span v-if="submitted && !$v.form.name.maxLength" class="text-xs text-red-500">
                        Nama pegawai tidak boleh lebih dari 100 karakter
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
                        placeholder="Nomor Telepon Pegawai"
                        type="tel"
                        @blur="$v.form.phone.$touch()"
                        @focus="$v.form.phone.$touch()"
                      >
                      <span v-if="submitted && !$v.form.phone.required" class="text-xs text-red-500">
                        Nomor telepon tidak boleh kosong
                      </span>
                      <span v-else-if="submitted && !$v.form.phone.numeric" class="text-xs text-red-500">
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
                    <label class="block text-sm font-medium text-gray-700">
                      Jenis Kelamin
                    </label>
                    <Select
                      v-model="form.gender"
                      :error="(submitted && $v.form.gender.$error)"
                      :list="jenisKelaminList"
                      @blur="$v.form.gender.$touch()"
                      @focus="$v.form.gender.$touch()"
                    />
                    <span v-if="submitted && !$v.form.gender.required" class="text-xs text-red-500">
                      Jenis kelamin tidak boleh kosong
                    </span>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-6">
                  <div class="col-span-1 sm:col-span-1">
                    <label class="block text-sm font-medium text-gray-700">
                      Role Pegawai
                    </label>
                    <Select
                      v-model="form.role_id"
                      :disabled="form.locked"
                      :error="(submitted && $v.form.role_id.$error)"
                      :list="roles.data"
                      @blur="$v.form.role_id.$touch()"
                      @focus="$v.form.role_id.$touch()"
                    />
                    <span v-if="submitted && !$v.form.role_id.minValue" class="text-xs text-red-500">
                      Jabatan tidak boleh kosong
                    </span>
                  </div>
                  <div class="col-span-1 sm:col-span-1">
                    <label class="block text-sm font-medium text-gray-700" for="date_join">
                      Tanggal Bergabung
                    </label>
                    <div class="mt-1 flex-col">
                      <input
                        id="date_join"
                        v-model="form.date_join"
                        :class="{ 'border-red-600' : submitted && $v.form.date_join.$error }"
                        :max="new Date().toISOString()"
                        class="flex-1 placeholder-gray-300 block w-full rounded-md sm:text-sm border-gray-300"
                        name="date_join"
                        placeholder="Tanggal Bergabung"
                        type="date"
                        @blur="$v.form.date_join.$touch()"
                        @focus="$v.form.date_join.$touch()"
                      >
                      <span v-if="submitted && !$v.form.date_join.required" class="text-xs text-red-500">
                        Tanggal tidak boleh kosong
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div aria-hidden="true" class="hidden sm:block">
        <div class="py-5">
          <div class="border-t border-gray-200" />
        </div>
      </div>
      <div class="grid md:grid-cols-4 md:gap-6">
        <div class="col-span-1">
          <div class="px-4 sm:px-0">
            <h3 class="text-lg font-medium leading-6 text-gray-900">
              Data Akun
            </h3>
            <p class="mt-1 text-sm text-gray-600">
              Bagian ini berisi data akun dari pegawai.
            </p>
          </div>
        </div>
        <div class="col-span-3">
          <div class="shadow sm:rounded-md sm:overflow-hidden">
            <div class="px-4 py-5 bg-white space-y-6 sm:p-6">
              <div class="grid grid-cols-2 gap-6">
                <div class="col-span-2 sm:col-span-2">
                  <label class="block text-sm font-medium text-gray-700" for="email">
                    Email Pegawai
                  </label>
                  <div class="mt-1 flex-col">
                    <input
                      id="email"
                      v-model="form.email"
                      type="email"
                      class="flex-1 placeholder-gray-300 block w-full rounded-md sm:text-sm border-gray-300"
                      :class="{ 'border-red-600' : submitted && $v.form.email.$error }"
                      name="email"
                      placeholder="user@atmakoreanbbq.com"
                      @blur="$v.form.email.$touch()"
                      @focus="$v.form.email.$touch()"
                    >
                    <span v-if="submitted && !$v.form.email.required" class="text-xs text-red-500">
                      Email tidak boleh kosong
                    </span>
                    <span v-else-if="submitted && !$v.form.email.email" class="text-xs text-red-500">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { email, maxLength, minLength, minValue, numeric, required } from 'vuelidate/lib/validators'

export default {
  validations: {
    form: {
      name: {
        required,
        maxLength: maxLength(100)
      },
      email: {
        required,
        email,
        maxLength: maxLength(100)
      },
      phone: {
        required,
        numeric,
        minLength: minLength(10),
        maxLength: maxLength(13)
      },
      gender: { required },
      role_id: { minValue: minValue(1) },
      date_join: { required }
    }
  },
  async asyncData ({
    $axios,
    error
  }) {
    try {
      const roles = await $axios.$get('select/role')
      return { roles }
    } catch (err) {
      if (err.response.status === 404) {
        error({
          statusCode: 404,
          message: err.message
        })
      }
    }
  },
  data () {
    return {
      title: '',
      form: {
        name: '',
        gender: '',
        role_id: 0,
        date_join: '',
        password: '',
        confirmPassword: '',
        email: '',
        phone: ''
      },
      submitted: false,
      jenisKelaminList: [
        {
          name: 'Pria',
          value: 'male'
        },
        {
          name: 'Wanita',
          value: 'female'
        },
        {
          name: 'Lain-Lain',
          value: 'other'
        }
      ]
    }
  },
  // mounted () {
  //   this.form = this.$store.state.employee.employee
  //   console.log(this.form)
  // },
  async fetch () {
    await this.$axios.get('employee/' + this.$route.params.id).then((res) => {
      this.form = res.data.data
      this.title = res.data.data.name
    })
  },
  head () {
    return {
      title: 'Edit ' + this.title
    }
  },
  methods: {
    back () {
      this.$router.push('/dashboard/pegawai/' + this.$route.params.id)
    },
    createEmployeeAPI () {
      this.$axios.put('employee/' + this.form.id, this.form).then((res) => {
        console.log(res)
        this.back()
      }).catch((err) => {
        console.log(err)
      })
    },
    createEmployee () {
      this.$v.$touch()
      this.submitted = true
      if (!this.$v.$error) {
        this.createEmployeeAPI()
      }
    }
  }
}
</script>

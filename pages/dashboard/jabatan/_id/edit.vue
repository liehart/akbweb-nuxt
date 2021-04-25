<template>
  <div>
    <div class="mb-5 antialiased">
      <div class="flex justify-between">
        <div class="flex-col my-auto">
          <h1 class="text-4xl font-bold">
            Edit {{ title }}
          </h1>
          <p>Menu untuk mengedit jabatan pegawai baru</p>
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
              Bagian ini berisi data utama dari jabatan pegawai.
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
                      Nama Jabatan Pegawai
                    </label>
                    <div class="mt-1 flex-col">
                      <input
                        id="name"
                        v-model="form.name"
                        :class="{ 'border-red-600' : submitted && $v.form.name.$error }"
                        class="placeholder-gray-300 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                        name="name"
                        placeholder="Nama Jabatan Pegawai"
                        type="text"
                        @blur="$v.form.name.$touch()"
                        @focus="$v.form.name.$touch()"
                      >
                      <span v-if="submitted && !$v.form.name.required" class="text-xs text-red-500">
                        Nama jabatan pegawai tidak boleh kosong
                      </span>
                      <span v-if="submitted && !$v.form.name.maxLength" class="text-xs text-red-500">
                        Nama jabatan pegawai tidak boleh lebih dari 100 karakter
                      </span>
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-6">
                  <div class="col-span-2">
                    <label class="block text-sm font-medium text-gray-700" for="name">
                      Slug Jabatan Pegawai
                    </label>
                    <div class="mt-1 flex-col">
                      <input
                        id="slug"
                        v-model="generateSlug"
                        class="placeholder-gray-400 text-gray-400 flex-1 bg-gray-100 block w-full rounded-md sm:text-sm border-gray-300"
                        name="name"
                        placeholder="Slug Jabatan Pegawai"
                        type="text"
                        disabled
                      >
                      <span class="text-xs text-gray-500">
                        Slug adalah data yang otomatis terisi.
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
      <div class="grid grid-cols-4 gap-6">
        <div class="col-span-1">
          <div class="px-4 sm:px-0">
            <h3 class="text-lg font-medium leading-6 text-gray-900">
              Data Permission
            </h3>
            <p class="mt-1 text-sm text-gray-600">
              Bagian ini berisi data permission dari role pegawai.
            </p>
          </div>
        </div>
        <div class="col-span-3">
          <div class="shadow sm:rounded-md sm:overflow-hidden">
            <div class="px-4 py-5 bg-white space-y-6 sm:p-6">
              <div class="grid grid-cols-2 gap-4">
                <div v-for="(data, key) in permissions.data" :key="key" @click="selectPermission(data.id)">
                  <div
                    class="transition duration-200 select-none flex justify-between p-3 rounded-md cursor-pointer border"
                    :class="[ form.permission.includes(data.id) ? 'border-red-500 bg-red-50 hover:bg-red-100 border-red-500' : 'hover:bg-gray-50 border-gray-300' ]"
                  >
                    <div class="flex gap-2 text-sm">
                      <div
                        :class="[ form.permission.includes(data.id) ? 'text-red-600' : '' ]"
                      >
                        <p><span class="font-semibold">{{ data.label }}</span> <span class="italic text-gray-500">({{ data.name }})</span></p>
                        <p class="text-gray-700 text-xs">
                          {{ data.description }}
                        </p>
                      </div>
                    </div>
                    <div class="col-span-1 text-sm h-5 w-5 my-auto">
                      <div v-if="form.permission.includes(data.id)" class="h-5 w-5 text-red-500 my-auto">
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
    </div>
  </div>
</template>

<script>
import { maxLength, required } from 'vuelidate/lib/validators'
import _ from 'lodash'

export default {
  middleware: 'role/update',
  validations: {
    form: {
      name: {
        required,
        maxLength: maxLength(100)
      }
    }
  },
  async asyncData ({
    $axios,
    error
  }) {
    try {
      const permissions = await $axios.$get('select/permission')
      return { permissions }
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
      form: {
        name: '',
        slug: '',
        permission: []
      },
      submitted: false
    }
  },
  async fetch () {
    await this.$axios.get('role/' + this.$route.params.id).then((res) => {
      this.form = res.data.data
      this.title = res.data.data.name
      this.form.permission = _.map(this.form.permission, 'id')
    })
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
    selectPermission (id) {
      if (this.form.permission.includes(id)) {
        this.form.permission.splice(this.form.permission.indexOf(id), 1)
      } else {
        this.form.permission.push(id)
      }
    },
    back () {
      this.$router.push('/dashboard/jabatan/' + this.form.id)
    },
    createRoleAPI () {
      this.$axios.put('role/' + this.form.id, this.form).then((res) => {
        this.back()
        this.$toast.show({
          type: 'success',
          title: 'Berhasil',
          message: 'Data jabatan ' + this.form.name + ' berhasil diedit.',
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
      if (!this.$v.$error) {
        this.form.slug = this.form.name.trim().replace(/\s+/g, '-').toLowerCase()
        this.createRoleAPI()
      }
    }
  }
}
</script>

<template>
  <div>
    <div class="mb-5 flex justify-between">
      <h1 class="text-4xl font-bold">
        Account Setting
      </h1>
      <button
        class="ml-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm
            text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none
            focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        @click="openChangePasswordModal"
      >
        Ganti Password
      </button>
    </div>
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="border-t border-gray-200">
        <dl>
          <div class="bg-white px-4 my-auto sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6" style="height: 60px">
            <dt class="text-sm font-medium text-gray-500 my-auto">
              Foto Profil
            </dt>
            <dd class="text-sm text-gray-900 my-auto">
              <div class="flex-shrink-0 h-10 w-10">
                <img
                  v-if="user.image_path"
                  :src="user.image_path"
                  alt=""
                  class="h-10 w-10 rounded-full"
                >
                <div
                  v-else
                  class="h-10 w-10 rounded-full bg-gray-500 flex justify-center items-center
                    text-white"
                >
                  {{ user.name[0].toUpperCase() }}
                </div>
              </div>
            </dd>
          </div>
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Nama
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ user.name }}
            </dd>
          </div>
          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Email
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ user.email }}
            </dd>
          </div>
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Nomor Telepon
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ user.phone }}
            </dd>
          </div>
          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Tanggal Bergabung
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ user.date_join }}
            </dd>
          </div>
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Status
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <span
                v-if="!user.is_disabled"
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
              >
                Aktif
              </span>
              <span
                v-else
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800"
              >
                Tidak Aktif
              </span>
            </dd>
          </div>
          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Jabatan
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ user.role.name }}
            </dd>
          </div>
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Jenis Kelamin
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ user.gender[0].toUpperCase() + user.gender.slice(1) }}
            </dd>
          </div>
          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Permissions
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <div v-for="(data, key) in user.role.permission" :key="key" class="mb-2">
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
    <ChangePasswordModal v-model="changePasswordModal" class="z-50" @click="changeEmployeePasswordAPI()">
      <template #title>
        Ganti Password
      </template>
      <template #body>
        <div v-if="old_password_wrong" class="mb-5 bg-red-200 p-5 rounded-md text-red-900">
          Password Lama Salah
        </div>
        <div class="mb-3 mt-5">
          <label class="block text-sm font-medium text-gray-700" for="password">
            Password Lama
          </label>
          <div class="mt-1 flex-col">
            <input
              id="password"
              v-model="form.password"
              :class="{ 'border-red-600' : submitted && $v.form.password.$error }"
              class="flex-1 placeholder-gray-300 block w-full rounded-md sm:text-sm border-gray-300"
              name="password"
              placeholder="Password"
              type="password"
              @blur="$v.form.password.$touch()"
              @focus="$v.form.password.$touch()"
            >
            <span v-if="submitted && !$v.form.password.required" class="text-xs text-red-500">
              Password tidak boleh kosong
            </span>
            <span v-else-if="submitted && !$v.form.password.minLength" class="text-xs text-red-500">
              Password kurang dari 8 karakter
            </span>
            <span v-else-if="submitted && !$v.form.password.maxLength" class="text-xs text-red-500">
              Password kurang dari 72 karakter
            </span>
          </div>
        </div>
        <div class="mb-3 mt-5">
          <label class="block text-sm font-medium text-gray-700" for="new_password">
            Password Baru
          </label>
          <div class="mt-1 flex-col">
            <input
              id="new_password"
              v-model="form.new_password"
              :class="{ 'border-red-600' : submitted && $v.form.new_password.$error }"
              class="flex-1 placeholder-gray-300 block w-full rounded-md sm:text-sm border-gray-300"
              name="password"
              placeholder="Password"
              type="password"
              @blur="$v.form.new_password.$touch()"
              @focus="$v.form.new_password.$touch()"
            >
            <span v-if="submitted && !$v.form.new_password.required" class="text-xs text-red-500">
              Password tidak boleh kosong
            </span>
            <span v-else-if="submitted && !$v.form.new_password.minLength" class="text-xs text-red-500">
              Password kurang dari 8 karakter
            </span>
            <span v-else-if="submitted && !$v.form.new_password.maxLength" class="text-xs text-red-500">
              Password kurang dari 72 karakter
            </span>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700" for="confirm_password">
            Konfirmasi Password Baru
          </label>
          <div class="mt-1 flex-col">
            <input
              id="confirm_password"
              v-model="form.confirmPassword"
              :class="{ 'border-red-600' : submitted && $v.form.confirmPassword.$error }"
              class="flex-1 placeholder-gray-300 block w-full rounded-md sm:text-sm border-gray-300"
              name="confirm_password"
              placeholder="Konfirmasi Password"
              type="password"
              @blur="$v.form.confirmPassword.$touch()"
              @focus="$v.form.confirmPassword.$touch()"
            >
            <span v-if="submitted && !$v.form.confirmPassword.required" class="text-xs text-red-500">
              Konfirmasi password tidak boleh kosong
            </span>
            <span v-else-if="submitted && !$v.form.confirmPassword.minLength" class="text-xs text-red-500">
              Konfirmasi password kurang dari 8 karakter
            </span>
            <span v-else-if="submitted && !$v.form.confirmPassword.sameAs" class="text-xs text-red-500">
              Konfirmasi password tidak sama
            </span>
            <span v-else-if="submitted && !$v.form.confirmPassword.maxLength" class="text-xs text-red-500">
              Konfirmasi password kurang dari 72 karakter
            </span>
          </div>
        </div>
      </template>
    </ChangePasswordModal>
  </div>
</template>

<script>
import { maxLength, minLength, required, sameAs } from 'vuelidate/lib/validators'

export default {
  validations: {
    form: {
      password: {
        required,
        minLength: minLength(8),
        maxLength: maxLength(72)
      },
      new_password: {
        required,
        minLength: minLength(8),
        maxLength: maxLength(72)
      },
      confirmPassword: {
        required,
        minLength: minLength(8),
        maxLength: maxLength(72),
        sameAs: sameAs('new_password')
      }
    }
  },
  data () {
    return {
      loading: true,
      loadingAPI: true,
      changePasswordModal: false,
      submitted: false,
      old_password_wrong: false,
      form: {
        password: '',
        new_password: '',
        confirmPassword: ''
      },
      user: this.$auth.user.user
    }
  },
  head () {
    return {
      title: 'Account Setting | Atma Korean BBQ'
    }
  },
  methods: {
    changeEmployeePasswordAPI () {
      this.$v.$touch()
      this.submitted = true
      this.old_password_wrong = false
      if (!this.$v.$error) {
        this.submitted = false
        this.$axios.post('auth/password', this.form).then(() => {
          this.changePasswordModal = false
          this.$toast.show({
            type: 'success',
            title: 'Berhasil',
            message: 'Password berhasil diganti',
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
            } else if (err.response.data.message === 'OLD_WRONG') {
              this.old_password_wrong = true
            }
          }
        })
      }
      this.form.password = ''
      this.form.new_password = ''
      this.form.confirmPassword = ''
    },
    openChangePasswordModal () {
      this.$v.$reset()
      this.submitted = false
      this.changePasswordModal = true
    }
  }
}
</script>

<style scoped>
.loading-bar {
  animation: indeterminate 2800ms infinite linear
}

@keyframes indeterminate {
  0% {
    transform: translateX(-100%) scaleX(0.2)
  }

  20% {
    transform: translateX(-40%) scaleX(0.2)
  }

  30% {
    transform: translateX(0%) scaleX(0.5)
  }

  55% {
    transform: translateX(100%) scaleX(0.7)
  }

  55.99% {
    transform: scaleX(0)
  }

  56% {
    transform: translateX(-100%) scaleX(0)
  }

  56.99% {
    transform: translateX(-100%) scaleX(0.6)
  }

  75% {
    transform: translateX(-5%) scaleX(0.6)
  }

  85% {
    transform: translateX(30%) scaleX(0.3)
  }

  98% {
    transform: translateX(100%) scaleX(0.2)
  }

  99.99% {
    transform: scaleX(0)
  }
  100% {
    transform: translateX(-100%)
  }
}
</style>

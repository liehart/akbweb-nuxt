<template>
  <div class="bg-image min-h-screen bg-gray-100 flex flex-col sm:py-12">
    <div class="p-10 xs:p-0 mx-auto md:w-full md:max-w-md text-white">
      <div class="px-5">
        <h1 class="font-bold text-4xl mb-1.5">
          Masuk
        </h1>
        <p class="mb-5">
          Atma Korean BBQ
        </p>
      </div>
      <form class="bg-white shadow w-full rounded-lg" @submit.prevent="userLogin">
        <div class="px-5 py-7">
          <div class="mb-3">
            <Input
              v-model="login.email"
              label="Email Pegawai"
              placeholder="user@atmakoreanbbq.me"
              type="text"
              :variant="submitted ? ($v.login.email.$error ? 'error' : 'success') : 'primary'"
              @blur="$v.login.email.$touch()"
              @focus="$v.login.email.$touch()"
            >
              <template #message>
                <span v-if="submitted && !$v.login.email.required" class="text-xs text-red-500">
                  Email tidak boleh kosong
                </span>
                <span v-if="submitted && !$v.login.email.email" class="text-xs text-red-500">
                  Email tidak valid
                </span>
              </template>
            </Input>
          </div>
          <div class="mb-3">
            <Input
              v-model="login.password"
              label="Password"
              placeholder="Masukkan Password"
              type="password"
              :variant="submitted ? ($v.login.password.$error ? 'error' : 'success') : 'primary'"
              @blur="$v.login.password.$touch()"
              @focus="$v.login.password.$touch()"
            >
              <template #message>
                <span v-if="submitted && !$v.login.password.required" class="text-xs text-red-500">
                  Password tidak boleh kosong
                </span>
                <span v-if="submitted && !$v.login.password.minLength" class="text-xs text-red-500">
                  Password minimal terdiri dari 8 karakter
                </span>
                <span v-if="submitted && !$v.login.password.maxLength" class="text-xs text-red-500">
                  Password maksimal terdiri dari 72 karakter
                </span>
              </template>
            </Input>
          </div>
          <Button
            label="Masuk"
            variant="primary"
            :disabled="loading"
            :loading="loading"
            :icon="true"
            class="w-full mt-3"
          >
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </template>
          </Button>
        </div>
        <div v-if="showError" class="bg-red-100 text-red-700 px-4 py-3 rounded-b">
          <p class="font-bold">
            {{ errorTitle }}
          </p>
          <p class="block sm:inline text-sm">
            {{ errorMessage }}
          </p>
        </div>
      </form>
      <div class="py-5 text-center whitespace-nowrap text-white">
        <p>
          &copy; 2021
          <a href="/" class="font-bold hover:text-gray-800 transition duration-200">
            Atma Korean BBQ</a>
          &mdash; All rights reserved.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { email, maxLength, minLength, required } from 'vuelidate/lib/validators'

export default {
  auth: 'guest',
  name: 'Login',
  layout: 'guest',
  validations: {
    login: {
      email: { required, email, maxLength: maxLength(50) },
      password: { required, minLength: minLength(8), maxLength: maxLength(72) }
    }
  },
  data () {
    return {
      login: {
        email: '',
        password: ''
      },
      errors: {
        login: {
          email: '',
          password: ''
        }
      },
      loading: false,
      submitted: false,
      showError: false,
      errorMessage: '',
      errorTitle: ''
    }
  },
  methods: {
    userLogin () {
      this.submitted = true
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.setError(false, '', '')
        this.postAPI(this.login)
      }
    },
    postAPI (payload = null) {
      this.loading = true
      this.$auth.loginWith('local', {
        data: payload
      }).then(() => {
        this.$router.push('/dashboard')
      }).catch((err) => {
        if (err.response) {
          if (err.response.data.message) {
            this.setError(true, 'Gagal Login', err.response.data.message)
          }
        }
      }).finally(() => {
        this.loading = false
      })
    },
    setError (show = true, title = 'Error', message = '') {
      this.showError = show
      this.errorTitle = title
      this.errorMessage = message
    }
  }
}
</script>

<style>
.bg-image {
  background: linear-gradient(
    rgba(0, 0, 0, 0.7),
    rgba(0, 0, 0, 0.7)
  ),
  url("~/assets/background.jpeg") no-repeat;
  background-size: cover;
}
</style>

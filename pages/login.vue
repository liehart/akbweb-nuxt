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
            <label class="font-semibold text-sm text-gray-600 pb-1 block">E-mail</label>
            <input
              ref="email"
              v-model="login.email"
              type="text"
              name="email"
              class="placeholder-gray-300 flex-1 text-black block w-full rounded-md sm:text-sm border-gray-300"
              placeholder="user@atmakoreanbbq.com"
              :class="{ 'border-red-600' : sumbitted && $v.login.email.$error }"
              @blur="$v.login.email.$touch()"
              @focus="$v.login.email.$touch()"
            >
            <span v-if="sumbitted && !$v.login.email.required" class="text-xs text-red-500">
              Email tidak boleh kosong
            </span>
            <span v-if="sumbitted && !$v.login.email.email" class="text-xs text-red-500">
              Email tidak valid
            </span>
          </div>
          <div class="mb-3">
            <label class="font-semibold text-sm text-gray-600 pb-1 block">Password</label>
            <input
              ref="password"
              v-model="login.password"
              type="password"
              name="password"
              class="placeholder-gray-300 flex-1 text-black block w-full rounded-md sm:text-sm border-gray-300"
              placeholder="Masukkan password"
              :class="{ 'border-red-600' : sumbitted && $v.login.password.$error }"
              @blur="$v.login.password.$touch()"
              @focus="$v.login.password.$touch()"
            >
            <span v-if="sumbitted && !$v.login.password.required" class="text-xs text-red-500">
              Password tidak boleh kosong
            </span>
            <span v-if="sumbitted && !$v.login.password.minLength" class="text-xs text-red-500">
              Password minimal terdiri dari 8 karakter
            </span>
            <span v-if="sumbitted && !$v.login.password.maxLength" class="text-xs text-red-500">
              Password maksimal terdiri dari 72 karakter
            </span>
          </div>
          <button
            class="text-white mt-3 w-full py-2.5 rounded-lg text-sm shadow-sm font-semibold text-center inline-block"
            :class="[ loading ? 'bg-red-100' : 'hover:shadow-md bg-red-500 hover:bg-red-600 focus:bg-red-700  focus:shadow-sm focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 focus:outline-none' ]"
            type="submit"
            :disabled="loading"
          >
            <span v-if="loading" class="inline-block mr-2">
              Loading...
            </span>
            <span v-else>
              Login
            </span>
          </button>
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
      sumbitted: false,
      showError: false,
      errorMessage: '',
      errorTitle: ''
    }
  },
  methods: {
    userLogin () {
      this.sumbitted = true
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

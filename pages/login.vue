<template>
  <div class="bg-image min-h-screen bg-gray-100 flex flex-col sm:py-12">
    <div class="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
      <div class="px-5">
        <h1 class="font-bold text-4xl mb-1.5">
          Masuk
        </h1>
        <p class="mb-5">
          Atma Korean BBQ
        </p>
      </div>
      <form class="bg-white shadow w-full rounded-lg divide-y divide-gray-200" @submit.prevent="userLogin">
        <div class="px-5 py-7">
          <div class="mb-3">
            <label class="font-semibold text-sm text-gray-600 pb-1 block">E-mail</label>
            <input
              ref="email"
              v-model="login.email"
              type="text"
              name="email"
              class="border rounded-lg px-3 py-2 mt-1 text-sm w-full focus:ring-2
              focus:ring-blue-600 focus:outline-none"
              placeholder="user@atmakoreanbbq.com"
              :class="{ 'ring-2 ring-red-600' : sumbitted && $v.login.email.$error }"
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
              class="border rounded-lg px-3 py-2 mt-1 text-sm w-full focus:ring-2
              focus:ring-blue-600 focus:outline-none"
              placeholder="Masukkan password"
              :class="{ 'ring-2 ring-red-600' : sumbitted && $v.login.password.$error }"
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
          <div class="flex justify-between mb-4">
            <div class="flex items-center">
              <input
                v-model="rememberMe"
                name="remember"
                type="checkbox"
                class="border-gray-300 rounded shadow-sm
                  dark:bg-gray-900 text-primary focus:border-indigo-300 focus:ring
                  focus:ring-indigo-200 focus:ring-opacity-50"
              >
              <span class="this.errors.login.email = 'Email tidak boleh kosong'text-sm ml-2 text-gray-700 dark:text-gray-300">Remember Me</span>
            </div>
            <a href="/" class="text-sm text-gray-600 dark:text-gray-400 hover:underline">
              Lupa Password?
            </a>
          </div>
          <button
            class="text-white w-full py-2.5 rounded-lg text-sm shadow-sm font-semibold text-center inline-block"
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
      </form>
      <div class="py-5 text-center whitespace-nowrap text-gray-500">
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
      rememberMe: false,
      sumbitted: false
    }
  },
  methods: {
    userLogin () {
      this.sumbitted = true
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.loading = true
        this.$auth.loginWith('local', {
          data: this.login
        }).then(() => {
          this.$router.push('/dashboard')
        }).catch((err) => {
          this.loading = false
          alert(err)
        })
      }
    }
  }
}
</script>

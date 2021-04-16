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
              v-model="login.email"
              type="text"
              name="email"
              ref="email"
              class="border rounded-lg px-3 py-2 mt-1 text-sm w-full focus:ring-2
              focus:ring-blue-600 focus:outline-none"
              placeholder="user@atmakoreanbbq.com"
              :class="{ 'ring-2 ring-red-600' : $v.login.email.$dirty && !$v.login.email.required }"
            >
            <span v-if="$v.login.email.$dirty && !$v.login.email.required" class="text-xs text-red-500">
              Email tidak boleh kosong
            </span>
          </div>
          <div class="mb-3">
            <label class="font-semibold text-sm text-gray-600 pb-1 block">Password</label>
            <input
              v-model="login.password"
              type="password"
              name="password"
              ref="password"
              class="border rounded-lg px-3 py-2 mt-1 text-sm w-full focus:ring-2
              focus:ring-blue-600 focus:outline-none"
              placeholder="Masukkan password"
              :class="{ 'ring-2 ring-red-600' : $v.login.password.$dirty && !$v.login.password.required }"
            >
            <span v-if="$v.login.password.$dirty && !$v.login.password.required" class="text-xs text-red-500">
              Password tidak boleh kosong
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
            class="hover:bg-red-600 focus:bg-red-700 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
            :class="[ loading ? 'bg-red-100' : 'bg-red-500 focus:shadow-sm focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 focus:outline-none' ]"
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
  name: 'Login',
  validations: {
    login: {
      email: { required, email, maxLength: maxLength(50) },
      password: { required, minLength: minLength(8), maxLength: maxLength(72) }
    }
  },
  data () {
    return {
      login: {
        email: 'owner@atmakoreanbbq.com',
        password: 'password'
      },
      errors: {
        login: {
          email: '',
          password: ''
        }
      },
      loading: false,
      rememberMe: false
    }
  },
  methods: {
    userLogin () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.loading = true
        this.$auth.loginWith('local', {
          data: this.login
        }).then(() => {
          this.$router.push('/')
        }).catch((err) => {
          alert(err)
        }).finally(() => {
          this.loading = false
        })
      }
    }
  }
}
</script>

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
      <div class="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
        <div class="px-5 py-7">
          <label class="font-semibold text-sm text-gray-600 pb-1 block">E-mail</label>
          <input
            v-model="login.email"
            type="text"
            name="email"
            class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full focus:ring-2
              focus:ring-blue-600 focus:outline-none"
            placeholder="user@atmakoreanbbq.com"
          >
          <label class="font-semibold text-sm text-gray-600 pb-1 block">Password</label>
          <input
            v-model="login.password"
            type="password"
            name="password"
            class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full focus:ring-2
              focus:ring-blue-600 focus:outline-none"
            placeholder="Masukkan password"
          >
          <div class="flex justify-between mb-4">
            <div class="flex items-center">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="border-gray-300 rounded shadow-sm
                  dark:bg-gray-900 text-primary focus:border-indigo-300 focus:ring
                  focus:ring-indigo-200 focus:ring-opacity-50"
              >
              <span class="text-sm ml-2 text-gray-700 dark:text-gray-300">Remember Me</span>
            </div>
            <a href="/" class="text-sm text-gray-600 dark:text-gray-400 hover:underline">
              Lupa Password?
            </a>
          </div>
          <button
            type="button"
            class="transition duration-200 bg-red-500 hover:bg-red-600 focus:bg-red-700 focus:shadow-sm focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 focus:outline-none text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
            @click="userLogin"
          >
            <span class="inline-block mr-2">Login</span>
          </button>
        </div>
      </div>
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
export default {
  data () {
    return {
      login: {
        email: '',
        password: ''
      },
      loading: false,
      rememberMe: false
    }
  },
  methods: {
    userLogin () {
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
</script>

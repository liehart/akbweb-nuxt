<template>
  <div class="flex">
    <aside
      class="relative h-screen flex flex-col bg-gray-100 w-72 flex-shrink-0 sticky top-0 overflow-y-auto overflow-x-hidden gap-10"
    >
      <div class="w-full mt-5 mx-5">
        <div class="font-bold text-4xl text-blue-500">
          Dashboard.
        </div>
        <div class="text-gray-700 font-medium">
          Atma Korean BBQ
        </div>
      </div>
      <div id="menu" class="w-full">
        <div
          v-for="(data, key) in links"
          v-show="$auth.hasScope(data.scope) || data.scope === '*'"
          :key="key"
        >
          <div
            class="transition duration-200 flex items-center justify-between my-1 px-5 py-3 select-none"
            :class="[active === data.link ? 'text-blue-500 bg-gray-200 cursor-pointer' : 'text-gray-600 hover:bg-gray-200 cursor-pointer']"
            @click="data.sub ? showDropdown(key) : goToPage(data)"
          >
            <div class="flex">
              <div class="h-5 w-5 my-auto hover:opacity-100">
                <font-awesome-icon :icon="data.icon" class="h-5 w-5 my-auto" />
              </div>
              <div class="ml-2 my-auto text-sm hover:opacity-100">
                {{ data.name }}
              </div>
            </div>
            <div v-if="data.sub && !data.show" class="text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div v-else-if="data.sub && data.show" class="text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <div v-if="data.sub && data.show">
            <div
              v-for="(f, k) in data.sub"
              :key="k"
              class="transition duration-200 flex items-center justify-between my-1 px-10 py-3 select-none"
              :class="[active === f.link ? 'text-blue-500 bg-gray-200 cursor-pointer' : 'text-gray-400 hover:bg-gray-200 cursor-pointer']"
              @click="goToPage(f)"
            >
              <div class="ml-2 my-auto text-sm hover:opacity-100">
                {{ f.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
    <main class="w-full bg-gray-50">
      <div class="z-30 flex py-5 px-10 bg-white border-b border-gray-200 justify-between sticky top-0">
        <div class="my-auto">
          <nav class="text-black" aria-label="Breadcrumb">
            <ol class="list-none p-0 inline-flex">
              <li v-for="(data, key) in crumbs.list" :key="key" class="text-gray-900 flex items-center align-middle">
                <NuxtLink :to="data.link">
                  <span v-if="key === 0">
                    <font-awesome-icon icon="home" class="my-auto" />
                  </span>
                  <span v-else>
                    {{ data.name }}
                  </span>
                </NuxtLink>
                <svg v-if="key < crumbs.list.length - 1" class="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" /></svg>
              </li>
            </ol>
          </nav>
        </div>
        <div class="relative flex gap-4">
          <div class="my-auto text-right">
            <div>
              <h1 class="text-gray-900 font-bold">
                {{ user.name }}
              </h1>
            </div>
            <div class="text-xs text-gray-500">
              {{ user.email }} - <span class="font-bold">{{ user.role.name }}</span>
            </div>
          </div>
          <div
            class="flex-shrink-0 flex align-middle h-10 gap-2 cursor-pointer"
            @click="isOpen = !isOpen"
          >
            <div class="my-auto">
              <img
                v-if="user.image_path"
                class="h-10 w-10 rounded-full"
                :src="user.image_path"
                alt=""
              >
              <div
                v-else
                class="h-10 w-10 rounded-full bg-gray-500 flex justify-center items-center
                    text-white"
              >
                {{ user.name[0].toUpperCase() }}
              </div>
            </div>
            <div class="my-auto h-5 w-5 text-gray-500">
              <font-awesome-icon icon="chevron-down" />
            </div>
          </div>
          <button v-if="isOpen" tabindex="-1" class="fixed top-0 inset-0 h-full w-full bg-black opacity-0 cursor-default" @click="isOpen = false" />
          <div v-if="isOpen" class="absolute top-10 border border-gray-200 right-0 w-48 py-2 mt-2 rounded-lg bg-white shadow-xl">
            <a
              class="text-sm text-gray-900 hover:bg-red-600 hover:text-white block px-4
              py-2 cursor-pointer"
              @click="accountSetting()"
            >
              Account Settings
            </a>
            <a
              class="w-full text-left text-sm text-gray-900 hover:bg-red-600 hover:text-white block px-4 py-2 cursor-pointer"
              @click="logoutUser"
            >
              Keluar
            </a>
          </div>
        </div>
      </div>
      <div class="px-10 mt-10 mb-20">
        <Nuxt />
      </div>
    </main>
  </div>
</template>
<script>
// import Pusher from 'pusher-js'
//
// const pusher = new Pusher('48f1e0b5f3e9d848a375', {
//   cluster: 'ap1',
//   encrypted: false
// })

export default {
  data () {
    return {
      isOpen: false,
      user: this.$auth.user.user,
      messages: [],
      active: '/dashboard',
      links: [
        {
          icon: 'home',
          link: '/dashboard',
          name: 'Dashboard',
          scope: '*'
        },
        {
          icon: 'user-tag',
          link: '/dashboard/jabatan',
          name: 'Jabatan',
          scope: 'role.read'
        },
        {
          icon: 'user',
          link: '/dashboard/pegawai',
          name: 'Pegawai',
          scope: 'employee.read'
        },
        {
          icon: 'chair',
          link: '/dashboard/meja',
          name: 'Meja',
          scope: 'table.read'
        },
        {
          icon: 'users',
          link: '/dashboard/pelanggan',
          name: 'Pelanggan',
          scope: 'customer.read'
        },
        {
          icon: 'bookmark',
          link: '/dashboard/reservasi',
          name: 'Reservasi',
          scope: 'reservation.read'
        },
        {
          icon: 'list',
          link: '/dashboard/pesanan',
          name: 'Pesanan',
          scope: 'order.read'
        },
        {
          icon: 'money-check-alt',
          link: '/dashboard/transaksi',
          name: 'Transaksi',
          scope: 'transaction.read',
          show: false,
          sub: [
            {
              link: '/dashboard/stok/masuk',
              name: 'Daftar Transaksi',
              scope: 'stock.read'
            },
            {
              link: '/dashboard/stok/keluar',
              name: 'Kelola Data Kartu',
              scope: 'stock.read'
            }
          ]
        },
        {
          icon: 'utensils',
          link: '/dashboard/menu',
          name: 'Menu',
          scope: 'menu.read'
        },
        {
          icon: 'truck-loading',
          link: '/dashboard/bahan',
          name: 'Bahan',
          scope: 'ingredient.read'
        },
        {
          icon: 'history',
          name: 'Stok',
          scope: 'stock.read',
          show: false,
          sub: [
            {
              link: '/dashboard/stok/masuk',
              name: 'Stok Masuk',
              scope: 'stock.read'
            },
            {
              link: '/dashboard/stok/keluar',
              name: 'Stok Keluar',
              scope: 'stock.read'
            }
          ]
        },
        {
          icon: 'print',
          link: '/dashboard/laporan',
          name: 'Laporan',
          scope: 'report.read'
        }
      ]
    }
  },
  head () {
    return {
      title: 'Dashboard'
    }
  },
  computed: {
    crumbs () {
      const list = []
      const rawCrumbs = this.$route.fullPath.substring(1).split('/')
      let path = ''
      rawCrumbs.forEach((p) => {
        path = path + '/' + p
        const bold = p === rawCrumbs.lastItem
        list.push({ link: path, name: p[0].toUpperCase() + p.slice(1), bold })
      })
      return { list }
    }
  },
  mounted () {
    // const channel = pusher.subscribe('customer-created')
    // channel.bind('customer-created', (data) => {
    //   console.log(data)
    //   this.showToast(data)
    // })
  },
  beforeDestroy () {
    // pusher.unsubscribe('customer-created')
    // pusher.disconnect()
  },
  methods: {
    goToPage (data) {
      this.active = data.link
      this.$router.push(data.link)
    },
    showToast (data) {
      this.$toast.show({
        title: data.title,
        message: data.message,
        timeout: false,
        primary: { label: 'Lihat', action: () => this.$router.push('/dashboard/pesanan/' + data.token) },
        secondary: { label: 'Tutup', action: () => {} }
      })
    },
    logoutUser () {
      this.isOpen = false
      this.$auth.logout().then(() => {
        this.$router.push('/login')
      })
    },
    accountSetting () {
      this.$router.push('/dashboard/profil')
      this.isOpen = false
    },
    showDropdown (key) {
      this.links[key].show = !this.links[key].show
    }
  }
}
</script>

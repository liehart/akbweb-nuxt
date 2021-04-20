<template>
  <div class="h-screen flex">
    <div class="bg-gray-900 w-72 flex-shrink-0">
      <div class="flex align-middle text-gray-200 p-5">
        <img src="~/assets/logo.svg" class="w-16 my-auto">
        <div class="my-auto ml-2">
          <p class="font-bold text-xl">
            Atma Korean BBQ
          </p>
          <p>Dashboard</p>
        </div>
      </div>
      <div class="my-5">
        <div
          v-for="(data, key) in links"
          :key="key"
          class="transition duration-200 flex mx-5 my-1 text-gray-200 py-2 px-4
          rounded hover:bg-gray-800 cursor-pointer"
        >
          <div class="h-5 w-5 my-auto">
            <font-awesome-icon :icon="data.icon" class="h-5 w-5 my-auto" />
          </div>
          <NuxtLink :to="data.link" class="ml-2 my-auto text-sm">
            {{ data.name }}
          </NuxtLink>
        </div>
      </div>
      <div class="absolute bottom-0 py-5 px-5 bg-gray-800 w-72 flex leading-4 align-middle text-white align-bottom justify-between">
        <div class="flex">
          <img src="https://yt3.ggpht.com/ytc/AAUvwniSE6DekSsnMjW4WndYFVdKtTHjbmVnp_fT8ly7Uw=s88-c-k-c0x00ffffff-no-rj" class="rounded-full w-10 my-auto">
          <div class="my-auto ml-2">
            <h1 class="text-gray-100 truncate overflow-ellipsis w-44">
              {{ user.name }}
            </h1>
            <p class="text-xs text-gray-300">
              {{ user.role.name }}
            </p>
          </div>
        </div>
        <div class="my-auto text-gray-300">
          <div class="h-5 w-5 my-auto">
            <font-awesome-icon icon="cog" class="h-5 w-5 my-auto" />
          </div>
        </div>
      </div>
    </div>
    <div class="flex-1 flex overflow-hidden bg-gray-100">
      <div class="flex-1 px-10 overflow-y-scroll">
        <div class="max-w-5xl mx-auto mb-20">
          <nav class="text-black mt-8 mb-4" aria-label="Breadcrumb">
            <ol class="list-none p-0 inline-flex">
              <li v-for="(data, key) in crumbs.list" :key="key" class="flex items-center">
                <NuxtLink :to="data.link" :class="[data.bold ? 'font-bold' : '']">
                  {{ data.name }}
                </NuxtLink>
                <svg v-if="key < crumbs.list.length - 1" class="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" /></svg>
              </li>
            </ol>
          </nav>
          <Nuxt />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      user: this.$auth.user,
      links: [
        {
          icon: 'home',
          link: '/dashboard',
          name: 'Dashboard'
        },
        {
          icon: 'user',
          link: '/dashboard/pegawai',
          name: 'Pegawai'
        },
        {
          icon: 'users',
          link: '/dashboard/pelanggan',
          name: 'Pelanggan'
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
  }
}
</script>

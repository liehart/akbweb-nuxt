<template>
  <div>
    <div class="mb-5 flex justify-between items-center">
      <h1 class="text-4xl font-medium tracking-normal">
        Menu Kelola Stok
      </h1>
    </div>
    <div class="grid grid-cols-2 gap-5">
      <div class="col-span-1">
        <NuxtLink to="/dashboard/stok/masuk">
          <div class="transition duration-200 rounded-md bg-white p-10 items-center justify-center text-center text-xl hover:bg-red-50 hover:text-red-700">
            Stok Masuk
          </div>
        </NuxtLink>
      </div>
      <div class="col-span-1">
        <NuxtLink to="/dashboard/stok/keluar">
          <div class="transition duration-200 rounded-md bg-white p-10 items-center justify-center text-center text-xl hover:bg-red-50 hover:text-red-700">
            Stok Keluar
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Stock',
  middleware: 'stock/read'
}
</script>

<style scoped>

</style>

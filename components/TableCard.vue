<template>
  <div class="relative rounded-md shadow-md">
    <div
      class="grid grid-cols-6 p-5 border-l-8 rounded-md"
      :class="[ data.is_empty ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50' ]"
    >
      <div class="flex col-span-6 justify-between">
        <div class="flex">
          <div class="text-xl font-bold mr-2">
            {{ data.table_number }}
          </div>
          <div class="col-span-4 flex gap-2">
            <div>
              <span v-if="!data.is_empty" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                Kosong
              </span>
              <span v-else class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                Terisi
              </span>
            </div>
            <div v-if="data.reservation.length > 0" class="flex gap-2">
              <div v-for="(value, key) in data.reservation" :key="key">
                <span v-if="value.session === 'lunch'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                  Lunch
                </span>
                <span v-else-if="value.session === 'dinner'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                  Dinner
                </span>
                <span v-else class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                  Tanpa Reservasi
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="justify-end text-right">
          <button
            class="text-gray-500 hover:text-gray-700 text-sm focus:outline-none"
            @click="isOpen = !isOpen"
          >
            <font-awesome-icon icon="ellipsis-v" />
          </button>
        </div>
        <button v-if="isOpen" tabindex="-1" class="fixed top-0 inset-0 h-full w-full bg-black opacity-0 cursor-default" @click="isOpen = false" />
        <div v-if="isOpen" class="z-50 absolute top-10 border border-gray-200 right-0 w-48 py-2 mt-2 rounded-lg bg-white shadow-xl">
          <NuxtLink
            :to="`/dashboard/meja/` + data.table_number"
            class="text-sm text-gray-900 hover:bg-red-600 hover:text-white block px-4
          py-2 cursor-pointer"
          >
            Detail Meja
          </NuxtLink>
          <!--        <a-->
          <!--          class="w-full text-left text-sm text-gray-900 hover:bg-red-600 hover:text-white block px-4 py-2 cursor-pointer"-->
          <!--        >-->
          <!--          Lihat Pesanan-->
          <!--        </a>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableCard',
  props: {
    data: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      isOpen: false
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <div
    class="relative rounded-md shadow p-5 hover:bg-opacity-80 cursor-pointer"
    :class="[
      getTableStatus === 'Terisi'
        ? 'bg-red-600'
        : getTableStatus === 'Kosong'
          ? 'bg-green-600'
          : 'bg-red-400'
    ]"
  >
    <div class="font-bold text-white">
      Meja {{ data.table_number }}
    </div>
    <div class="text-sm text-white">
      {{ getTableStatus }}
    </div>
    <div v-if="data.reservation.length > 0" class="text-white">
      <div class="mt-1 text-sm font-bold">
        Reservasi ({{ data.reservation.length }})
      </div>
      <div class="flex-col text-sm">
        <div v-for="(reservation, key) in data.reservation" :key="key">
          {{ reservation.customer.name }} - {{ getSessionText(reservation.session) }}
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
  },
  computed: {
    getTableStatus () {
      return this.data.is_empty
        ? 'Terisi'
        : 'Kosong'
    }
  },
  methods: {
    getSessionText (text) {
      if (text === 'lunch') {
        return 'Makan Siang'
      }
      return 'Makan Malam'
    }
  }
}
</script>

<style scoped>

</style>

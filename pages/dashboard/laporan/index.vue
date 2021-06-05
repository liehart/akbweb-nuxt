<template>
  <div class="max-w-screen-lg m-auto">
    <div class="mb-5 flex justify-between items-center">
      <div>
        <h1 class="text-4xl font-medium tracking-normal">
          Laporan Operasional
        </h1>
        <p>Stakeholder AKB dapat memperoleh laporan terkini tentang operasional restoran disini.</p>
      </div>
    </div>
    <div class="bg-white p-5 rounded-md">
      <div class="grid grid-cols-2 gap-5">
        <div class="rounded-md border border-gray-500 p-5">
          <p class="font-bold">
            Laporan Stok Bahan Setiap Kategori
          </p>
          <p class="text-sm">
            Menampilkan laporan stok bahan setiap kategori dengan pilihan rentang waktu (tanggal)
          </p>
          <div class="flex gap-5 mt-5">
            <div class="w-full">
              <t-datepicker v-model="form.date" placeholder="Pilih range tanggal" range />
            </div>
            <div>
              <Button
                :disabled="this.form.date.length < 2"
                :loading="loading[0]"
                label="Cetak"
                variant="secondary"
                :icon="true"
                @click="cetakStokCustom"
              >
                <template #icon>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clip-rule="evenodd" />
                  </svg>
                </template>
              </Button>
            </div>
          </div>
        </div>
        <div class="rounded-md border border-gray-500 p-5">
          <p class="font-bold">
            Laporan Stok Bahan Tertentu Bulanan
          </p>
          <p class="text-sm">
            Menampilkan laporan stok bahan tertentu pada bulan dan tahun tertentu
          </p>
          <div class="flex gap-2 mt-5 text-sm w-full">
            <t-rich-select
              v-model="form.bulan"
              :hide-search-box="true"
              placeholder="Bulan"
              :options="[1,2,3,4,5,6,7,8,9,10,11,12]"
              variant="simple"
              class="w-full"
            />
            <t-rich-select
              v-model="form.tahun1"
              placeholder="Tahun"
              :hide-search-box="true"
              :options="[2019, 2020, 2021]"
              variant="simple"
              class="w-full"
            />
          </div>
          <div class="flex gap-5 mt-2">
            <div class="w-full text-sm">
              <t-rich-select
                v-model="form.menu_id"
                :fetch-options="fetchOptions"
                placeholder="Pilih Bahan"
                text-attribute="name"
              >
                <template
                  slot="dropdownDown"
                >
                  <div class="mx-4 text-xs my-3">
                    Terdapat {{ selectCount }} pilihan bahan. Hanya menampilkan 5 bahan terbaru, gunakan search untuk menemukan bahan yang lain.
                  </div>
                </template>
              </t-rich-select>
            </div>
            <div>
              <Button
                :disabled="!(form.tahun1 > 0 && form.bulan > 0 && form.menu_id > 0)"
                :loading="loading[1]"
                label="Cetak"
                variant="secondary"
                :icon="true"
                @click="cetakStokTertentu"
              >
                <template #icon>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clip-rule="evenodd" />
                  </svg>
                </template>
              </Button>
            </div>
          </div>
        </div>
        <div class="rounded-md border border-gray-500 p-5">
          <p class="font-bold">
            Laporan Penjualan Bulanan
          </p>
          <p class="text-sm">
            Menampilkan laporan penjualan dengan pada bulan dan tahun tertentu
          </p>
          <div class="flex gap-5 mt-2">
            <div class="flex gap-5 w-full text-sm">
              <t-rich-select
                v-model="form.bulan2"
                :hide-search-box="true"
                placeholder="Bulan"
                :options="[1,2,3,4,5,6,7,8,9,10,11,12]"
                variant="simple"
                class="w-full"
              />
              <t-rich-select
                v-model="form.tahun[6]"
                placeholder="Tahun"
                :hide-search-box="true"
                :options="[2019, 2020, 2021]"
                variant="simple"
                class="w-full"
              />
            </div>
            <div>
              <Button
                :disabled="!(form.tahun[6] > 0 && form.bulan2 > 0)"
                :loading="loading[8]"
                label="Cetak"
                variant="secondary"
                :icon="true"
                @click="cetakPenjualan()"
              >
                <template #icon>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clip-rule="evenodd" />
                  </svg>
                </template>
              </Button>
            </div>
          </div>
        </div>
        <div class="rounded-md border border-gray-500 p-5">
          <p class="font-bold">
            Laporan Penjualan Tahunan
          </p>
          <p class="text-sm">
            Menampilkan laporan penjualan setiap pada tahun tertentu
          </p>
          <div class="flex gap-5 mt-5">
            <div class="w-full text-sm">
              <t-rich-select
                v-model="form.tahun[5]"
                placeholder="Tahun"
                :hide-search-box="true"
                :options="[2019, 2020, 2021]"
                variant="simple"
                class="w-full"
              />
            </div>
            <div>
              <Button
                :disabled="!(form.tahun[5] > 0)"
                :loading="loading[7]"
                label="Cetak"
                variant="secondary"
                :icon="true"
                @click="cetakPenjualanTahunan();"
              >
                <template #icon>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clip-rule="evenodd" />
                  </svg>
                </template>
              </Button>
            </div>
          </div>
        </div>
        <div class="rounded-md border border-gray-500 p-5">
          <p class="font-bold">
            Laporan Pengeluaran Tahunan
          </p>
          <p class="text-sm">
            Menampilkan laporan pengeluaran pada tahun tertentu
          </p>
          <div class="flex gap-5 mt-5">
            <div class="w-full text-sm">
              <t-rich-select
                v-model="form.tahun3"
                placeholder="Tahun"
                :hide-search-box="true"
                :options="[2019, 2020, 2021]"
                variant="simple"
                class="w-full"
              />
            </div>
            <div>
              <Button
                :disabled="!(this.form.tahun3 > 0)"
                :loading="loading[3]"
                label="Cetak"
                variant="secondary"
                :icon="true"
                @click="cetakPengeluaran()"
              >
                <template #icon>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clip-rule="evenodd" />
                  </svg>
                </template>
              </Button>
            </div>
          </div>
        </div>
        <div class="rounded-md border border-gray-500 p-5">
          <p class="font-bold">
            Laporan Pengeluaran dalam Rentang Tahun
          </p>
          <p class="text-sm">
            Menampilkan laporan pengeluaran pada rentang tahun tertentu
          </p>
          <div class="flex gap-5 mt-5">
            <div class="flex w-full gap-5 text-sm">
              <t-rich-select
                v-model="form.tahun[0]"
                placeholder="Tahun Mulai"
                :hide-search-box="true"
                :options="[2019, 2020, 2021]"
                variant="simple"
                class="w-full"
              />
              <t-rich-select
                v-model="form.tahun[1]"
                placeholder="Tahun Selesai"
                :hide-search-box="true"
                :options="[2019, 2020, 2021]"
                variant="simple"
                class="w-full"
              />
            </div>
            <div>
              <Button
                :disabled="!(form.tahun[0] > 0 && form.tahun[1] > 0)"
                :loading="loading[6]"
                label="Cetak"
                variant="secondary"
                :icon="true"
                @click="cetakPengeluaranTahunan()"
              >
                <template #icon>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clip-rule="evenodd" />
                  </svg>
                </template>
              </Button>
            </div>
          </div>
        </div>
        <div class="rounded-md border border-gray-500 p-5">
          <p class="font-bold">
            Laporan Pendapatan Tahunan
          </p>
          <p class="text-sm">
            Menampilkan laporan pendapatan pada tahun tertentu
          </p>
          <div class="flex gap-5 mt-5">
            <div class="w-full text-sm">
              <t-rich-select
                v-model="form.tahun2"
                placeholder="Tahun"
                :hide-search-box="true"
                :options="[2019, 2020, 2021]"
                variant="simple"
                class="w-full"
              />
            </div>
            <div>
              <Button
                :disabled="!(this.form.tahun2 > 0)"
                :loading="loading[5]"
                label="Cetak"
                variant="secondary"
                :icon="true"
                @click="cetakPenPeng('pendapatan');"
              >
                <template #icon>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clip-rule="evenodd" />
                  </svg>
                </template>
              </Button>
            </div>
          </div>
        </div>
        <div class="rounded-md border border-gray-500 p-5">
          <p class="font-bold">
            Laporan Pendapatan dalam Rentang Tahun
          </p>
          <p class="text-sm">
            Menampilkan laporan pendapatan pada rentang tahun tertentu
          </p>
          <div class="flex gap-5 mt-5">
            <div class="flex w-full gap-5 text-sm">
              <t-rich-select
                v-model="form.tahun[2]"
                placeholder="Tahun Mulai"
                :hide-search-box="true"
                :options="[2019, 2020, 2021]"
                variant="simple"
                class="w-full"
              />
              <t-rich-select
                v-model="form.tahun[3]"
                placeholder="Tahun Selesai"
                :hide-search-box="true"
                :options="[2019, 2020, 2021]"
                variant="simple"
                class="w-full"
              />
            </div>
            <div>
              <Button
                :disabled="!(form.tahun[2] > 0 && form.tahun[3] > 0)"
                :loading="loading[4]"
                label="Cetak"
                variant="secondary"
                :icon="true"
                @click="cetakPendapatanTahunan()"
              >
                <template #icon>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clip-rule="evenodd" />
                  </svg>
                </template>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import queryString from 'query-string'

export default {
  middleware: 'ingredient/read',
  data () {
    return {
      form: {
        name: '',
        unit: '',
        date: [],
        menu_id: null,
        bulan: null,
        bulan2: null,
        tahun1: null,
        tahun2: null,
        tahun3: null,
        tahun: []
      },
      loading: [false, false, false, false, false, false]
    }
  },
  head () {
    return {
      title: 'Laporan | Atma Korean BBQ  '
    }
  },
  methods: {
    fetchOptions (q) {
      const filter = {
        query: q,
        select: 'yes',
        show: 5,
        sort: 'created_at',
        asc: false
      }
      const query = queryString.stringify({ v: JSON.stringify(filter) })
      return this.$axios.$get(`menu?${query}`).then(res => ({ results: res.data.data }))
    },
    async cetakStokCustom () {
      if (this.form.date.length === 2) {
        this.loading[0] = true
        try {
          await this.$axios.get(`http://localhost/stock/${this.form.date[0]}/${this.form.date[1]}`).then((res) => {
            this.loading[0] = false
            window.open(`http://localhost/stock/${this.form.date[0]}/${this.form.date[1]}`, '_blank').focus()
          })
        } catch (e) {
          this.$toast.show({
            type: 'danger',
            title: 'Gagal Memuat Data',
            message:
              e.response.data.message || e.response.data || e.message || e,
            timeout: 3
          })
        } finally {
          this.form.date = []
          this.loading[0] = false
        }
      } else {
        console.log('error')
      }
      this.loading[0] = false
    },
    async cetakStokTertentu () {
      if (this.form.tahun1 > 0 && this.form.bulan > 0 && this.form.menu_id > 0) {
        this.loading[1] = true
        try {
          await this.$axios.get(`http://localhost/stockMenu/${this.form.menu_id}/${this.form.bulan}/${this.form.tahun1}`).then((res) => {
            this.loading[1] = false
            window.open(`http://localhost/stockMenu/${this.form.menu_id}/${this.form.bulan}/${this.form.tahun1}`, '_blank').focus()
          })
        } catch (e) {
          this.$toast.show({
            type: 'danger',
            title: 'Gagal Memuat Data',
            message:
              e.response.data.message || e.response.data || e.message || e,
            timeout: 3
          })
        } finally {
          this.form.menu_id = null
          this.form.bulan = null
          this.form.tahun1 = null
          this.loading[1] = false
        }
      } else {
        console.log('error')
      }
      this.loading[1] = false
    },
    async cetakPenPeng (resp) {
      if (this.form.tahun2 > 0) {
        this.loading[5] = true
        try {
          await this.$axios.get(`http://localhost/${resp}/${this.form.tahun2}`).then((res) => {
            this.loading[5] = false
            window.open(`http://localhost/${resp}/${this.form.tahun2}`, '_blank').focus()
          })
        } catch (e) {
          this.$toast.show({
            type: 'danger',
            title: 'Gagal Memuat Data',
            message:
              e.response.data.message || e.response.data || e.message || e,
            timeout: 3
          })
        } finally {
          this.form.tahun2 = null
          this.loading[5] = false
        }
      } else {
        console.log('error')
      }
      this.loading[5] = false
    },
    async cetakPengeluaran () {
      if (this.form.tahun3 > 0) {
        this.loading[3] = true
        try {
          await this.$axios.get(`http://localhost/pengeluaran/${this.form.tahun3}`).then((res) => {
            this.loading[3] = false
            window.open(`http://localhost/pengeluaran/${this.form.tahun3}`, '_blank').focus()
          })
        } catch (e) {
          this.$toast.show({
            type: 'danger',
            title: 'Gagal Memuat Data',
            message:
              e.response.data.message || e.response.data || e.message || e,
            timeout: 3
          })
        } finally {
          this.form.tahun2 = null
          this.loading[3] = false
        }
      } else {
        console.log('error')
      }
      this.loading[3] = false
    },
    async cetakPengeluaranTahunan () {
      if (this.form.tahun[0] > 0 && this.form.tahun[1] > 0) {
        this.loading[6] = true
        try {
          await this.$axios.get(`http://localhost/pengeluaranTahun/${this.form.tahun[0]}/${this.form.tahun[1]}`).then((res) => {
            this.loading[6] = false
            window.open(`http://localhost/pengeluaranTahun/${this.form.tahun[0]}/${this.form.tahun[1]}`, '_blank').focus()
          })
        } catch (e) {
          this.$toast.show({
            type: 'danger',
            title: 'Gagal Memuat Data',
            message:
              e.response.data.message || e.response.data || e.message || e,
            timeout: 3
          })
        } finally {
          this.form.tahun2 = null
          this.loading[6] = false
        }
      } else {
        console.log('error')
      }
      this.loading[6] = false
    },
    async cetakPendapatanTahunan () {
      if (this.form.tahun[2] > 0 && this.form.tahun[3] > 0) {
        this.loading[4] = true
        try {
          await this.$axios.get(`http://localhost/pendapatanTahun/${this.form.tahun[2]}/${this.form.tahun[3]}`).then((res) => {
            this.loading[4] = false
            window.open(`http://localhost/pendapatanTahun/${this.form.tahun[2]}/${this.form.tahun[3]}`, '_blank').focus()
          })
        } catch (e) {
          this.$toast.show({
            type: 'danger',
            title: 'Gagal Memuat Data',
            message:
              e.response.data.message || e.response.data || e.message || e,
            timeout: 3
          })
        } finally {
          this.form.tahun2 = null
          this.loading[4] = false
        }
      } else {
        console.log('error')
      }
      this.loading[4] = false
    },
    async cetakPenjualanTahunan () {
      if (this.form.tahun[5] > 0) {
        this.loading[7] = true
        try {
          await this.$axios.get(`http://localhost/penjualanTahun/${this.form.tahun[5]}`).then((res) => {
            this.loading[7] = false
            window.open(`http://localhost/penjualanTahun/${this.form.tahun[5]}`, '_blank').focus()
          })
        } catch (e) {
          this.$toast.show({
            type: 'danger',
            title: 'Gagal Memuat Data',
            message:
              e.response.data.message || e.response.data || e.message || e,
            timeout: 3
          })
        } finally {
          this.form.tahun2 = null
          this.loading[7] = false
        }
      } else {
        console.log('error')
      }
      this.loading[7] = false
    },
    async cetakPenjualan () {
      if (this.form.tahun[6] > 0 && this.form.bulan2 > 0) {
        this.loading[8] = true
        try {
          await this.$axios.get(`http://localhost/penjualan/${this.form.bulan2}/${this.form.tahun[6]}`).then((res) => {
            this.loading[8] = false
            window.open(`http://localhost/penjualan/${this.form.bulan2}/${this.form.tahun[6]}`, '_blank').focus()
          })
        } catch (e) {
          this.$toast.show({
            type: 'danger',
            title: 'Gagal Memuat Data',
            message:
              e.response.data.message || e.response.data || e.message || e,
            timeout: 3
          })
        } finally {
          this.form.tahun2 = null
          this.loading[8] = false
        }
      } else {
        console.log('error')
      }
      this.loading[8] = false
    }
  }
}
</script>

<template>
  <div>
    <div class="mb-5 flex justify-between items-center">
      <h1 class="text-4xl font-medium tracking-normal">
        Menu
      </h1>
      <Button v-if="$auth.hasScope('menu.create')" label="Menu" variant="primary" :icon="true" @click="create">
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
          </svg>
        </template>
      </Button>
    </div>
    <DataTable
      v-model="filter"
      :loading="loading"
      :loading-a-p-i="loadingAPI"
      :data="menus"
      :headers="headers"
      :filters="filters"
    >
      <template #name="{ item }">
        <div class="flex flex-row items-start">
          <div class="w-16 mr-4 flex-shrink-0">
            <div v-if="item.image_path">
              <img class="h-16 w-16 rounded-md object-cover object-center" :src="item.image_path">
            </div>
            <div v-else>
              <img
                class="h-16 w-16 rounded-md"
                src="https://atmakoreanbbq.s3-ap-southeast-1.amazonaws.com/public/no_image.png"
              >
            </div>
          </div>
          <div>
            <div class="text-sm text-gray-500">
              <div class="font-medium">
                {{ item.name }} <span class="italic text-gray-400">(Bahan: {{ item.ingredient.name }})</span>
              </div>
              <div class="text-sm text-gray-400">
                {{ item.description }}
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #menu_type="{ item }">
        <div class="text-sm text-gray-500">
          <div v-if="item.menu_type === 'main'" class="flex">
            Utama
          </div>
          <div v-else-if="item.menu_type === 'side_dish'" class="flex">
            Side Dish
          </div>
          <div v-else-if="item.menu_type === 'drink'" class="flex">
            Minuman
          </div>
        </div>
      </template>
      <template #is_available="{ item }">
        <div class="text-sm text-gray-500 font-medium">
          <div v-if="item.is_available === 1" class="flex gap-2 text-green-500">
            <div class="h-2 w-2 bg-green-500 rounded-full my-auto" />
            Ada
          </div>
          <div v-else class="flex gap-2 text-gray-500">
            <div class="flex flex-col gap-2">
              <div class="flex gap-2 items-center">
                <div class="h-2 w-2 bg-gray-500 rounded-full my-auto" />
                <div>
                  Kosong
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #stock="{ item }">
        <div class="font-medium">
          {{ item.ingredient.remaining_stock.toLocaleString() }} {{ item.ingredient.unit }}
        </div>
        <div v-if="item.serving_size" class="text-xs text-gray-400">
          Sekitar {{ Math.floor((item.ingredient.remaining_stock/item.serving_size)).toLocaleString() }} {{ item.unit }}
        </div>
      </template>
      <template #serving_size="{ item }">
        <div class="flex gap-1">
          <div>
            {{ item.serving_size }} {{ item.ingredient.unit }}
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
          <div>
            1 {{ item.unit }}
          </div>
        </div>
      </template>
      <template #price="{ item }">
        <div class="text-sm text-gray-500">
          <span v-if="item.price > 0">
            {{ formatPrice(item.price) }}
          </span>
          <span v-else>
            Gratis
          </span>
        </div>
      </template>
      <template #actions="{ item }">
        <div class="text-sm text-gray-500 flex gap-2">
          <div
            v-if="$auth.hasScope('menu.update')"
            class="hover:opacity-70 cursor-pointer text-gray-400"
            @click="refresh(item)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
            </svg>
          </div>
          <div
            v-if="$auth.hasScope('menu.update')"
            class="hover:opacity-70 cursor-pointer text-gray-400"
            @click="show(item)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <div
            v-if="$auth.hasScope('menu.update')"
            class="hover:opacity-70 cursor-pointer text-gray-400"
            @click="edit(item)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
              <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
            </svg>
          </div>
          <div
            v-if="$auth.hasScope('menu.delete')"
            class="hover:opacity-70 cursor-pointer text-gray-400"
            @click="setModal(item)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </template>
    </DataTable>
    <Modal v-model="deleteModal.state" class="z-50" @click="deleteAPI">
      <template #title>
        Hapus Menu
      </template>
      <template #body>
        Apakah anda yakin akan menghapus menu <span class="font-bold">{{ deleteModal.data.name }}</span>?
      </template>
    </Modal>
    <Dialog v-model="modal.state" :persistent="true" :loading="modal.loading" class="z-40" @click="modalAction">
      <template #title>
        {{ modal.title }}
      </template>
      <template #body>
        <div class="flex flex-col gap-5">
          <div>
            <label class="block text-sm font-medium text-gray-700">Pilih Bahan</label>
            <t-rich-select
              v-model="form.ingredient_id"
              class="mt-1"
              :options="modal.status === 'edit' ? [form.ingredient] : null"
              :fetch-options="fetchOptions"
              placeholder="Pilih Bahan"
              :variant="submitted ? ($v.form.ingredient_id.$error ? 'danger' : 'success') : null"
              text-attribute="name"
              @blur="$v.form.ingredient_id.$touch()"
              @focus="$v.form.ingredient_id.$touch()"
            >
              <template
                slot="dropdownDown"
              >
                <div class="mx-4 text-xs my-3">
                  Terdapat {{ selectCount }} pilihan bahan. Hanya menampilkan 5 bahan terbaru, gunakan search untuk menemukan bahan yang lain.
                </div>
              </template>
            </t-rich-select>
            <span v-if="!submitted" class="text-xs text-gray-500">
              Bahan yang tertampil hanya bahan yang tidak memiliki pasangan menu
            </span>
            <span v-if="submitted && !$v.form.ingredient_id.required" class="mt-1 text-xs text-red-500">
              Bahan harus dipilih
            </span>
          </div>
          <Input
            v-show="form.ingredient_id"
            v-model="form.serving_size"
            label="Takaran Saji Menu dari Bahan"
            :variant="submitted ? ($v.form.serving_size.$error ? 'error' : 'success') : 'primary'"
            type="number"
            :append="serving_size_unit"
            @blur="$v.form.serving_size.$touch()"
            @focus="$v.form.serving_size.$touch()"
          >
            <template #message>
              <span v-if="submitted && !$v.form.serving_size.required" class="text-xs text-red-500">
                Takaran saji menu tidak boleh kosong
              </span>
              <span v-if="submitted && !$v.form.serving_size.numeric" class="text-xs text-red-500">
                Takaran saji menu tidak valid
              </span>
              <span v-if="submitted && !$v.form.serving_size.between" class="text-xs text-red-500">
                Takaran saji menu harus berada di range (0 - 2.147.483.647)
              </span>
            </template>
          </Input>
          <div>
            <label class="block text-sm font-medium text-gray-700" for="category">
              Kategori Menu
            </label>
            <div class="mt-1 text-sm text-gray-700">
              <t-rich-select
                id="category"
                v-model="form.menu_type"
                placeholder="Pilih kategori menu"
                hide-search-box
                :options="categoryFilterList"
                value-attribute="value"
                text-attribute="name"
                :variant="submitted ? ($v.form.menu_type.$error ? 'danger' : 'success') : null"
              />
            </div>
            <span v-if="submitted && !$v.form.menu_type.required" class="text-xs text-red-500">
              Kategori menu harus dipilih
            </span>
          </div>
          <Input
            v-model="form.name"
            label="Nama Tampilan Menu"
            :variant="submitted ? ($v.form.name.$error ? 'error' : 'success') : 'primary'"
            @blur="$v.form.name.$touch()"
            @focus="$v.form.name.$touch()"
          >
            <template #message>
              <span v-if="submitted && !$v.form.name.required" class="text-xs text-red-500">
                Harap mengisi nama menu
              </span>
            </template>
          </Input>
          <CTextArea
            v-model="form.description"
            label="Deskripsi Menu"
            :variant="submitted ? ($v.form.description.$error ? 'error' : 'success') : 'primary'"
            @blur="$v.form.description.$touch()"
            @focus="$v.form.description.$touch()"
          >
            <template #message>
              <span v-if="submitted && !$v.form.description.required" class="text-xs text-red-500">
                Deskripsi menu tidak boleh kosong
              </span>
              <span v-if="submitted && !$v.form.description.maxLength" class="text-xs text-red-500">
                Deskripsi menu tidak boleh lebih dari 250 karakter
              </span>
            </template>
          </CTextArea>
          <div class="grid grid-cols-2 gap-5">
            <div class="col-span-1">
              <Input
                v-model="form.price"
                label="Harga Jual Menu"
                :variant="submitted ? ($v.form.price.$error ? 'error' : 'success') : 'primary'"
                prepend="Rp."
                type="number"
                @blur="$v.form.price.$touch()"
                @focus="$v.form.price.$touch()"
              >
                <template #message>
                  <span v-if="submitted && !$v.form.price.required" class="text-xs text-red-500">
                    Harga menu tidak boleh kosong
                  </span>
                  <span v-if="submitted && !$v.form.price.numeric" class="text-xs text-red-500">
                    Harga menu tidak valid
                  </span>
                  <span v-if="submitted && !$v.form.price.between" class="text-xs text-red-500">
                    Harga menu harus berada di range (Rp. 0 - Rp. 2.147.483.647)
                  </span>
                </template>
              </Input>
            </div>
            <div class="col-span-1">
              <Input
                v-model="form.unit"
                label="Satuan Menu"
                :variant="submitted ? ($v.form.unit.$error ? 'error' : 'success') : 'primary'"
                @blur="$v.form.unit.$touch()"
                @focus="$v.form.unit.$touch()"
              >
                <template #message>
                  <span v-if="submitted && !$v.form.unit.required" class="text-xs text-red-500">
                    Satuan menu tidak boleh kosong
                  </span>
                  <span v-if="submitted && !$v.form.unit.maxLength" class="text-xs text-red-500">
                    Satuan menu tidak boleh lebih dari 50 karakter
                  </span>
                </template>
              </Input>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Gambar Menu</label>
            <div v-if="!imageData.loaded">
              <div
                class="mt-1 flex justify-center px-3 my-auto h-16 border-2 border-gray-300 border-dashed rounded-md"
                @dragover="dragover"
                @dragleave="dragleave"
                @drop="drop"
              >
                <div class="space-y-1 text-center my-auto items-center">
                  <div class="flex text-sm text-gray-600">
                    <label
                      for="file-upload"
                      class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500
                  focus:outline-none"
                    >
                      <span>Pilih berkas</span>
                      <input
                        id="file-upload"
                        ref="menuImage"
                        name="file-upload"
                        type="file"
                        accept="image/*"
                        class="sr-only"
                      >
                    </label>
                    <p class="pl-1">
                      atau seret kesini
                    </p>
                  </div>
                  <div class="text-xs text-gray-500">
                    PNG, JPG, JPEG hingga 10MB
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <div
                class="mt-1 flex h-full justify-between items-center"
              >
                <div class="flex gap-3 w-full items-center">
                  <div class="flex-shrink-0">
                    <div v-if="!loadingImage">
                      <img class="h-16 w-16 rounded-md object-cover object-center" :src="form.image_path">
                    </div>
                    <div v-else class="relative flex items-center justify-center h-16 w-16 bg-gray-300 rounded-md">
                      <div class="absolute">
                        <div class="sk-chase">
                          <div class="sk-chase-dot" />
                          <div class="sk-chase-dot" />
                          <div class="sk-chase-dot" />
                          <div class="sk-chase-dot" />
                          <div class="sk-chase-dot" />
                          <div class="sk-chase-dot" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div class="font-medium">
                      <div v-if="modal.status === 'edit' && form.image_path">
                        Gambar telah di set
                      </div>
                      <div v-else-if="form.image_path && modal.status === 'create'">
                        Gambar berhasil diunggah
                      </div>
                      <div v-else>
                        Sedang menunggah gambar
                      </div>
                    </div>
                    <div class="text-xs">
                      <div v-if="form.image_path">
                        Hapus untuk mengedit gambar
                      </div>
                      <div v-else>
                        Mohon tunggu
                      </div>
                    </div>
                  </div>
                </div>
                <div class="transition duration-200 mx-5 hover:opacity-70 cursor-pointer hover:text-gray-600 text-gray-400" @click="deleteImage">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script>
import { category, perPageView } from '@/const'
import queryString from 'query-string'
import { between, maxLength, numeric, required } from 'vuelidate/lib/validators'

export default {
  middleware: 'menu/read',
  validations: {
    form: {
      name: {
        required
      },
      unit: {
        required,
        maxLength: maxLength(50)
      },
      description: {
        required,
        maxLength: maxLength(250)
      },
      price: {
        required,
        numeric,
        between: between(0, 2147483647)
      },
      serving_size: {
        required,
        numeric,
        between: between(0, 2147483647)
      },
      menu_type: {
        required
      },
      ingredient_id: {
        required
      }
    }
  },
  data () {
    return {
      loadingImage: false,
      imageData: {
        loaded: false,
        path: ''
      },
      categoryFilterList: category,
      form: {
        name: '',
        unit: '',
        description: '',
        menu_type: '',
        price: '',
        image_path: null,
        ingredient: null,
        ingredient_id: null
      },
      selectCount: 0,
      defaultForm: {
        name: '',
        unit: '',
        description: '',
        menu_type: '',
        price: '',
        image_path: null,
        ingredient_id: null
      },
      submitted: false,
      modal: {
        state: false,
        status: null,
        loading: false,
        title: ''
      },
      deleteModal: {
        state: false,
        data: []
      },
      searchFocus: false,
      isTyping: false,
      search: '',
      serving_size_unit: null,
      loading: true,
      loadingAPI: true,
      menus: [],
      categoryFilter: category,
      perPageViewFilter: perPageView,
      filter: {
        sort: 'name'
      },
      filters: [
        {
          name: 'menu_type',
          label: 'Kategori',
          rules: [
            {
              name: 'Main Course',
              value: 'main'
            },
            {
              name: 'Side Dish',
              value: 'side_dish'
            },
            {
              name: 'Drink',
              value: 'drink'
            }
          ]
        },
        {
          name: 'is_available',
          label: 'Ketersediaan',
          rules: [
            {
              name: 'Tersedia',
              value: 1
            },
            {
              name: 'Tidak Tersedia',
              value: 0
            }
          ]
        }
      ],
      headers: [
        {
          name: 'Nama',
          value: 'name',
          width: '1/3'
        },
        {
          name: 'Kategori',
          value: 'menu_type',
          width: '1/12'
        },
        {
          name: 'Tersedia',
          value: 'is_available',
          width: '1/12'
        },
        {
          name: 'Serving Size',
          value: 'serving_size',
          width: '1/12'
        },
        {
          name: 'Stock',
          value: 'stock',
          width: '1/12'
        },
        {
          name: 'Harga',
          value: 'price',
          width: '1/12'
        },
        {
          name: 'Actions',
          value: 'actions',
          width: '1/12',
          sort: false
        }
      ]
    }
  },
  async fetch () {
    await this.getAPI().then(() => {
      this.loading = false
    })
  },
  head () {
    return {
      title: 'Menu | Atma Korean BBQ  '
    }
  },
  watch: {
    'form.ingredient_id' () {
      this.fetchServingSize(this.form.ingredient_id)
    },
    filter: {
      deep: true,
      handler () {
        if (!this.loadingAPI) {
          this.getAPI()
        }
      }
    }
  },
  methods: {
    modalAction () {
      this.$v.$touch()
      this.submitted = true
      if (!this.$v.$error) {
        if (this.modal.status === 'create') {
          this.createAction()
        } else {
          this.editAction()
        }
      }
    },
    dragover (event) {
      event.preventDefault()
      if (!event.currentTarget.classList.contains('border-indigo-500')) {
        event.currentTarget.classList.add('border-indigo-500')
      }
    },
    dragleave (event) {
      event.currentTarget.classList.remove('border-indigo-500')
    },
    drop (event) {
      event.preventDefault()
      this.$refs.menuImage.files = event.dataTransfer.files
      const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg']
      if (this.$refs.menuImage.files.length > 1) {
        this.$toast.show({
          type: 'danger',
          title: 'Gagal memasukkan gambar',
          message: 'Jumlah file yang bisa diunggah hanya 1.',
          timeout: 3
        })
      } else if (!validImageTypes.includes(this.$refs.menuImage.files[0].type)) {
        this.$toast.show({
          type: 'danger',
          title: 'Gagal memasukkan gambar',
          message: 'File yang diunggah bukan gambar.',
          timeout: 3
        })
      } else {
        this.loadingImage = true
        this.imageData.loaded = true
        const formData = new FormData()
        formData.append('file', this.$refs.menuImage.files[0])
        this.$axios.post('file/menu', formData).then((res) => {
          console.log(res.data.data)
          this.loadingImage = false
          this.form.image_path = res.data.data.path
        }).catch((err) => {
          if (err.response) {
            if (err.response.data.message === 'V_ERR') {
              const errors = err.response.data.data
              Object.keys(errors).forEach((key) => {
                this.$toast.show({
                  type: 'danger',
                  title: 'Error',
                  message: errors[key][0],
                  timeout: 3
                })
              })
            }
          }
        })
      }
      event.currentTarget.classList.remove('border-indigo-500')
    },
    deleteImage () {
      this.imageData.loaded = false
      this.form.image_path = ''
    },
    editAction () {
      this.modal.loading = true
      this.$axios.put(`menu/${this.form.id}`, this.form).then(() => {
        this.modal.state = false
        this.getAPI()
        this.$toast.show({
          type: 'success',
          title: 'Berhasil Mengedit Menu',
          message: 'Menu ' + this.form.name + ' berhasil diedit.',
          timeout: 3
        })
      }).catch((err) => {
        if (err.response) {
          if (err.response.data.message === 'V_ERR') {
            const errors = err.response.data.data
            for (const key in errors) {
              this.$toast.show({
                type: 'danger',
                title: 'Error',
                message: errors[key][0],
                timeout: 3
              })
            }
          }
        }
      }).finally(() => {
        this.modal.loading = false
      })
    },
    createAction () {
      this.modal.loading = true
      this.$axios.post('menu', this.form).then(() => {
        this.modal.state = false
        this.getAPI()
        this.$toast.show({
          type: 'success',
          title: 'Berhasil',
          message: 'Menu ' + this.form.name + ' berhasil dibuat.',
          timeout: 3
        })
      }).catch((err) => {
        if (err.response) {
          if (err.response.data.message === 'V_ERR') {
            const errors = err.response.data.data
            for (const key in errors) {
              this.$toast.show({
                type: 'danger',
                title: 'Error',
                message: errors[key][0],
                timeout: 3
              })
            }
          }
        }
      }).finally(() => {
        this.modal.loading = false
      })
    },
    fetchOptions (q) {
      const filter = {
        query: q,
        select: 'yes',
        show: 5,
        sort: 'created_at',
        asc: false
      }
      if (this.modal.status === 'edit') {
        Object.assign(filter, { select_id: this.form.ingredient_id })
      }
      const query = queryString.stringify({ v: JSON.stringify(filter) })
      return this.$axios.$get(`ingredient?${query}`).then(res => ({ results: res.data.data }))
    },
    async getOptionsCount () {
      const filter = {
        select: 'yes',
        show: 5,
        sort: 'created_at',
        asc: false
      }
      if (this.modal.status === 'edit') {
        Object.assign(filter, { select_id: this.form.ingredient_id })
      }
      const query = queryString.stringify({ v: JSON.stringify(filter) })
      await this.$axios.$get(`ingredient?${query}`).then((res) => {
        this.selectCount = res.data.total
      })
    },
    async fetchServingSize (id) {
      await this.$axios.$get(`ingredient/${id}`).then((res) => {
        this.serving_size_unit = res.data.unit
      })
    },
    async show (item) {
      await this.$axios.$post(`menu/${item.id}/enable`).then(() => {
        this.$toast.show({
          type: 'success',
          title: 'Berhasil',
          message: 'Data menu ' + item.name + ' berhasil diubah.',
          timeout: 3
        })
        this.deleteModal.data = []
        this.getAPI()
      }).catch((e) => {
        this.$toast.show({
          type: 'danger',
          title: 'Error',
          message: e.response.data.message || e.response.data || e.message || e,
          timeout: 3
        })
      })
    },
    async refresh (item) {
      await this.$axios.$post(`menu/${item.id}/refresh`).then(() => {
        this.$toast.show({
          type: 'success',
          title: 'Berhasil',
          message: 'Data menu ' + item.name + ' berhasil direfresh.',
          timeout: 3
        })
        this.deleteModal.data = []
        this.getAPI()
      }).catch((e) => {
        this.$toast.show({
          type: 'danger',
          title: 'Error',
          message: e.response.data.message || e.response.data || e.message || e,
          timeout: 3
        })
      })
    },
    create () {
      this.$v.$reset()
      this.submitted = false
      this.serving_size_unit = ''
      this.form = Object.assign({}, this.defaultForm)
      this.modal.state = true
      this.modal.loading = false
      this.modal.status = 'create'
      this.modal.title = 'Buat Menu Baru'
      this.imageData.loaded = false
      this.getOptionsCount()
    },
    setModal (item) {
      this.deleteModal.state = true
      this.deleteModal.data = item
    },
    formatPrice (data) {
      return data.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })
    },
    edit (data) {
      this.$v.$reset()
      this.submitted = false
      this.form = Object.assign({}, data)
      this.modal.state = true
      this.modal.loading = false
      this.modal.status = 'edit'
      this.modal.title = `Edit Bahan ${this.form.name}`
      this.getOptionsCount()
      if (this.form.image_path) {
        this.imageData.loaded = true
      }
    },
    async deleteAPI () {
      await this.$axios.$delete(`menu/${this.deleteModal.data.id}`).then(() => {
        this.$toast.show({
          type: 'success',
          title: 'Berhasil',
          message: 'Data menu ' + this.deleteModal.data.name + ' berhasil dihapus.',
          timeout: 3
        })
        this.deleteModal.data = []
        this.getAPI()
      }).catch((e) => {
        this.$toast.show({
          type: 'danger',
          title: 'Error',
          message: e.response.data.message || e.response.data || e.message || e,
          timeout: 3
        })
      })
    },
    async getAPI () {
      this.loadingAPI = true
      const query = queryString.stringify({ v: JSON.stringify(this.filter) })
      await this.$axios.$get(`menu?${query}`).then((res) => {
        this.menus = res.data
      }).catch((e) => {
        this.$toast.show({
          type: 'danger',
          title: 'Error',
          message: e.response.data.message || e.response.data || e.message || e,
          timeout: 3
        })
      }).finally(() => {
        this.loadingAPI = false
      })
    },
    showDetail (data) {
      this.$router.push('/dashboard/menu/' + data.id)
    }
  }
}
</script>

<style scoped>
.tooltip {
  @apply invisible absolute
}

.has-tooltip:hover .tooltip {
  @apply visible z-50
}

.sk-chase {
  width: 30px;
  height: 30px;
  position: relative;
  animation: sk-chase 2.5s infinite linear both;
}

.sk-chase-dot {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  animation: sk-chase-dot 2.0s infinite ease-in-out both;
}

.sk-chase-dot:before {
  content: '';
  display: block;
  width: 25%;
  height: 25%;
  background-color: #fff;
  border-radius: 100%;
  animation: sk-chase-dot-before 2.0s infinite ease-in-out both;
}

.sk-chase-dot:nth-child(1) { animation-delay: -1.1s; }
.sk-chase-dot:nth-child(2) { animation-delay: -1.0s; }
.sk-chase-dot:nth-child(3) { animation-delay: -0.9s; }
.sk-chase-dot:nth-child(4) { animation-delay: -0.8s; }
.sk-chase-dot:nth-child(5) { animation-delay: -0.7s; }
.sk-chase-dot:nth-child(6) { animation-delay: -0.6s; }
.sk-chase-dot:nth-child(1):before { animation-delay: -1.1s; }
.sk-chase-dot:nth-child(2):before { animation-delay: -1.0s; }
.sk-chase-dot:nth-child(3):before { animation-delay: -0.9s; }
.sk-chase-dot:nth-child(4):before { animation-delay: -0.8s; }
.sk-chase-dot:nth-child(5):before { animation-delay: -0.7s; }
.sk-chase-dot:nth-child(6):before { animation-delay: -0.6s; }

@keyframes sk-chase {
  100% { transform: rotate(360deg); }
}

@keyframes sk-chase-dot {
  80%, 100% { transform: rotate(360deg); }
}

@keyframes sk-chase-dot-before {
  50% {
    transform: scale(0.4);
  } 100%, 0% {
      transform: scale(1.0);
    }
}
</style>

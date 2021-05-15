<template>
  <div>
    <div class="mb-5 antialiased">
      <div class="flex justify-between">
        <div class="flex-col my-auto">
          <h1 class="text-4xl font-bold">
            Tambah Menu Baru
          </h1>
        </div>
      </div>
    </div>
    <div class="flex flex-row w-full">
      <div class="bg-white rounded-md shadow w-full h-full">
        <div class="bg-gray-50 px-5 py-3 rounded-t-md border-b font-bold text-gray-700">
          Informasi Menu
          <p class="text-xs font-light text-gray-500">
            Bagian ini berisi informasi dasar tentang menu yang ingin ditambahkan.
          </p>
        </div>
        <div class="p-5 flex-col flex gap-5">
          <div class="grid grid-cols-3 gap-5">
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700" for="name">
                Nama Menu
              </label>
              <div class="mt-1 flex-col">
                <input
                  id="name"
                  v-model="form.name"
                  :class="{ 'border-red-600' : submitted && $v.form.name.$error }"
                  class="transition duration-100 placeholder-gray-300 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                  name="name"
                  type="text"
                  @blur="$v.form.name.$touch()"
                  @focus="$v.form.name.$touch()"
                >
                <span v-if="submitted && !$v.form.name.required" class="text-xs text-red-500">
                  Nama menu tidak boleh kosong
                </span>
                <span v-if="submitted && !$v.form.name.maxLength" class="text-xs text-red-500">
                  Nama menu tidak boleh lebih dari 100 karakter
                </span>
              </div>
            </div>
            <div class="">
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
                  :variant="{ 'danger' : submitted && $v.form.menu_type.$error }"
                />
              </div>
              <span v-if="submitted && !$v.form.menu_type.required" class="text-xs text-red-500">
                Kategori menu harus dipilih
              </span>
            </div>
          </div>
          <div>
            <label for="about" class="block text-sm font-medium text-gray-700">
              Deskripsi Menu
            </label>
            <div class="mt-1">
              <textarea
                id="about"
                v-model="form.description"
                :class="{ 'border-red-600' : submitted && $v.form.description.$error }"
                name="about"
                rows="3"
                class="transition duration-100 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                @blur="$v.form.description.$touch()"
                @focus="$v.form.description.$touch()"
              />
              <span v-if="submitted && !$v.form.description.required" class="text-xs text-red-500">
                Deskripsi menu tidak boleh kosong
              </span>
              <span v-if="submitted && !$v.form.description.maxLength" class="text-xs text-red-500">
                Deskripsi menu tidak boleh lebih dari 250 karakter
              </span>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-5">
            <div class="">
              <label class="block text-sm font-medium text-gray-700" for="unit">
                Satuan Menu
              </label>
              <div class="mt-1 text-sm text-gray-700">
                <input
                  id="unit"
                  v-model="form.unit"
                  :class="{ 'border-red-600' : submitted && $v.form.unit.$error }"
                  class="transition duration-100 placeholder-gray-300 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                  name="name"
                  type="text"
                  @blur="$v.form.unit.$touch()"
                  @focus="$v.form.unit.$touch()"
                >
                <span v-if="submitted && !$v.form.unit.required" class="text-xs text-red-500">
                  Satuan menu tidak boleh kosong
                </span>
                <span v-if="submitted && !$v.form.unit.maxLength" class="text-xs text-red-500">
                  Satuan menu tidak boleh lebih dari 50 karakter
                </span>
              </div>
            </div>
            <div class="">
              <label class="block text-sm font-medium text-gray-700" for="price">
                Harga Jual Menu
              </label>
              <div class="mt-1 flex">
                <span
                  :class="{ 'border-red-600' : submitted && $v.form.price.$error }"
                  class="inline-flex items-center px-3 rounded-l-md border border-gray-300 bg-gray-50 text-gray-500 text-sm"
                >
                  Rp.
                </span>
                <input
                  id="price"
                  v-model="form.price"
                  :class="{ 'border-red-600' : submitted && $v.form.price.$error }"
                  class="transition duration-100 border-l-0 placeholder-gray-300 flex-1 block w-full rounded-r-md sm:text-sm border-gray-300"
                  name="price"
                  type="number"
                  @blur="$v.form.price.$touch()"
                  @focus="$v.form.price.$touch()"
                >
              </div>
              <span v-if="submitted && !$v.form.price.required" class="text-xs text-red-500">
                Harga menu tidak boleh kosong
              </span>
              <span v-if="submitted && !$v.form.price.numeric" class="text-xs text-red-500">
                Harga menu tidak valid
              </span>
              <span v-if="submitted && !$v.form.price.between" class="text-xs text-red-500">
                Harga menu harus berada di range (Rp. 0 - Rp. 2.147.483.647)
              </span>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 p-5 rounded-b-md border-t font-bold text-gray-700 mt-5 flex w-full justify-end">
          <div>
            <button
              class="text-gray-500 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm
            font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2
            focus:ring-offset-2 focus:ring-gray-500"
              @click="back()"
            >
              Batal
            </button>
            <button
              class="ml-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm
            text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none
            focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              @click="createMenu"
            >
              Tambah Menu
            </button>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-md shadow h-full w-96 flex-shrink-0 ml-5">
        <div class="bg-gray-50 px-5 py-3 rounded-t-md border-b font-bold text-gray-700">
          Gambar Menu
          <p class="text-xs font-light text-gray-500">
            Pilih gambar untuk ditampilkan.
          </p>
        </div>
        <div class="p-5 w-96 h-96">
          <div
            v-if="!form.image_path || form.image_delete"
            class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md h-full"
            @dragover="dragover"
            @dragleave="dragleave"
            @drop="drop"
          >
            <div class="space-y-1 text-center my-auto">
              <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div class="flex text-sm text-gray-600">
                <label
                  for="file-upload"
                  class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500
                  focus:outline-none"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    ref="menuImage"
                    name="file-upload"
                    type="file"
                    accept="image/*"
                    class="sr-only"
                    @change="onFileChanged"
                  >
                </label>
                <p class="pl-1">
                  or drag and drop
                </p>
              </div>
              <p class="text-xs text-gray-500">
                PNG, JPG, JPEG up to 10MB
              </p>
            </div>
          </div>
          <div v-else class="relative">
            <div
              class="group flex transition duration-200 absolute w-full h-full bg-opacity-0 bg-black rounded-md hover:bg-opacity-50
              cursor-pointer items-center"
              @click="deleteImage"
            >
              <div class="mx-auto text-gray-50 transition duration-200 opacity-0 group-hover:opacity-100">
                Click to remove
              </div>
            </div>
            <img :src="cropper.preview_url" class="object-cover w-full h-full text-gray-300 rounded-md">
          </div>
        </div>
      </div>
    </div>
    <ChangePasswordModal v-model="cropper.modal" class="z-50" @click="cropImage()">
      <template #title>
        Crop your new profile picture
      </template>
      <template #body>
        <div v-if="cropper.loading" class="h-48 w-full text-center">
          <div class="spinner">
            <div class="bounce1" />
            <div class="bounce2" />
            <div class="bounce3" />
          </div>
        </div>
        <div v-else id="imagebox" class="w-full relative">
          <img
            id="image"
            ref="image_crop"
            class="w-full"
            :src="cropper.image_url"
            crossOrigin="anonymous"
            @load="showCropper"
          >
        </div>
      </template>
    </ChangePasswordModal>
  </div>
</template>

<script>
import { between, maxLength, numeric, required } from 'vuelidate/lib/validators'
import Cropper from 'cropperjs'

export default {
  middleware: 'menu/create',
  validations: {
    form: {
      name: {
        required,
        maxLength: maxLength(100)
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
      menu_type: {
        required
      }
    }
  },
  data () {
    return {
      form: {
        name: '',
        description: '',
        price: null,
        unit: '',
        menu_type: '',
        properties: {},
        image_path: ''
      },
      cropper: {
        loading: false,
        first_instance: true,
        instance: {},
        image_url: null,
        modal: false,
        preview_url: ''
      },
      uploadedPreview: null,
      submitted: false,
      categoryFilterList: [
        {
          name: 'Makanan Utama',
          value: 'main'
        },
        {
          name: 'Makanan Side Dish',
          value: 'side_dish'
        },
        {
          name: 'Minuman',
          value: 'drink'
        }
      ]
    }
  },
  head () {
    return {
      title: 'Tambah Menu Baru | Atma Korean BBQ'
    }
  },
  methods: {
    async onFileChanged (event) {
      await this.onPreUploadFile(event.target.files[0])
      event.target.value = ''
    },
    onPreUploadFile (file) {
      const formData = new FormData()
      formData.append('file', file)
      this.$axios.post('file/avatar', formData).then((res) => {
        this.cropper.modal = true
        this.cropper.image_url = res.data.data.presigned_url
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
    },
    back () {
      this.$router.push('/dashboard/menu')
    },
    createMenuAPI () {
      this.$axios.post('menu', this.form).then(() => {
        this.back()
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
      })
    },
    createMenu () {
      this.$v.$touch()
      this.submitted = true
      if (!this.$v.$error) {
        this.createMenuAPI()
      }
    },
    onChange () {
      const image = this.$refs.menuImage.files[0]
      const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg']
      if (!validImageTypes.includes(image.type)) {
        this.$toast.show({
          type: 'danger',
          title: 'Gagal memasukkan gambar',
          message: 'File yang diunggah bukan gambar.',
          timeout: 3
        })
      }
      this.onImageSelected(image)
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
    async drop (event) {
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
        await this.onPreUploadFile(this.$refs.menuImage.files[0])
      }
      event.currentTarget.classList.remove('border-indigo-500')
    },
    deleteImage () {
      this.form.image_path = null
      this.form.image_delete = true
      this.form.properties = null
    },
    cropImage () {
      this.form.image_delete = false
      this.form.properties = this.cropper.instance.getData(true)
      this.cropper.preview_url = this.cropper.instance.getCroppedCanvas().toDataURL('image/png')
      this.cropper.modal = false
    },
    showCropper () {
      if (!this.cropper.first_instance) {
        this.cropper.instance.destroy()
      } else {
        this.cropper.first_instance = false
      }
      this.cropper.instance = new Cropper(this.$refs.image_crop, {
        viewMode: 2,
        autoCropArea: 1,
        center: true,
        restore: false,
        zoomOnWheel: false,
        aspectRatio: 1,
        checkCrossOrigin: false
      })
    }
  }
}
</script>

<style scoped>
@import 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.1/cropper.min.css';
</style>

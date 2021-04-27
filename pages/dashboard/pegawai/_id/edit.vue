<template>
  <div>
    <div v-if="loading" class="h-full">
      <div class="spinner">
        <div class="bounce1" />
        <div class="bounce2" />
        <div class="bounce3" />
      </div>
    </div>
    <div v-else>
      <div class="mb-5 antialiased">
        <div class="flex justify-between">
          <div class="flex-col my-auto">
            <h1 class="text-4xl font-bold">
              Edit {{ title }}
            </h1>
            <p>Menu untuk mengedit pegawai</p>
          </div>
          <div class="flex my-auto">
            <button
              class="text-gray-500 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm
            font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2
            focus:ring-offset-2 focus:ring-gray-500"
              @click="back"
            >
              Batal
            </button>
            <button
              class="ml-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm
            text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none
            focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              @click="createEmployee"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
      <div>
        <div class="grid grid-cols-4 gap-6">
          <div class="col-span-1">
            <div class="px-4 sm:px-0">
              <h3 class="text-lg font-medium leading-6 text-gray-900">
                Data Pribadi
              </h3>
              <p class="mt-1 text-sm text-gray-600">
                Bagian ini berisi data pribadi dari pegawai.
              </p>
            </div>
          </div>
          <div class="col-span-3">
            <form action="#" method="POST">
              <div class="shadow rounded-md overflow-hidden">
                <div class="p-6 bg-white space-y-3">
                  <div class="flex-row flex gap-6">
                    <div class="grid gap-2 w-full">
                      <div class="col-span-1">
                        <label class="block text-sm font-medium text-gray-700" for="name">
                          Nama Pegawai
                        </label>
                        <div class="mt-1 flex-col">
                          <input
                            id="name"
                            v-model="form.name"
                            :class="{ 'border-red-600' : form.submitted && $v.form.name.$error }"
                            class="placeholder-gray-300 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                            name="name"
                            placeholder="Nama Pegawai"
                            type="text"
                            @blur="$v.form.name.$touch()"
                            @focus="$v.form.name.$touch()"
                          >
                          <span v-if="form.submitted && !$v.form.name.required" class="text-xs text-red-500">
                            Nama pegawai tidak boleh kosong
                          </span>
                          <span v-if="form.submitted && !$v.form.name.maxLength" class="text-xs text-red-500">
                            Nama pegawai tidak boleh lebih dari 100 karakter
                          </span>
                        </div>
                      </div>
                      <div class="col-span-1">
                        <label class="block text-sm font-medium text-gray-700" for="telephone">
                          Nomor Telepon
                        </label>
                        <div class="mt-1 flex-col">
                          <input
                            id="telephone"
                            v-model="form.phone"
                            :class="{ 'border-red-600' : form.submitted && $v.form.phone.$error }"
                            class="flex-1 placeholder-gray-300 block w-full rounded-md sm:text-sm border-gray-300"
                            name="telephone"
                            placeholder="Nomor Telepon Pegawai"
                            type="tel"
                            @blur="$v.form.phone.$touch()"
                            @focus="$v.form.phone.$touch()"
                          >
                          <span v-if="form.submitted && !$v.form.phone.required" class="text-xs text-red-500">
                            Nomor telepon tidak boleh kosong
                          </span>
                          <span v-else-if="form.submitted && !$v.form.phone.numeric" class="text-xs text-red-500">
                            Nomor telepon tidak valid
                          </span>
                          <span v-else-if="form.submitted && !$v.form.phone.maxLength" class="text-xs text-red-500">
                            Nomor telepon lebih dari 13 digit
                          </span>
                          <span v-else-if="form.submitted && !$v.form.phone.minLength" class="text-xs text-red-500">
                            Nomor telepon kurang dari 10 digit
                          </span>
                        </div>
                      </div>
                      <div class="col-span-1">
                        <label class="block text-sm font-medium text-gray-700">
                          Jenis Kelamin
                        </label>
                        <Select
                          v-model="form.gender"
                          :error="(form.submitted && $v.form.gender.$error)"
                          :list="jenisKelaminList"
                          @blur="$v.form.gender.$touch()"
                          @focus="$v.form.gender.$touch()"
                        />
                        <span v-if="form.submitted && !$v.form.gender.required" class="text-xs text-red-500">
                          Jenis kelamin tidak boleh kosong
                        </span>
                      </div>
                      <div class="col-span-1">
                        <label class="block text-sm font-medium text-gray-700">
                          Role Pegawai
                        </label>
                        <Select
                          v-model="form.role_id"
                          :error="(form.submitted && $v.form.role_id.$error)"
                          :list="roles.data"
                          @blur="$v.form.role_id.$touch()"
                          @focus="$v.form.role_id.$touch()"
                        />
                        <span v-if="form.submitted && !$v.form.role_id.minValue" class="text-xs text-red-500">
                          Jabatan tidak boleh kosong
                        </span>
                      </div>
                      <div class="col-span-1">
                        <label class="block text-sm font-medium text-gray-700" for="date_join">
                          Tanggal Bergabung
                        </label>
                        <div class="mt-1 flex-col">
                          <input
                            id="date_join"
                            v-model="form.date_join"
                            :class="{ 'border-red-600' : form.submitted && $v.form.date_join.$error }"
                            :max="new Date().toISOString()"
                            class="flex-1 placeholder-gray-300 block w-full rounded-md sm:text-sm border-gray-300"
                            name="date_join"
                            placeholder="Tanggal Bergabung"
                            type="date"
                            @blur="$v.form.date_join.$touch()"
                            @focus="$v.form.date_join.$touch()"
                          >
                          <span v-if="form.submitted && !$v.form.date_join.required" class="text-xs text-red-500">
                            Tanggal tidak boleh kosong
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="col-span-1 mx-auto w-auto flex flex-col">
                      <div class="flex flex-col">
                        <label class="block text-sm font-medium text-gray-700" for="name">
                          Foto Pegawai
                        </label>
                        <span class="mt-1 inline-block h-48 w-48 bg-gray-100 rounded-md mx-auto">
                          <div v-if="!form.image_path || form.image_delete">
                            <svg class="h-full w-full text-gray-300 rounded-md" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          </div>
                          <div v-else>
                            <img :src="cropper.preview_url" class="object-cover h-48 w-48 text-gray-300 rounded-md">
                          </div>
                        </span>
                        <input
                          ref="fileInput"
                          type="file"
                          style="display: none"
                          accept="image/*"
                          @change="onImageSelected"
                        >
                      </div>
                      <div class="flex-row flex w-48 gap-2 mt-2">
                        <button
                          class="w-full text-center items-center px-4 py-2 border border-transparent rounded-md
                          shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none
                          focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          @click.prevent="$refs.fileInput.click()"
                        >
                          Ganti
                        </button>
                        <button
                          v-if="form.image_path"
                          class="w-full text-center text-gray-500 items-center px-4 py-2 border border-gray-300
                          rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50
                          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                          @click.prevent="deleteImage"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div aria-hidden="true" class="hidden sm:block">
          <div class="py-5">
            <div class="border-t border-gray-200" />
          </div>
        </div>
        <div class="grid md:grid-cols-4 md:gap-6">
          <div class="col-span-1">
            <div class="px-4 sm:px-0">
              <h3 class="text-lg font-medium leading-6 text-gray-900">
                Data Akun
              </h3>
              <p class="mt-1 text-sm text-gray-600">
                Bagian ini berisi data akun dari pegawai.
              </p>
            </div>
          </div>
          <div class="col-span-3">
            <div class="shadow sm:rounded-md sm:overflow-hidden">
              <div class="px-4 py-5 bg-white space-y-6 sm:p-6">
                <div class="grid grid-cols-2 gap-6">
                  <div class="col-span-2 sm:col-span-2">
                    <label class="block text-sm font-medium text-gray-700" for="email">
                      Email Pegawai
                    </label>
                    <div class="mt-1 flex-col">
                      <input
                        id="email"
                        v-model="form.email"
                        type="email"
                        class="flex-1 placeholder-gray-300 block w-full rounded-md sm:text-sm border-gray-300"
                        :class="{ 'border-red-600' : form.submitted && $v.form.email.$error }"
                        name="email"
                        placeholder="user@atmakoreanbbq.com"
                        @blur="$v.form.email.$touch()"
                        @focus="$v.form.email.$touch()"
                      >
                      <span v-if="form.submitted && !$v.form.email.required" class="text-xs text-red-500">
                        Email tidak boleh kosong
                      </span>
                      <span v-else-if="form.submitted && !$v.form.email.email" class="text-xs text-red-500">
                        Email tidak valid
                      </span>
                      <span v-else-if="form.submitted && !$v.form.email.maxLength" class="text-xs text-red-500">
                        Email lebih dari 100 digit
                      </span>
                    </div>
                  </div>
                </div>
              </div>
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
              <div class="bounce1"></div>
              <div class="bounce2"></div>
              <div class="bounce3"></div>
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
  </div>
</template>

<script>
import { email, maxLength, minLength, minValue, numeric, required } from 'vuelidate/lib/validators'
import Cropper from 'cropperjs'
// import Cropper from 'cropperjs'

export default {
  middleware: 'employee/update',
  validations: {
    form: {
      name: {
        required,
        maxLength: maxLength(100)
      },
      email: {
        required,
        email,
        maxLength: maxLength(100)
      },
      phone: {
        required,
        numeric,
        minLength: minLength(10),
        maxLength: maxLength(13)
      },
      gender: { required },
      role_id: { minValue: minValue(1) },
      date_join: { required }
    }
  },
  async asyncData ({
    $axios,
    error
  }) {
    try {
      const roles = await $axios.$get('select/role')
      return { roles }
    } catch (err) {
      if (err.response.status === 404) {
        error({
          statusCode: 404,
          message: err.message
        })
      }
    }
  },
  data () {
    return {
      title: 'Edit Pegawai',
      loading: true,
      form: {
        submitted: false,
        name: '',
        gender: '',
        role_id: 0,
        date_join: '',
        password: '',
        confirm_password: '',
        email: '',
        phone: '',
        properties: {},
        image_path: '',
        image_delete: false
      },
      cropper: {
        loading: false,
        first_instance: true,
        instance: {},
        image_url: null,
        modal: false,
        preview_url: ''
      },
      jenisKelaminList: [
        {
          name: 'Pria',
          value: 'male'
        },
        {
          name: 'Wanita',
          value: 'female'
        },
        {
          name: 'Lain-Lain',
          value: 'other'
        }
      ]
    }
  },
  async fetch () {
    await this.$axios.get('employee/' + this.$route.params.id).then((res) => {
      this.form = res.data.data
      this.title = res.data.data.name
      this.cropper.preview_url = res.data.data.image_path
    }).catch((err) => {
      return this.$nuxt.error({
        statusCode: err.statusCode,
        message: err.response.message || err.message || err
      })
    }).finally(() => {
      this.loading = false
    })
  },
  head () {
    return {
      title: this.title + ' | Atma Korean BBQ'
    }
  },
  methods: {
    onImageSelected (event) {
      const formData = new FormData()
      formData.append('file', event.target.files[0])
      this.$axios.post('file/avatar', formData).then((res) => {
        this.cropper.modal = true
        this.cropper.image_url = res.data.data.presigned_url
        this.form.image_path = res.data.data.path
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
      event.target.value = ''
    },
    deleteImage () {
      this.form.image_path = null
      this.form.image_delete = true
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
    },
    back () {
      this.$router.push('/dashboard/pegawai/' + this.$route.params.id)
    },
    createEmployeeAPI () {
      this.$axios.put('employee/' + this.form.id, this.form).then((res) => {
        this.back()
        this.$toast.show({
          type: 'success',
          title: 'Berhasil',
          message: 'Data pegawai ' + this.form.name + ' berhasil diedit.',
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
    createEmployee () {
      this.$v.$touch()
      this.form.submitted = true
      if (!this.$v.$error) {
        this.createEmployeeAPI()
      }
    }
  }
}
</script>

<style>
@import 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.1/cropper.min.css';

.spinner {
  margin: 100px auto 0;
  width: 70px;
  text-align: center;
}

.spinner > div {
  width: 18px;
  height: 18px;
  background-color: #333;

  border-radius: 100%;
  display: inline-block;
  -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  animation: sk-bouncedelay 1.4s infinite ease-in-out both;
}

.spinner .bounce1 {
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}

.spinner .bounce2 {
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}

@-webkit-keyframes sk-bouncedelay {
  0%, 80%, 100% { -webkit-transform: scale(0) }
  40% { -webkit-transform: scale(1.0) }
}

@keyframes sk-bouncedelay {
  0%, 80%, 100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  } 40% {
      -webkit-transform: scale(1.0);
      transform: scale(1.0);
    }
}
</style>

<template>
  <div>
    <div v-if="loading">
      Loading
    </div>
<!--    <div v-else>-->
<!--      <div class="mb-5 flex justify-between items-center">-->
<!--        <h1 class="text-4xl font-medium tracking-normal">-->
<!--          Ingredient-->
<!--        </h1>-->
<!--        <NuxtLink-->
<!--          v-if="$auth.hasScope('ingredient.create')"-->
<!--          to="/dashboard/ingredient/create"-->
<!--          class="h-full inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm-->
<!--            text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none-->
<!--            focus:ring-2 focus:ring-offset-2 focus:ring-red-500 whitespace-nowrap justify-between flex"-->
<!--        >-->
<!--          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">-->
<!--            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />-->
<!--          </svg>-->
<!--          <span class="pl-2">-->
<!--            Ingredient-->
<!--          </span>-->
<!--        </NuxtLink>-->
<!--      </div>-->
<!--      <div class="mb-5 flex justify-between">-->
<!--        <transition name="bounce">-->
<!--          <div-->
<!--            class="relative rounded-md shadow-sm"-->
<!--          >-->
<!--            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">-->
<!--              <span class="text-gray-500 sm:text-sm">-->
<!--                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">-->
<!--                  <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />-->
<!--                </svg>-->
<!--              </span>-->
<!--            </div>-->
<!--            <input-->
<!--              id="search"-->
<!--              v-model="searchFilter.query"-->
<!--              type="text"-->
<!--              name="search"-->
<!--              class="searchBox focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"-->
<!--              :class="{ 'searchBox-grow' : searchFocus }"-->
<!--              placeholder="Cari nama ingredient"-->
<!--              @focus="searchFocus = true"-->
<!--              @blur="searchFocus = false"-->
<!--              @input="isTyping = true"-->
<!--            >-->
<!--          </div>-->
<!--        </transition>-->
<!--        <div class="flex items-center gap-2 text-sm text-gray-700">-->
<!--          <t-rich-select-->
<!--            v-model="searchFilter.category"-->
<!--            multiple-->
<!--            :close-on-select="false"-->
<!--            :options="categoryFilterList"-->
<!--            value-attribute="value"-->
<!--            text-attribute="name"-->
<!--            placeholder="Pilih kategori ingredient"-->
<!--            hide-search-box-->
<!--          />-->
<!--          <div class="flex items-center gap-2">-->
<!--            <div>-->
<!--              Results per page-->
<!--            </div>-->
<!--            <t-rich-select-->
<!--              v-model="searchFilter.show"-->
<!--              :options="perPageViewFilterList"-->
<!--              hide-search-box-->
<!--            />-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div-->
<!--        class="shadow bg-white overflow-hidden border-b border-gray-200 sm:rounded-lg"-->
<!--      >-->
<!--        <div-->
<!--          class="h-1"-->
<!--          :class="[ loading ? 'bg-indigo-200' : 'bg-gray-50' ]"-->
<!--        >-->
<!--          <div v-if="loading">-->
<!--            <LoadingBar />-->
<!--          </div>-->
<!--        </div>-->
<!--        <table class="min-w-full divide-y divide-gray-200">-->
<!--          <thead class="bg-gray-50">-->
<!--            <tr>-->
<!--              <th scope="col" class="w-1/2 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">-->
<!--                <div class="flex items-center gap-2 cursor-pointer select-none transition duration-200 hover:opacity-70" @click="changeSort('name')">-->
<!--                  <div>-->
<!--                    Nama-->
<!--                  </div>-->
<!--                  <div v-if="searchFilter.sort === 'name'">-->
<!--                    <div v-if="searchFilter.asc">-->
<!--                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">-->
<!--                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />-->
<!--                      </svg>-->
<!--                    </div>-->
<!--                    <div v-else>-->
<!--                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">-->
<!--                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />-->
<!--                      </svg>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </th>-->
<!--              <th scope="col" class="w-1/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">-->
<!--                Satuan-->
<!--              </th>-->
<!--              <th scope="col" class="w-1/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">-->
<!--                Jenis Ingredient-->
<!--              </th>-->
<!--              <th scope="col" class="w-1/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">-->
<!--                <div class="flex items-center gap-2 cursor-pointer select-none transition duration-200 hover:opacity-70" @click="changeSort('is_available')">-->
<!--                  <div>-->
<!--                    Tersedia-->
<!--                  </div>-->
<!--                  <div v-if="searchFilter.sort === 'is_available'">-->
<!--                    <div v-if="searchFilter.asc">-->
<!--                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">-->
<!--                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />-->
<!--                      </svg>-->
<!--                    </div>-->
<!--                    <div v-else>-->
<!--                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">-->
<!--                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />-->
<!--                      </svg>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </th>-->
<!--              <th scope="col" class="w-1/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">-->
<!--                <div class="flex items-center gap-2 cursor-pointer select-none transition duration-200 hover:opacity-70" @click="changeSort('price')">-->
<!--                  <div>-->
<!--                    Harga-->
<!--                  </div>-->
<!--                  <div v-if="searchFilter.sort === 'price'">-->
<!--                    <div v-if="searchFilter.asc">-->
<!--                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">-->
<!--                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />-->
<!--                      </svg>-->
<!--                    </div>-->
<!--                    <div v-else>-->
<!--                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">-->
<!--                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />-->
<!--                      </svg>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </th>-->
<!--              <th scope="col" class="relative px-4 py-3">-->
<!--                <span class="sr-only">Edit</span>-->
<!--              </th>-->
<!--            </tr>-->
<!--          </thead>-->
<!--          <tbody v-if="ingredients.data.length > 0" class="bg-white divide-y divide-gray-200">-->
<!--            <tr v-for="ingredient in ingredients.data" :key="ingredient.id">-->
<!--              <td class="px-4 py-4 whitespace-normal">-->
<!--                <div class="flex items-start">-->
<!--                  <div class="mr-4 flex-shrink-0">-->
<!--                    <div v-if="ingredient.image_path">-->
<!--                      <img class="h-20 w-20 rounded-md" :src="ingredient.image_path" :alt="`Ingredient image for ` + ingredient.name">-->
<!--                    </div>-->
<!--                    <div v-else>-->
<!--                      <img class="h-20 w-20 rounded-md" src="https://atmakoreanbbq.s3-ap-southeast-1.amazonaws.com/public/no_image.png" :alt="`No ingredient image for ` + ingredient.name">-->
<!--                    </div>-->
<!--                  </div>-->
<!--                  <div>-->
<!--                    <div class="text-sm text-gray-500">-->
<!--                      <div class="font-medium">-->
<!--                        {{ ingredient.name }}-->
<!--                      </div>-->
<!--                      <div class="text-sm text-gray-400">-->
<!--                        {{ ingredient.description }}-->
<!--                      </div>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </td>-->
<!--              <td class="px-4 py-4 whitespace-nowrap">-->
<!--                <div class="text-sm text-gray-500">-->
<!--                  {{ ingredient.unit }}-->
<!--                </div>-->
<!--              </td>-->
<!--              <td class="px-4 py-4 whitespace-nowrap">-->
<!--                <div class="text-sm text-gray-500">-->
<!--                  <div v-if="ingredient.ingredient_type === 'main'" class="flex">-->
<!--                    Utama-->
<!--                  </div>-->
<!--                  <div v-else-if="ingredient.ingredient_type === 'side_dish'" class="flex">-->
<!--                    Side Dish-->
<!--                  </div>-->
<!--                  <div v-else-if="ingredient.ingredient_type === 'drink'" class="flex">-->
<!--                    Minuman-->
<!--                  </div>-->
<!--                </div>-->
<!--              </td>-->
<!--              <td class="px-4 py-4 whitespace-nowrap">-->
<!--                <div class="text-sm text-gray-500 font-medium">-->
<!--                  <div v-if="ingredient.is_available === 1" class="flex gap-2 text-green-500">-->
<!--                    <div class="h-2 w-2 bg-green-500 rounded-full my-auto" />-->
<!--                    Ada-->
<!--                  </div>-->
<!--                  <div v-else class="flex gap-2 text-gray-500">-->
<!--                    <div class="h-2 w-2 bg-gray-500 rounded-full my-auto" />-->
<!--                    Kosong-->
<!--                  </div>-->
<!--                </div>-->
<!--              </td>-->
<!--              <td class="px-4 py-4 whitespace-nowrap">-->
<!--                <div class="text-sm text-gray-500">-->
<!--                  {{ formatPrice(ingredient.price) }}-->
<!--                </div>-->
<!--              </td>-->
<!--              <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">-->
<!--                <button-->
<!--                  class="text-red-600 hover:text-red-900"-->
<!--                  @click="showDetail(ingredient)"-->
<!--                >-->
<!--                  Detail-->
<!--                </button>-->
<!--              </td>-->
<!--            </tr>-->
<!--          </tbody>-->
<!--          <tbody v-else class="bg-white divide-y divide-gray-200">-->
<!--            <tr>-->
<!--              <td colspan="6" class="text-center py-5 text-gray-500 text-sm">-->
<!--                Tidak ada data-->
<!--              </td>-->
<!--            </tr>-->
<!--          </tbody>-->
<!--        </table>-->
<!--        <div v-if="ingredients.data.length > 0" class="py-4 px-4 border-t flex justify-between">-->
<!--          <div class="my-auto">-->
<!--            <p class="text-sm text-gray-700">-->
<!--              Menampilkan-->
<!--              <span class="font-bold">{{ ingredients.from }}</span>-->
<!--              ke-->
<!--              <span class="font-bold">{{ ingredients.to }}</span>-->
<!--              dari-->
<!--              <span class="font-bold">{{ ingredients.total }}</span>-->
<!--              hasil-->
<!--            </p>-->
<!--          </div>-->
<!--          <div>-->
<!--            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">-->
<!--              <button-->
<!--                class="relative inline-flex items-center px-2 py-2 rounded-l-md-->
<!--              border border-gray-300 bg-white text-sm font-medium text-gray-500-->
<!--              hover:bg-gray-50"-->
<!--                :disabled="ingredients.prev_page_url === null"-->
<!--                :class="[ ingredients.prev_page_url === null ? 'bg-gray-100 hover:bg-gray-100 cursor-default' : 'cursor-pointer' ]"-->
<!--                @click="getAPIbyPage(ingredients.prev_page_url)"-->
<!--              >-->
<!--                <span class="sr-only">Previous</span>-->
<!--                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">-->
<!--                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />-->
<!--                </svg>-->
<!--              </button>-->
<!--              <button-->
<!--                v-for="(data, key) in ingredients.links.slice(1, -1)"-->
<!--                :key="key"-->
<!--                class="inline-flex relative items-center px-4 py-2 border-->
<!--              border-gray-300 bg-white text-sm font-medium text-gray-500-->
<!--              hover:bg-gray-50"-->
<!--                :disabled="data.active || data.url === null"-->
<!--                :class="[ data.active || data.url === null ? 'bg-gray-100 hover:bg-gray-100 cursor-default' : 'cursor-pointer']"-->
<!--                @click="getAPIbyPage(data.url)"-->
<!--              >-->
<!--                <span-->
<!--                  :class="{ 'font-bold text-gray-700' : data.active }"-->
<!--                >{{ data.label }}</span>-->
<!--              </button>-->
<!--              <button-->
<!--                class="relative inline-flex items-center px-2 py-2 rounded-r-md-->
<!--              border border-gray-300 bg-white text-sm font-medium text-gray-500-->
<!--              hover:bg-gray-100"-->
<!--                :disabled="ingredients.next_page_url === null"-->
<!--                :class="[ ingredients.next_page_url === null ? 'bg-gray-100 hover:bg-gray-100 cursor-default' : 'cursor-pointer' ]"-->
<!--                @click="getAPIbyPage(ingredients.next_page_url)"-->
<!--              >-->
<!--                <span class="sr-only">Next</span>-->
<!--                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">-->
<!--                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />-->
<!--                </svg>-->
<!--              </button>-->
<!--            </nav>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
  </div>
</template>

<script>
import _ from 'lodash'
import { mapActions, mapState } from 'vuex'
import { category, perPageView } from '~/const'

export default {
  middleware: 'ingredient/read',
  async asyncData (context) {
    await context.store.dispatch('api/fetchAPI', {
      object: 'ingredient',
      filter: {
        page: 1,
        reset: true
      }
    })
  },
  data () {
    return {
      searchFilter: {
        show: 10,
        query: '',
        category: [],
        sort: 'name',
        asc: true,
        page: 1,
        reset: false
      },
      categoryFilterList: category,
      perPageViewFilterList: perPageView,
      sortByFilterList: [
        {
          name: 'Nama',
          value: 'name'
        },
        {
          name: 'Harga',
          value: 'price'
        },
        {
          name: 'Baru saja dibuat',
          value: 'created_at'
        },
        {
          name: 'Baru saja diubah',
          value: 'updated_at'
        }
      ],
      searchFocus: false,
      isTyping: false,
      search: '',
      loadingAPI: true
    }
  },
  head () {
    return {
      title: 'Ingredient | Atma Korean BBQ'
    }
  },
  computed: {
    ...mapState({
      ingredients: state => state.api.data,
      loading: state => state.api.loading
    })
  },
  watch: {
    isTyping (state) {
      if (!state) {
        this.fetchAPI({
          object: 'ingredient',
          filter: this.searchFilter
        })
      }
    },
    'searchFilter.query':
      _.debounce(function () {
        this.isTyping = false
      }, 500),
    'searchFilter.show' () {
      this.fetchAPI({
        object: 'ingredient',
        filter: this.searchFilter
      })
    },
    'searchFilter.category' () {
      this.fetchAPI({
        object: 'ingredient',
        filter: this.searchFilter
      })
    },
    'searchFilter.sort' () {
      this.fetchAPI({
        object: 'ingredient',
        filter: this.searchFilter
      })
    },
    'searchFilter.asc' () {
      this.fetchAPI({
        object: 'ingredient',
        filter: this.searchFilter
      })
    }
  },
  methods: {
    ...mapActions({
      fetchAPI: 'api/fetchAPI'
    }),
    getAPIbyPage (pageLink) {
      const page = parseInt(pageLink.replace(/[^0-9]/g, ''), 10)
      const filter = Object.assign({}, this.searchFilter)
      filter.page = page
      this.fetchAPI({
        object: 'ingredient',
        filter
      })
    },
    changeSort (name) {
      if (name !== this.searchFilter.sort) {
        this.searchFilter.asc = true
      } else {
        this.searchFilter.asc = !this.searchFilter.asc
      }
      this.searchFilter.sort = name
    },
    formatPrice (data) {
      const formatter = Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })
      return formatter.format(data)
    },
    showDetail (data) {
      this.$router.push('/dashboard/ingredient/' + data.id)
    }
  }
}
</script>

<style scoped>
.searchBox-grow {
  @apply w-96;
  @apply duration-200;
  transition-property: width;
}

.searchBox {
  @apply duration-200;
  transition-property: width;
}
</style>

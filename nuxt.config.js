export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Atma Korean BBQ',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  tailwindcss: {
    config: {
      theme: {
        fontFamily: {
          body: ['Open Sans']
        }
      },
      plugins: [
        require('@tailwindcss/forms')
      ],
      purge: {
        content: [
          'node_modules/tv-*/dist/tv-*.umd.min.js'
        ]
      }
    }
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    {
      src: '~/plugins/vuelidate.js'
    },
    {
      src: '~/plugins/directives.js'
    }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    '@nuxtjs/fontawesome'
  ],

  fontawesome: {
    icons: {
      solid: [
        'faUserTag',
        'faUser',
        'faHome',
        'faChair',
        'faUtensils',
        'faTruckLoading',
        'faUsers',
        'faPrint',
        'faList',
        'faBookmark',
        'faMoneyCheckAlt',
        'faCog',
        'faTrash',
        'faPencilAlt',
        'faPowerOff',
        'faEllipsisV',
        'faChevronDown'
      ]
    }
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    ['nuxt-tailvue', { all: true, toast: { defaults: { containerClasses: ['mt-20'] } } }]
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: 'http://localhost/api'
  },

  echo: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  router: {
    middleware: ['auth']
  },

  auth: {
    strategies: {
      local: {
        token: {
          property: 'data.token',
          required: true,
          type: 'Bearer'
        },
        user: {
          property: 'data',
          autoFetch: true
        },
        endpoints: {
          login: {
            url: 'auth/login',
            method: 'post'
          },
          user: {
            url: 'auth',
            method: 'post'
          },
          logout: {
            url: 'auth/logout',
            method: 'post'
          }
        }
      }
    }
  }
}

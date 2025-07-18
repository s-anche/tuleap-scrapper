export default defineNuxtConfig({
  devtools: { 
    enabled: true,
    timeline: {
      enabled: true
    }
  },
  
  // TypeScript configuration
  typescript: {
    typeCheck: true
  },

  // CSS and styling
  css: [
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.css',
    '@/assets/main.css'
  ],

  // Modules
  modules: [
    '@pinia/nuxt'
  ],

  // Pinia configuration
  pinia: {
    storesDirs: ['./stores/**']
  },

  // Runtime config for environment variables
  runtimeConfig: {
    // Private keys (only available on server-side)
    databaseUrl: process.env.DATABASE_URL,
    // Public keys (exposed to client-side)
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api'
    }
  },

  // Build configuration
  build: {
    transpile: ['vuetify']
  },
  
  // Plugins
  plugins: [
    '~/plugins/vuetify.ts',
    '~/plugins/pinia.client.ts'
  ],

  // Server-side rendering
  ssr: true,

  // Vite configuration
  vite: {
    define: {
      'process.env.DEBUG': false,
      '__VUE_PROD_DEVTOOLS__': process.env.NODE_ENV !== 'production'
    },
    ssr: {
      noExternal: ['vuetify']
    }
  },

  // Nitro configuration for server
  nitro: {
    experimental: {
      wasm: true
    }
  },

  // Auto-import composables
  imports: {
    dirs: ['composables', 'stores']
  },

  // Component auto-import
  components: true,

  // Head configuration
  app: {
    head: {
      title: 'Tuleap Scrapper',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Track team and project progress in Tuleap' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
})
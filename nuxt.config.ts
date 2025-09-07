// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2025-08-07',
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    // '@pinia/nuxt', // Temporarily removed for troubleshooting
  ],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'AMPLI CALÇADOS - E-commerce',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'E-commerce AMPLI CALÇADOS - Calçados de qualidade' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/logo-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/logo-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/logo-180x180.png' },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: 'anonymous',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800&display=swap',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Raleway:wght@100;300&display=swap',
        },
      ],
    },
  },
  runtimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY,

    // PagBank configuration
    // Em dev: usa SOMENTE o token local; em prod: SOMENTE o token de produção
    pagbankAccessToken:
      process.env.NODE_ENV === 'production'
        ? process.env.PAGBANK_ACCESS_TOKEN
        : process.env.PAGBANK_ACCESS_TOKEN_LOCAL,
    pagbankClientId: process.env.PAGBANK_CLIENT_ID,
    pagbankClientSecret: process.env.PAGBANK_CLIENT_SECRET,
    // Usa sandbox por padrão em dev/test e production em produção, permitindo override por env var
    pagbankEnvironment:
      process.env.PAGBANK_ENVIRONMENT ||
      (process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'),
    pagbankWebhookSecret: process.env.PAGBANK_WEBHOOK_SECRET,
    pagbankWebhookPublicUrl: process.env.PAGBANK_WEBHOOK_PUBLIC_URL,

    // Correios API configuration
    correiosAccessCode: process.env.CORREIOS_ACCESS_CODE,

    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_ANON_KEY,
      pagbankEnvironment:
        process.env.PAGBANK_ENVIRONMENT ||
        (process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'),
      pagbankClientId: process.env.PAGBANK_CLIENT_ID,
      policyVersion: process.env.POLICY_VERSION || '1.0.0',
    },
  },
  supabase: {
    redirect: false,
    url: process.env.SUPABASE_URL || '',
    key: process.env.SUPABASE_ANON_KEY || '',
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    cookieOptions: {
      maxAge: 60 * 60 * 8,
      sameSite: 'lax',
      secure: true,
    },
  },
});

<template>
  <div>
    <AppHeader />
    <main class="pt-40">
      <slot />
    </main>
    <footer class="border-t border-gray-200 mt-16">
      <div
        class="max-w-7xl mx-auto px-4 py-8 text-sm text-gray-600 flex flex-col sm:flex-row gap-2 sm:gap-6 items-start sm:items-center justify-between"
      >
        <div class="flex gap-4 flex-wrap">
          <NuxtLink to="/privacidade" class="hover:text-coral-soft"
            >Política de Privacidade</NuxtLink
          >
          <NuxtLink to="/termos" class="hover:text-coral-soft">Termos de Uso</NuxtLink>
          <button
            type="button"
            class="text-left hover:text-coral-soft"
            @click="() => window.dispatchEvent(new CustomEvent('open-cookie-preferences'))"
          >
            Preferências de Cookies
          </button>
        </div>
        <div class="text-xs text-gray-500 mt-2 sm:mt-0">
          Ampli Calçados Eireli - CNPJ: 33.174.649/0001-88 © Todos os direitos reservados. 2025
        </div>
      </div>
    </footer>
    <CookieBanner />
  </div>
</template>

<script setup>
// Layout padrão com Header e Notifications
</script>
<script>
export default {
  components: { CookieBanner: () => import('~/components/CookieBanner.vue') },
};
</script>

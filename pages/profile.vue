<template>
  <div class="min-h-screen bg-neutral-light">
    <!-- Breadcrumb -->
    <div class="bg-white border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 py-3">
        <nav class="flex items-center space-x-2 text-sm">
          <NuxtLink to="/" class="text-gray-500 hover:text-coral-soft transition-colors">
            Início
          </NuxtLink>
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
          <span class="text-coral-soft font-medium">Meu Perfil</span>
        </nav>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <UserProfile />
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  requiresAuth: true,
});

useHead({
  title: 'Meu Perfil - AMPLI CALÇADOS',
  meta: [
    {
      name: 'description',
      content: 'Gerencie seus dados pessoais e preferências na AMPLI CALÇADOS',
    },
  ],
});
</script>

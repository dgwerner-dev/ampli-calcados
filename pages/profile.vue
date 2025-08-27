<template>
  <div>
    <AppHeader />
    <div class="pt-20">
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

<template>
  <div>
    <AppHeader />
    <div class="pt-20">
      <OrdersHistory />
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  requiresAuth: true,
});

useHead({
  title: 'Meus Pedidos - AMPLI CALÇADOS',
  meta: [
    {
      name: 'description',
      content: 'Acompanhe todos os seus pedidos e status de entrega na AMPLI CALÇADOS',
    },
  ],
});
</script>

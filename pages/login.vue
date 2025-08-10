<template>
  <div class="pt-24">
    <!-- A página apenas aciona o modal de login -->
    <div class="max-w-xl mx-auto text-center text-gray-700">
      <h1 class="text-2xl font-bold mb-4">Entrar</h1>
      <p>Se o modal não abrir automaticamente, clique em "Login" no topo.</p>
    </div>
  </div>
</template>

<script setup>
// Ao montar, forçar abertura do modal de login via estado do header
onMounted(() => {
  // Usamos um evento simples para sinalizar ao header abrir o modal
  window.dispatchEvent(new CustomEvent('open-auth-modal'));
});

useHead({
  title: 'Login - AMPLI CALÇADOS',
});
</script>

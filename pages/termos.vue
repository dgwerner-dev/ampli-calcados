<template>
  <div class="max-w-4xl mx-auto py-16 px-4 text-gray-800">
    <h1 class="text-3xl font-bold mb-6">Termos de Uso</h1>
    <p class="mb-4">Ao utilizar este site, você concorda com estes Termos de Uso.</p>
    <h2 class="text-xl font-semibold mt-8 mb-2">Conta</h2>
    <p>Você é responsável por manter a confidencialidade das credenciais da sua conta.</p>
    <h2 class="text-xl font-semibold mt-8 mb-2">Compras</h2>
    <p>Pedidos estão sujeitos à confirmação de estoque e pagamento.</p>
    <h2 class="text-xl font-semibold mt-8 mb-2">Privacidade</h2>
    <p>
      O uso dos seus dados pessoais é regido pela nossa
      <NuxtLink to="/privacidade" class="text-coral-soft underline"
        >Política de Privacidade</NuxtLink
      >.
    </p>
    <p class="text-sm text-gray-500 mt-8">
      Última atualização: {{ new Date().toLocaleDateString() }}
    </p>
  </div>
</template>

<script setup>
useHead({ title: 'Termos de Uso - AMPLI CALÇADOS' });
</script>

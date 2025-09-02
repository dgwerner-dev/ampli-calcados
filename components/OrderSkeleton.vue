<template>
  <div class="space-y-6">
    <div
      v-for="i in count"
      :key="i"
      class="bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden animate-pulse"
    >
      <!-- Header do pedido -->
      <div class="px-6 py-5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <!-- Botão de expansão skeleton -->
            <div class="w-8 h-8 bg-gray-200 rounded-xl"></div>

            <!-- Ícone do pedido skeleton -->
            <div class="w-10 h-10 bg-gray-200 rounded-xl"></div>

            <div class="space-y-2">
              <!-- Número do pedido skeleton -->
              <div class="h-6 bg-gray-200 rounded w-32"></div>
              <!-- Data skeleton -->
              <div class="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          </div>

          <!-- Status skeleton -->
          <div class="w-20 h-6 bg-gray-200 rounded-full"></div>
        </div>
      </div>

      <!-- Conteúdo do pedido -->
      <div class="p-6">
        <div class="space-y-4">
          <!-- Item do pedido skeleton -->
          <div class="flex items-center space-x-4">
            <!-- Imagem do produto skeleton -->
            <div class="w-16 h-16 bg-gray-200 rounded-lg"></div>

            <div class="flex-1 space-y-2">
              <!-- Nome do produto skeleton -->
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              <!-- Detalhes do produto skeleton -->
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>

            <!-- Preço skeleton -->
            <div class="w-20 h-4 bg-gray-200 rounded"></div>
          </div>

          <!-- Botões de ação skeleton -->
          <div class="flex space-x-3 pt-4">
            <div class="w-24 h-8 bg-gray-200 rounded-lg"></div>
            <div class="w-32 h-8 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = withDefaults(defineProps<{
  count?: number;
}>(), {
  count: 3,
});
</script>

<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-md">
    <ul class="divide-y divide-gray-200">
      <li v-for="i in count" :key="i" class="px-6 py-4">
        <div class="flex items-center">
          <!-- Imagem skeleton -->
          <div class="flex-shrink-0 h-16 w-16">
            <div class="h-16 w-16 bg-gray-200 rounded animate-pulse"></div>
          </div>
          
          <div class="ml-4 flex-1">
            <div class="flex justify-between">
              <div class="space-y-2">
                <!-- Nome do produto skeleton -->
                <div class="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                <!-- Tamanho/Cor skeleton -->
                <div class="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
              
              <div class="text-right space-y-2">
                <!-- Preço total skeleton -->
                <div class="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                <!-- Preço unitário skeleton -->
                <div class="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
            </div>
            
            <div class="flex justify-between items-center mt-4">
              <!-- Controles de quantidade skeleton -->
              <div class="flex items-center space-x-2">
                <div class="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                <div class="w-8 h-6 bg-gray-200 rounded animate-pulse"></div>
                <div class="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
              </div>
              
              <!-- Botão remover skeleton -->
              <div class="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </li>
    </ul>
    
    <!-- Resumo do carrinho skeleton -->
    <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
      <div class="space-y-3">
        <div class="flex justify-between">
          <div class="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
          <div class="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
        </div>
        <div class="flex justify-between">
          <div class="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
          <div class="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
        </div>
        <div class="flex justify-between pt-2 border-t border-gray-300">
          <div class="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
          <div class="h-5 bg-gray-200 rounded w-28 animate-pulse"></div>
        </div>
      </div>
      
      <!-- Botão finalizar compra skeleton -->
      <div class="mt-6">
        <div class="w-full h-12 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
interface Props {
  count?: number;
}

const props = withDefaults(defineProps<Props>(), {
  count: 3,
});
</script>

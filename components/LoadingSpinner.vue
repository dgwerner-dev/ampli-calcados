<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div class="relative">
      <!-- Spinner principal -->
      <div class="animate-spin rounded-full border-2 border-gray-200" :class="spinnerClass"></div>

      <!-- Spinner interno com cor -->
      <div
        class="absolute top-0 left-0 animate-spin rounded-full border-2 border-transparent border-t-coral-soft"
        :class="spinnerClass"
      ></div>

      <!-- Texto de loading opcional -->
      <div v-if="text" class="mt-3 text-center">
        <p class="text-sm text-gray-600 font-medium">{{ text }}</p>
        <p v-if="subtext" class="text-xs text-gray-500 mt-1">{{ subtext }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: value => ['sm', 'md', 'lg', 'xl'].includes(value),
  },
  text: {
    type: String,
    default: '',
  },
  subtext: {
    type: String,
    default: '',
  },
  fullHeight: {
    type: Boolean,
    default: false,
  },
});

const containerClass = computed(() => {
  if (props.fullHeight) {
    return 'min-h-[200px]';
  }
  return 'py-8';
});

const spinnerClass = computed(() => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };
  return sizeMap[props.size];
});
</script>

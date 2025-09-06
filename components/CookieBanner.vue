<template>
  <div v-if="show" class="fixed inset-x-0 bottom-0 z-50">
    <div
      class="max-w-7xl mx-auto m-4 p-4 bg-white border border-gray-200 rounded-xl shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
    >
      <div class="text-sm text-gray-700">
        Utilizamos cookies essenciais para o funcionamento do site. Saiba mais em nossa
        <NuxtLink to="/privacidade" class="text-coral-soft underline"
          >Política de Privacidade</NuxtLink
        >.
        <span class="ml-2 text-gray-500">Versão: {{ policyVersion }}</span>
      </div>
      <div class="flex gap-2">
        <button
          @click="accept"
          class="px-4 py-2 bg-coral-soft text-white rounded-lg text-sm hover:bg-coral-dark"
        >
          Aceitar
        </button>
        <button
          @click="decline"
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
        >
          Somente essenciais
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const show = ref(false);
const policyVersion = useRuntimeConfig().public.policyVersion;

onMounted(() => {
  try {
    const val = localStorage.getItem('cookie-consent');
    const acceptedVersion = localStorage.getItem('cookie-consent-version');
    const hasAccepted = val === 'accepted' || val === 'essential';
    show.value = !hasAccepted || acceptedVersion !== policyVersion;
  } catch {}

  // Permitir reabrir preferências
  window.addEventListener('open-cookie-preferences', () => {
    show.value = true;
  });
});

const accept = () => {
  try {
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('cookie-consent-version', policyVersion);
  } catch {}
  show.value = false;
};

const decline = () => {
  try {
    localStorage.setItem('cookie-consent', 'essential');
    localStorage.setItem('cookie-consent-version', policyVersion);
  } catch {}
  show.value = false;
};
</script>

<template>
  <div>
    <div
      v-if="blocked"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        class="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 space-y-4"
      >
        <div class="space-y-1">
          <h2 class="text-lg font-semibold text-gray-900">
            Acesso bloqueado por preferências de cookies
          </h2>
          <p class="text-sm text-gray-700">
            Você recusou o uso de cookies. Para continuar navegando, selecione "Somente essenciais"
            ou "Aceitar". Saiba mais em nossa
            <NuxtLink to="/privacidade" class="text-coral-soft underline"
              >Política de Privacidade</NuxtLink
            >.
            <span class="ml-1 text-gray-500">Versão: {{ policyVersion }}</span>
          </p>
        </div>
        <div class="flex flex-col sm:flex-row gap-2 justify-end">
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

    <div v-if="show" class="fixed inset-x-0 bottom-0 z-40">
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
          <button
            @click="refuse"
            class="px-4 py-2 border border-red-300 text-red-700 rounded-lg text-sm hover:bg-red-50"
          >
            Recusar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const show = ref(false);
const blocked = ref(false);
const policyVersion = useRuntimeConfig().public.policyVersion;

onMounted(() => {
  try {
    const val = localStorage.getItem('cookie-consent');
    const acceptedVersion = localStorage.getItem('cookie-consent-version');
    const isRefused = val === 'refused';
    const hasAccepted = val === 'accepted' || val === 'essential';
    if (isRefused) {
      blocked.value = true;
      show.value = false;
    } else {
      show.value = !hasAccepted || acceptedVersion !== policyVersion;
    }
  } catch {}

  // Permitir reabrir preferências
  window.addEventListener('open-cookie-preferences', () => {
    if (!blocked.value) {
      show.value = true;
    }
  });
});

const accept = () => {
  try {
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('cookie-consent-version', policyVersion);
  } catch {}
  show.value = false;
  blocked.value = false;
};

const decline = () => {
  try {
    localStorage.setItem('cookie-consent', 'essential');
    localStorage.setItem('cookie-consent-version', policyVersion);
  } catch {}
  show.value = false;
  blocked.value = false;
};

const refuse = () => {
  try {
    localStorage.setItem('cookie-consent', 'refused');
    localStorage.setItem('cookie-consent-version', policyVersion);
  } catch {}
  blocked.value = true;
  show.value = false;
};
</script>

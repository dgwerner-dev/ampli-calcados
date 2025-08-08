<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
    <!-- Top Bar -->
    <div class="bg-gray-100 py-2 px-4">
      <div class="max-w-7xl mx-auto flex justify-between items-center text-sm">
        <div class="flex items-center space-x-4">
          <a href="#" class="text-gray-700 hover:text-black transition-colors duration-200"
            >Clube AMPLI</a
          >
          <span class="text-gray-400">|</span>
          <button
            @click="showAuthModal = true"
            class="text-gray-700 hover:text-black transition-colors duration-200"
          >
            {{ user ? user.email : 'Login' }}
          </button>
        </div>
        <div class="flex items-center space-x-6 text-gray-700 font-medium">
          <span class="text-coral-soft font-semibold"
            >Frete grátis nas compras acima de R$ 599</span
          >
          <span class="hidden md:inline">|</span>
          <span class="hidden md:inline">Parcele em até 5x sem juros</span>
          <span class="hidden lg:inline">|</span>
          <span class="hidden lg:inline text-coral-soft font-semibold"
            >10% de desconto em pgto. à vista</span
          >
        </div>
      </div>
    </div>

    <!-- Main Header -->
    <div class="bg-white py-6 px-4 border-b border-gray-100">
      <div class="max-w-7xl mx-auto">
        <!-- Logo Row -->
        <div class="flex items-center justify-between mb-4">
          <!-- Logo -->
          <div class="flex-shrink-0">
            <h1 class="text-3xl font-bold text-black tracking-wide">AMPLI CALÇADOS</h1>
          </div>

          <!-- Right Side Icons -->
          <div class="flex items-center space-x-2">
            <!-- Search -->
            <div class="relative hidden md:block">
              <input
                type="text"
                placeholder="Buscar produtos..."
                class="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-transparent text-sm"
              />
              <svg
                class="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>

            <!-- User Menu -->
            <div v-if="user" class="relative">
              <button
                @click="showUserMenu = !showUserMenu"
                class="flex items-center space-x-1 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <svg
                  class="w-5 h-5 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
              </button>

              <!-- User Dropdown -->
              <div
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
              >
                <div class="px-4 py-2 border-b border-gray-100">
                  <p class="text-sm font-medium text-gray-900 select-none">{{ user.email }}</p>
                  <p class="text-xs text-gray-500">{{ user.name || 'Usuário' }}</p>
                  <p class="text-xs text-coral-soft font-semibold">
                    {{ user.role === 'ADMIN' ? 'Administrador' : 'Usuário' }}
                  </p>
                </div>

                <!-- Admin Actions -->
                <div v-if="user.role === 'ADMIN'" class="border-b border-gray-100">
                  <button
                    @click="openCreateUserModal"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg
                      class="w-4 h-4 inline mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      ></path>
                    </svg>
                    Criar Usuário
                  </button>
                  <button
                    @click="openAdminPanel"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg
                      class="w-4 h-4 inline mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      ></path>
                    </svg>
                    Painel Administrativo
                  </button>
                </div>

                <button
                  @click="handleLogout"
                  :disabled="isLoggingOut"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    v-if="!isLoggingOut"
                    class="w-4 h-4 inline mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    ></path>
                  </svg>
                  <svg
                    v-else
                    class="w-4 h-4 inline mr-2 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    ></path>
                  </svg>
                  {{ isLoggingOut ? 'Saindo...' : 'Sair' }}
                </button>
              </div>
            </div>

            <!-- Wishlist -->
            <button class="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
              <svg
                class="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                ></path>
              </svg>
            </button>

            <!-- Cart -->
            <button
              class="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 relative"
            >
              <svg
                class="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                ></path>
              </svg>
              <span
                class="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
                >0</span
              >
            </button>

            <!-- Mobile Menu Button -->
            <button
              @click="toggleMobileMenu"
              class="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <svg
                class="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Navigation Menu -->
        <nav class="hidden lg:flex items-center space-x-8">
          <a
            href="#"
            class="text-gray-700 hover:text-black transition-colors font-medium text-sm uppercase tracking-wide"
            >BIRKEN</a
          >
          <a
            href="#"
            class="text-gray-700 hover:text-black transition-colors font-medium text-sm uppercase tracking-wide"
            >BOTAS</a
          >
          <a
            href="#"
            class="text-gray-700 hover:text-black transition-colors font-medium text-sm uppercase tracking-wide"
            >LINHA FLATS</a
          >
          <a
            href="#"
            class="text-gray-700 hover:text-black transition-colors font-medium text-sm uppercase tracking-wide"
            >SCARPINS</a
          >
          <a
            href="#"
            class="text-gray-700 hover:text-black transition-colors font-medium text-sm uppercase tracking-wide"
            >SANDÁLIAS</a
          >
          <a
            href="#"
            class="text-gray-700 hover:text-black transition-colors font-medium text-sm uppercase tracking-wide"
            >LINHA OXFORD</a
          >
          <a
            href="#"
            class="text-gray-700 hover:text-black transition-colors font-medium text-sm uppercase tracking-wide"
            >LINHA MOCASSIM</a
          >
          <a
            href="#"
            class="text-gray-700 hover:text-black transition-colors font-medium text-sm uppercase tracking-wide"
            >SAPATILHAS</a
          >
          <a
            href="#"
            class="text-gray-700 hover:text-black transition-colors font-medium text-sm uppercase tracking-wide"
            >RASTEIRAS</a
          >
        </nav>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="mobileMenuOpen" class="lg:hidden bg-white border-t border-gray-200 shadow-lg">
      <div class="px-4 py-3 space-y-1">
        <a
          href="#"
          class="block py-3 px-2 text-gray-700 hover:text-black hover:bg-gray-50 transition-colors duration-200 rounded-lg font-medium"
          >BIRKEN</a
        >
        <a
          href="#"
          class="block py-3 px-2 text-gray-700 hover:text-black hover:bg-gray-50 transition-colors duration-200 rounded-lg font-medium"
          >BOTAS</a
        >
        <a
          href="#"
          class="block py-3 px-2 text-gray-700 hover:text-black hover:bg-gray-50 transition-colors duration-200 rounded-lg font-medium"
          >LINHA FLATS</a
        >
        <a
          href="#"
          class="block py-3 px-2 text-gray-700 hover:text-black hover:bg-gray-50 transition-colors duration-200 rounded-lg font-medium"
          >SCARPINS</a
        >
        <a
          href="#"
          class="block py-3 px-2 text-gray-700 hover:text-black hover:bg-gray-50 transition-colors duration-200 rounded-lg font-medium"
          >SANDÁLIAS</a
        >
        <a
          href="#"
          class="block py-3 px-2 text-gray-700 hover:text-black hover:bg-gray-50 transition-colors duration-200 rounded-lg font-medium"
          >LINHA OXFORD</a
        >
        <a
          href="#"
          class="block py-3 px-2 text-gray-700 hover:text-black hover:bg-gray-50 transition-colors duration-200 rounded-lg font-medium"
          >LINHA MOCASSIM</a
        >
        <a
          href="#"
          class="block py-3 px-2 text-gray-700 hover:text-black hover:bg-gray-50 transition-colors duration-200 rounded-lg font-medium"
          >SAPATILHAS</a
        >
        <a
          href="#"
          class="block py-3 px-2 text-gray-700 hover:text-black hover:bg-gray-50 transition-colors duration-200 rounded-lg font-medium"
          >RASTEIRAS</a
        >
      </div>
    </div>

    <!-- Auth Modal -->
    <AuthModal
      :is-open="showAuthModal"
      @close="showAuthModal = false"
      @login-success="handleLoginSuccess"
    />

    <!-- Create User Modal -->
    <AuthModal
      :is-open="showCreateUserModal"
      @close="showCreateUserModal = false"
      :mode="'create-user'"
    />

    <!-- Admin Panel -->
    <AdminPanel :is-open="showAdminPanel" @close="showAdminPanel = false" />
  </header>
</template>

<script setup>
const mobileMenuOpen = ref(false);
const showAuthModal = ref(false);
const showUserMenu = ref(false);
const showCreateUserModal = ref(false);
const showAdminPanel = ref(false);
const isLoggingOut = ref(false);

const { user, signOut, initAuth, refreshUserState } = useAuth();

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const { success, error } = useNotifications();

const handleLogout = async () => {
  isLoggingOut.value = true;
  try {
    await signOut();
    showUserMenu.value = false;
    success('Logout realizado com sucesso!');
  } catch (err) {
    error('Erro ao fazer logout. Tente novamente.');
  } finally {
    isLoggingOut.value = false;
  }
};

const openCreateUserModal = () => {
  showCreateUserModal.value = true;
  showUserMenu.value = false;
};

const openAdminPanel = () => {
  showAdminPanel.value = true;
  showUserMenu.value = false;
};

const handleLoginSuccess = async () => {
  // Forçar atualização do estado do usuário
  await refreshUserState();
  success('Login realizado com sucesso!');
};

// Inicializar autenticação quando o componente for montado
onMounted(() => {
  initAuth();
});

// Fechar menu do usuário quando clicar fora
onMounted(() => {
  document.addEventListener('click', e => {
    const userMenu = document.querySelector('[data-user-menu]');
    if (userMenu && !userMenu.contains(e.target)) {
      showUserMenu.value = false;
    }
  });
});
</script>

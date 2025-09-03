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
            type="button"
            @click="handleTopLoginClick"
            class="text-gray-700 hover:text-black transition-colors duration-200"
            data-testid="login-button"
          >
            <ClientOnly fallback="Login">
              {{ user ? 'Bem-vindo, ' + (user.name || user.email) : 'Login' }}
            </ClientOnly>
          </button>
        </div>
        <div class="flex items-center space-x-6 text-gray-700 font-medium">
          <ClientOnly fallback="Frete grátis em promoções especiais">
            <span
              :class="
                freeShippingInfo?.hasPromotion ? 'text-coral-soft font-semibold' : 'text-gray-500'
              "
            >
              {{ freeShippingMessage }}
            </span>
          </ClientOnly>
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
            <NuxtLink to="/" class="text-3xl font-bold text-coral-soft tracking-wide">
              <div class="flex items-center">
                <span
                  class="[font-family:Raleway] font-light uppercase tracking-[0.3em] text-black"
                >
                  AMPLI
                </span>
                <span class="[font-family:Raleway] font-thin uppercase tracking-[0.18em] ml-2">
                  CALÇADOS
                </span>
              </div>
            </NuxtLink>
          </div>

          <!-- Search and Filter Section -->
          <div class="flex items-center space-x-4">
            <!-- Size Filter -->
            <div class="flex items-center space-x-3 text-sm">
              <span class="text-gray-500 font-medium">Compre por tamanho:</span>
              <div class="flex items-center space-x-2">
                <button
                  v-for="size in sizes"
                  :key="size"
                  @click="filterBySize(size)"
                  :class="[
                    'px-3 py-1 border rounded-full font-semibold transition-all duration-200 ease-in-out',
                    isSizeSelected(size)
                      ? 'bg-coral-soft text-white border-coral-soft'
                      : 'border-gray-200 text-gray-700 hover:bg-coral-soft hover:text-white hover:border-coral-soft',
                  ]"
                >
                  {{ size }}
                </button>
              </div>
            </div>

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
            <ClientOnly>
              <div v-if="user" class="relative">
                <button
                  data-user-toggle
                  type="button"
                  @click.stop="showUserMenu = !showUserMenu"
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
                  v-show="showUserMenu"
                  data-user-menu
                  class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                >
                  <div class="px-4 py-2 border-b border-gray-100">
                    <p class="text-sm font-medium text-gray-900 select-none">{{ user.email }}</p>
                    <p class="text-xs text-gray-500">{{ user.name || 'Usuário' }}</p>
                    <p class="text-xs text-coral-soft font-semibold">
                      {{ user.role === 'ADMIN' ? 'Administrador' : 'Usuário' }}
                    </p>
                  </div>

                  <!-- User Actions -->
                  <div class="border-b border-gray-100">
                    <button
                      type="button"
                      @mousedown.stop.prevent
                      @click.stop.prevent="goTo('/profile')"
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer flex items-center"
                    >
                      <svg
                        class="w-4 h-4 mr-2 flex-shrink-0"
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
                      Meu Perfil
                    </button>

                    <button
                      type="button"
                      @mousedown.stop.prevent
                      @click.stop.prevent="goTo('/orders')"
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer flex items-center"
                    >
                      <svg
                        class="w-4 h-4 mr-2 flex-shrink-0"
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
                      Meus Pedidos
                    </button>
                  </div>

                  <!-- Admin Actions (link para página) -->
                  <div v-if="user.role === 'ADMIN'" class="border-b border-gray-100">
                    <button
                      type="button"
                      @mousedown.stop.prevent
                      @click.stop.prevent="goTo('/admin')"
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer flex items-center"
                    >
                      <svg
                        class="w-4 h-4 mr-2 flex-shrink-0"
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
                    @click="forceLogout"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                  >
                    <svg
                      v-if="!isLoggingOut"
                      class="w-4 h-4 mr-2 flex-shrink-0"
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
                      class="w-4 h-4 mr-2 flex-shrink-0 animate-spin"
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
            </ClientOnly>

            <!-- Wishlist -->
            <button
              @click="navigateToWishlist"
              class="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 relative"
              data-testid="wishlist-button"
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
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                ></path>
              </svg>
              <ClientOnly>
                <span
                  v-if="wishlistCount > 0"
                  class="absolute -top-1 -right-1 bg-coral-soft text-white text-xs rounded-full min-w-[16px] h-4 flex items-center justify-center px-1"
                  >{{ wishlistCount }}</span
                >
              </ClientOnly>
            </button>

            <!-- Cart -->
            <button
              @click="navigateToCart"
              class="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 relative"
              data-testid="cart-button"
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
              <ClientOnly>
                <span
                  v-if="cartItemCount > 0"
                  class="absolute -top-1 -right-1 bg-coral-soft text-white text-xs rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 cart-count"
                  data-testid="cart-count"
                  >{{ cartItemCount }}</span
                >
              </ClientOnly>
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
          <NuxtLink
            to="/produtos"
            class="text-coral-soft hover:text-coral-dark transition-colors font-medium text-sm uppercase tracking-wide"
            style="font-family: 'Raleway', sans-serif !important"
          >
            Produtos
          </NuxtLink>
          <NuxtLink
            v-for="category in categories"
            :key="category.id"
            :to="`/categoria/${category.slug}`"
            class="text-coral-soft hover:text-coral-dark transition-colors font-medium text-sm uppercase tracking-wide"
            style="font-family: 'Raleway', sans-serif !important"
          >
            {{ category.name }}
          </NuxtLink>
        </nav>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="mobileMenuOpen" class="lg:hidden bg-white border-t border-gray-200 shadow-lg">
      <div class="px-4 py-3 space-y-1">
        <NuxtLink
          v-for="category in categories"
          :key="category.id"
          :to="`/categoria/${category.slug}`"
          @click="toggleMobileMenu"
          class="block py-3 px-2 text-gray-700 hover:text-black hover:bg-gray-50 transition-colors duration-200 rounded-lg font-medium"
          style="font-family: 'Raleway', sans-serif !important"
        >
          {{ category.name }}
        </NuxtLink>
      </div>
    </div>

    <!-- Auth Modal -->
    <AuthModal
      :is-open="showAuthModal"
      @close="showAuthModal = false"
      @login-success="handleLoginSuccess"
    />
  </header>
</template>

<script setup lang="ts">
const mobileMenuOpen = ref(false);
const showAuthModal = ref(false);
const showUserMenu = ref(false);
const isLoggingOut = ref(false);
const sizes = [40, 41, 42, 43];
const categories = ref<any[]>([]);

const navigateToCart = () => {
  navigateTo('/cart');
};

const navigateToWishlist = () => {
  navigateTo('/wishlist');
};

const { user, signOut, initAuth, refreshUserState } = useAuth();
const { itemCount: cartItemCount } = useCart();
const { wishlistCount, loadWishlistAsync } = useWishlist();
const supabase = useSupabaseClient();

// Garantir que o carrinho e wishlist sejam inicializados no cliente
onMounted(() => {
  // Forçar inicialização do carrinho no cliente
  if (process.client) {
    const { loadCart } = useCart();
    loadCart();

    // Verificar status da wishlist baseado na autenticação
    if (user.value) {
      console.log('✅ AppHeader - Usuário autenticado, carregando wishlist');
      loadWishlistAsync();
    } else {
      console.log('❌ AppHeader - Usuário não autenticado, limpando wishlist');
      const { clearWishlist } = useWishlist();
      clearWishlist();
    }
  }
});

// Watcher para carregar wishlist quando usuário fizer login
watch(user, newUser => {
  console.log('👤 AppHeader - Status do usuário mudou:', !!newUser);
  if (process.client) {
    if (newUser) {
      console.log('✅ AppHeader - Usuário logado, carregando wishlist');
      loadWishlistAsync();
    } else {
      console.log('❌ AppHeader - Usuário deslogado, limpando wishlist');
      // Limpar wishlist quando usuário deslogar
      const { clearWishlist } = useWishlist();
      clearWishlist();
    }
  }
});

const loadCategories = async () => {
  try {
    const response = await $fetch('/api/categories');
    
    // Verificar se a API retornou sucesso
    if (response.success) {
      categories.value = response.categories || [];
    } else {
      console.error('Erro na API de categorias:', response.error);
      categories.value = [];
    }
  } catch (err) {
    console.error('Erro ao carregar categorias:', err);
    categories.value = [];
  }
};

watch(user, () => {
  // força reatividade do dropdown quando o user muda
});

const filterBySize = (size: number) => {
  // Navegar para a página de produtos com filtro por tamanho
  navigateTo({
    path: '/produtos',
    query: { tamanho: size.toString() },
  });
};

const isSizeSelected = (size: number) => {
  const route = useRoute();
  const tamanhoQuery = route.query.tamanho;
  return tamanhoQuery && parseInt(tamanhoQuery as string) === size;
};

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};
const handleTopLoginClick = () => {
  if (!user.value) {
    showAuthModal.value = true;
  } else {
    // abre menu do usuário ao clicar no saudação
    showUserMenu.value = !showUserMenu.value;
  }
};

const { success, error } = useNotifications();

// Informações de frete grátis
const { freeShippingInfo, loadFreeShippingInfo } = useFreeShippingInfo();

// Computed para garantir reatividade
const freeShippingMessage = computed(() => {
  if (freeShippingInfo.value?.hasPromotion) {
    return freeShippingInfo.value.message;
  }
  return 'Frete grátis em promoções especiais';
});

const forceLogout = async () => {
  if (typeof window === 'undefined') return;
  if (isLoggingOut.value) return;
  isLoggingOut.value = true;

  try {
    // Logout real do Supabase
    if (supabase?.auth?.signOut) {
      await supabase.auth.signOut();
    }
  } catch (err) {
    console.warn('Erro ao fazer signOut do Supabase:', err);
  }

  try {
    // Limpar dados do usuário sem modificar a referência
    if (user.value) {
      Object.assign(user.value, {});
    }
    window.localStorage.removeItem('cart');
    window.localStorage.removeItem('nuxt-storage');
    window.sessionStorage.clear();
  } catch (err) {
    console.warn('Erro ao limpar storage:', err);
  }

  window.location.href = '/';
};

const handleLogout = forceLogout;

const handleLoginSuccess = async () => {
  // Forçar atualização do estado do usuário
  await refreshUserState();
  success('Login realizado com sucesso!');
};

const router = useRouter();
const goTo = async (path: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🚀 goTo chamado com path:', path);
  }
  showUserMenu.value = false;

  try {
    // Aguardar router estar pronto
    if (!router) {
      if (process.env.NODE_ENV === 'development') {
        console.log('⏳ Router não disponível, aguardando...');
      }
      await nextTick();
    }

    // Verificar se ainda estamos no cliente
    if (process.client) {
      if (process.env.NODE_ENV === 'development') {
        console.log('🌐 Executando navegação no cliente...');
      }
      await router.push(path);
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Navegação para', path, 'realizada com sucesso');
      }
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Redirecionando via window.location...');
      }
      window.location.href = path;
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Erro na navegação para', path, ':', error);
    }

    // Fallback: usar window.location se router falhar
    if (process.client) {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Fallback: usando window.location...');
      }
      window.location.href = path;
    }
  }
};

// Removido goToOrders específico em favor de goTo genérico

// Inicializar autenticação quando o componente for montado
onMounted(() => {
  initAuth();
  loadCategories();
  // Adicionar um pequeno delay para garantir que a API esteja disponível
  setTimeout(() => {
    loadFreeShippingInfo();
  }, 100);

  // Abrir modal de login quando a página /login emitir evento
  const openModal = () => {
    showAuthModal.value = true;
  };
  window.addEventListener('open-auth-modal', openModal);

  // Também detectar query ?login=1 para abrir modal direto
  const route = useRoute();
  if (route.query.login === '1') {
    showAuthModal.value = true;
  }

  onBeforeUnmount(() => {
    window.removeEventListener('open-auth-modal', openModal);
  });
});

// Versão simplificada do fechar menu (sem interferir no logout)
const handleOutsideClick = (e: MouseEvent) => {
  const menu = document.querySelector('[data-user-menu]');
  const toggle = document.querySelector('[data-user-toggle]');
  const target = e.target as Node;

  // Só fechar se realmente clicou fora de tudo
  if (menu && !menu.contains(target) && toggle && !toggle.contains(target)) {
    // Usar setTimeout para não interferir com outros clicks
    setTimeout(() => {
      showUserMenu.value = false;
    }, 50);
  }
};

onMounted(() => {
  // Adicionar listener com delay para não interferir
  setTimeout(() => {
    document.addEventListener('click', handleOutsideClick);
  }, 100);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutsideClick);
});
</script>

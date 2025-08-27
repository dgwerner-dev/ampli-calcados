import { ref, computed } from 'vue';

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  size?: string | null;
  color?: string | null;
  product: {
    id: string;
    name: string;
    images: string[];
    price: number;
    slug: string;
  };
}

export const useCart = () => {
  const cart = ref<CartItem[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Carregar carrinho do localStorage
  const loadCart = () => {
    if (process.client) {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          cart.value = JSON.parse(savedCart);
        } catch (err) {
          console.error('Erro ao carregar carrinho:', err);
          cart.value = [];
        }
      }
    }
  };

  // Salvar carrinho no localStorage
  const saveCart = () => {
    if (process.client) {
      localStorage.setItem('cart', JSON.stringify(cart.value));
      console.log('💾 Carrinho salvo:', cart.value);
    }
  };

  // Adicionar item ao carrinho
  const addToCart = async (product: any, quantity: number = 1, size?: string, color?: string) => {
    console.log('🛒 Adicionando ao carrinho:', { product, quantity, size, color });
    loading.value = true;
    error.value = null;

    try {
      // Verificar se o produto já está no carrinho
      const existingItemIndex = cart.value.findIndex(
        item => 
          item.productId === product.id && 
          item.size === size && 
          item.color === color
      );

      if (existingItemIndex !== -1) {
        // Atualizar quantidade do item existente
        cart.value[existingItemIndex].quantity += quantity;
      } else {
        // Adicionar novo item
        const newItem: CartItem = {
          id: `${product.id}-${size || 'default'}-${color || 'default'}`,
          productId: product.id,
          quantity,
          price: product.salePrice ? parseFloat(product.salePrice) : product.price,
          size: size || null,
          color: color || null,
          product: {
            id: product.id,
            name: product.name,
            images: product.images || [],
            price: product.salePrice ? parseFloat(product.salePrice) : product.price,
            slug: product.slug,
          },
        };
        cart.value.push(newItem);
      }

      saveCart();
      return { success: true };
    } catch (err: any) {
      error.value = err.message || 'Erro ao adicionar ao carrinho';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  // Remover item do carrinho
  const removeFromCart = (itemId: string) => {
    cart.value = cart.value.filter(item => item.id !== itemId);
    saveCart();
  };

  // Atualizar quantidade
  const updateQuantity = (itemId: string, quantity: number) => {
    const item = cart.value.find(item => item.id === itemId);
    if (item) {
      if (quantity <= 0) {
        removeFromCart(itemId);
      } else {
        item.quantity = quantity;
        saveCart();
      }
    }
  };

  // Limpar carrinho
  const clearCart = () => {
    cart.value = [];
    saveCart();
  };

  // Calcular total
  const total = computed(() => {
    return cart.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  });

  // Contar itens
  const itemCount = computed(() => {
    return cart.value.reduce((sum, item) => sum + item.quantity, 0);
  });

  // Verificar se carrinho está vazio
  const isEmpty = computed(() => cart.value.length === 0);

  // Inicializar carrinho
  if (process.client) {
    loadCart();
    console.log('🛒 Carrinho inicializado:', cart.value);
  }

  return {
    cart: computed(() => cart.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    total,
    itemCount,
    isEmpty,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    loadCart,
  };
};

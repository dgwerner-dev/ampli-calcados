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

  // Validar item do carrinho
  const validateCartItem = (item: any): boolean => {
    return (
      item &&
      typeof item === 'object' &&
      typeof item.id === 'string' &&
      typeof item.productId === 'string' &&
      typeof item.quantity === 'number' &&
      item.quantity > 0 &&
      typeof item.price === 'number' &&
      item.price > 0 &&
      item.product &&
      typeof item.product.id === 'string' &&
      typeof item.product.name === 'string'
    );
  };

  // Carregar carrinho do localStorage
  const loadCart = () => {
    if (process.client) {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          if (Array.isArray(parsedCart)) {
            // Validar cada item do carrinho
            const validItems = parsedCart.filter(validateCartItem);
            if (validItems.length !== parsedCart.length) {
              console.warn('🛒 Alguns itens do carrinho foram removidos por serem inválidos');
            }
            cart.value = validItems;
          } else {
            console.warn('🛒 Dados do carrinho não são um array válido, limpando...');
            cart.value = [];
            localStorage.removeItem('cart');
          }
        } catch (err) {
          console.error('Erro ao carregar carrinho:', err);
          cart.value = [];
          localStorage.removeItem('cart');
        }
      } else {
        cart.value = [];
      }
    }
  };

  // Salvar carrinho no localStorage
  const saveCart = () => {
    if (process.client) {
      localStorage.setItem('cart', JSON.stringify(cart.value));
    }
  };

  // Adicionar item ao carrinho
  const addToCart = async (product: any, quantity: number = 1, size?: string, color?: string) => {
    loading.value = true;
    error.value = null;

    try {
      // Verificar se o produto já está no carrinho
      const existingItemIndex = cart.value.findIndex(
        item => item.productId === product.id && item.size === size && item.color === color
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

  // Forçar limpeza completa do carrinho (incluindo localStorage)
  const forceClearCart = () => {
    cart.value = [];
    if (process.client) {
      localStorage.removeItem('cart');
      console.log('🧹 Carrinho completamente limpo');
    }
  };

  // Calcular total
  const total = computed(() => {
    return cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
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
  }

  return {
    cart: computed(() => (Array.isArray(cart.value) ? cart.value : [])),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    total,
    itemCount,
    isEmpty,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    forceClearCart,
    loadCart,
  };
};

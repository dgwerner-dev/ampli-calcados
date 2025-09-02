import { ref, computed } from 'vue';

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number | string;
  size?: string | null;
  color?: string | null;
  product: {
    id: string;
    name: string;
    images: string[];
    price: number | string;
  };
}

export interface Order {
  id: string;
  userId: string;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  total: number | string;
  shipping: number | string;
  tax: number | string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
}

export const useOrders = () => {
  const orders = ref<Order[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const getUserOrders = async () => {
    loading.value = true;
    error.value = null;

    try {
      // Simular um delay mínimo para mostrar o loading state
      await new Promise(resolve => setTimeout(resolve, 500));

      const data = await $fetch('/api/orders', {
        headers: {
          Accept: 'application/json',
        },
        timeout: 10000, // 10 segundos de timeout
      });
      orders.value = Array.isArray(data) ? data : [];

      if (process.env.NODE_ENV === 'development') {
        console.log('📦 Pedidos carregados com sucesso:', orders.value.length);
      }
    } catch (err: any) {
      if (err.statusCode === 401) {
        error.value = 'Você precisa estar logado para ver seus pedidos';
      } else if (err.name === 'TimeoutError') {
        error.value = 'Tempo limite excedido. Verifique sua conexão e tente novamente.';
      } else {
        error.value = err.message || 'Erro ao buscar pedidos';
      }

      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Erro ao buscar pedidos:', err);
      }
    } finally {
      loading.value = false;
    }
  };

  const getOrderStatusText = (status: string) => {
    const statusMap = {
      PENDING: 'Pendente',
      CONFIRMED: 'Confirmado',
      SHIPPED: 'Enviado',
      DELIVERED: 'Entregue',
      CANCELLED: 'Cancelado',
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getOrderStatusColor = (status: string) => {
    const colorMap = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colorMap[status as keyof typeof colorMap] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: number | string) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numericPrice);
  };

  return {
    orders: computed(() => orders.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    getUserOrders,
    getOrderStatusText,
    getOrderStatusColor,
    formatDate,
    formatPrice,
  };
};

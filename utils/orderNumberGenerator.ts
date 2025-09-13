import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

// Inicializar Prisma se não estiver disponível
if (typeof window === 'undefined') {
  prisma = new PrismaClient();
} else {
  // No cliente, usar o composable
  prisma = null as any;
}

/**
 * Gera um número de pedido sequencial único
 * @returns Promise<number> - Número do pedido
 */
export async function generateOrderNumber(): Promise<number> {
  try {
    // Buscar o último número de pedido
    const lastOrder = await prisma.order.findFirst({
      orderBy: {
        orderNumber: 'desc',
      },
      select: {
        orderNumber: true,
      },
    });

    // Se não há pedidos, começar com 1000
    const nextNumber = lastOrder ? lastOrder.orderNumber + 1 : 1000;

    return nextNumber;
  } catch (error) {
    console.error('Erro ao gerar número do pedido:', error);
    // Fallback: usar timestamp como número
    return Date.now();
  }
}

/**
 * Gera um número de pedido sequencial único (versão para servidor)
 * @param prismaClient - Instância do Prisma Client
 * @returns Promise<number> - Número do pedido
 */
export async function generateOrderNumberWithPrisma(prismaClient: PrismaClient): Promise<number> {
  try {
    // Buscar o último número de pedido
    const lastOrder = await prismaClient.order.findFirst({
      orderBy: {
        orderNumber: 'desc',
      },
      select: {
        orderNumber: true,
      },
    });

    // Se não há pedidos, começar com 1000
    const nextNumber = lastOrder ? lastOrder.orderNumber + 1 : 1000;

    return nextNumber;
  } catch (error) {
    console.error('Erro ao gerar número do pedido:', error);
    // Fallback: usar timestamp como número
    return Date.now();
  }
}

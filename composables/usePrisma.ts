import { PrismaClient } from '@prisma/client'

// Singleton do Prisma Client
let prisma: PrismaClient

export const usePrisma = () => {
  if (!prisma) {
    prisma = new PrismaClient()
  }
  
  return prisma
}

// Funções utilitárias para o e-commerce
export const useProductService = () => {
  const prisma = usePrisma()
  
  return {
    // Buscar todos os produtos
    async getAllProducts() {
      return await prisma.product.findMany({
        include: {
          category: true,
          reviews: {
            include: {
              user: true
            }
          }
        }
      })
    },
    
    // Buscar produtos em destaque
    async getFeaturedProducts() {
      return await prisma.product.findMany({
        where: {
          featured: true
        },
        include: {
          category: true
        }
      })
    },
    
    // Buscar produto por slug
    async getProductBySlug(slug: string) {
      return await prisma.product.findUnique({
        where: { slug },
        include: {
          category: true,
          reviews: {
            include: {
              user: true
            }
          }
        }
      })
    },
    
    // Buscar produtos por categoria
    async getProductsByCategory(categorySlug: string) {
      return await prisma.product.findMany({
        where: {
          category: {
            slug: categorySlug
          }
        },
        include: {
          category: true
        }
      })
    }
  }
}

export const useOrderService = () => {
  const prisma = usePrisma()
  
  return {
    // Criar pedido
    async createOrder(userId: string, items: any[], total: number) {
      return await prisma.order.create({
        data: {
          userId,
          total,
          shipping: 0,
          tax: 0,
          orderItems: {
            create: items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              size: item.size,
              color: item.color
            }))
          }
        },
        include: {
          orderItems: {
            include: {
              product: true
            }
          }
        }
      })
    },
    
    // Buscar pedidos do usuário
    async getUserOrders(userId: string) {
      return await prisma.order.findMany({
        where: { userId },
        include: {
          orderItems: {
            include: {
              product: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    }
  }
}

export const useWishlistService = () => {
  const prisma = usePrisma()
  
  return {
    // Adicionar à lista de desejos
    async addToWishlist(userId: string, productId: string) {
      return await prisma.wishlistItem.create({
        data: {
          userId,
          productId
        },
        include: {
          product: true
        }
      })
    },
    
    // Remover da lista de desejos
    async removeFromWishlist(userId: string, productId: string) {
      return await prisma.wishlistItem.delete({
        where: {
          userId_productId: {
            userId,
            productId
          }
        }
      })
    },
    
    // Buscar lista de desejos do usuário
    async getUserWishlist(userId: string) {
      return await prisma.wishlistItem.findMany({
        where: { userId },
        include: {
          product: true
        }
      })
    },
    
    // Verificar se produto está na lista de desejos
    async isInWishlist(userId: string, productId: string) {
      const item = await prisma.wishlistItem.findUnique({
        where: {
          userId_productId: {
            userId,
            productId
          }
        }
      })
      return !!item
    }
  }
} 
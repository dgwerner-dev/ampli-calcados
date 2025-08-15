import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedShippingData() {
  console.log('🌍 Populando dados de promoções de frete...');

  try {
    // 1. Criar promoção de frete geral
    const shippingPromotion = await prisma.shippingPromotion.create({
      data: {
        name: 'Frete Grátis Nacional',
        description: 'Frete grátis para todo o Brasil em pedidos acima de R$ 99,90',
        minOrderValue: 99.90,
        freeShipping: true,
        discountValue: 0,
        isActive: true,
      },
    });

    console.log('✅ Promoção de frete criada:', shippingPromotion.name);

    // 2. Criar regiões de frete
    const regions = [
      {
        name: 'Sudeste',
        minOrderValue: 79.90,
        zipCodeStart: '01000',
        zipCodeEnd: '39999',
        isActive: true,
      },
      {
        name: 'Sul',
        minOrderValue: 89.90,
        zipCodeStart: '80000',
        zipCodeEnd: '99999',
        isActive: true,
      },
      {
        name: 'Nordeste',
        minOrderValue: 99.90,
        zipCodeStart: '40000',
        zipCodeEnd: '65999',
        isActive: true,
      },
      {
        name: 'Centro-Oeste',
        minOrderValue: 109.90,
        zipCodeStart: '70000',
        zipCodeEnd: '79999',
        isActive: true,
      },
      {
        name: 'Norte',
        minOrderValue: 119.90,
        zipCodeStart: '66000',
        zipCodeEnd: '69999',
        isActive: true,
      },
    ];

    for (const regionData of regions) {
      const region = await prisma.shippingRegion.create({
        data: {
          ...regionData,
          shippingPromotionId: shippingPromotion.id,
        },
      });
      console.log('✅ Região criada:', region.name);
    }

    // 3. Buscar produtos para adicionar à promoção
    const products = await prisma.product.findMany({
      take: 10, // Primeiros 10 produtos
      where: {
        isActive: true,
      },
    });

    for (const product of products) {
      await prisma.shippingProduct.create({
        data: {
          productId: product.id,
          isActive: true,
          shippingPromotionId: shippingPromotion.id,
        },
      });
      console.log('✅ Produto adicionado à promoção:', product.name);
    }

    // 4. Buscar categorias para adicionar à promoção
    const categories = await prisma.category.findMany({
      take: 5, // Primeiras 5 categorias
    });

    for (const category of categories) {
      await prisma.shippingCategory.create({
        data: {
          categoryId: category.id,
          isActive: true,
          shippingPromotionId: shippingPromotion.id,
        },
      });
      console.log('✅ Categoria adicionada à promoção:', category.name);
    }

    console.log('🎉 Dados de promoções de frete populados com sucesso!');
    console.log('');
    console.log('📊 Resumo:');
    console.log(`• 1 promoção de frete criada`);
    console.log(`• ${regions.length} regiões configuradas`);
    console.log(`• ${products.length} produtos adicionados`);
    console.log(`• ${categories.length} categorias adicionadas`);

  } catch (error) {
    console.error('❌ Erro ao popular dados:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedShippingData();

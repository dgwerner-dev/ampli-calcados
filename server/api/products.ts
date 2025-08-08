import { useProductService } from '~/composables/usePrisma';

export default defineEventHandler(async event => {
  const productService = useProductService();

  try {
    const products = await productService.getAllProducts();
    return products;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao buscar produtos',
    });
  }
});

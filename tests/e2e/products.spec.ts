import { test, expect } from '@playwright/test';

test.describe('Produtos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('deve exibir grade de produtos na página inicial', async ({ page }) => {
    // Aguardar o carregamento da página e dos produtos
    await page.waitForLoadState('networkidle');

    // Aguardar especificamente pela grade de produtos
    await expect(page.locator('[data-testid="products-grid"]')).toBeVisible({ timeout: 10000 });
  });

  test('deve exibir cards de produtos', async ({ page }) => {
    const productCards = page.locator('[data-testid^="product-card-"]');
    await expect(productCards.first()).toBeVisible();
  });

  test('deve exibir informações básicas do produto', async ({ page }) => {
    const firstProduct = page.locator('[data-testid^="product-card-"]').first();

    await expect(firstProduct.locator('[data-testid="product-name"]')).toBeVisible();
    await expect(firstProduct.locator('[data-testid="product-price"]')).toBeVisible();
    await expect(firstProduct.locator('[data-testid="product-brand"]')).toBeVisible();
  });

  test('deve exibir imagem do produto', async ({ page }) => {
    const productImage = page.locator('[data-testid="product-image"]').first();
    await expect(productImage).toBeVisible();

    const src = await productImage.getAttribute('src');
    expect(src).toBeTruthy();
  });

  test('deve exibir opções de cores do produto', async ({ page }) => {
    const colorDots = page.locator('.color-dot');
    await expect(colorDots.first()).toBeVisible();
  });

  test('deve ter botão "Adicionar ao Carrinho"', async ({ page }) => {
    const addToCartButton = page.locator('[data-testid="add-to-cart-button"]').first();
    await expect(addToCartButton).toBeVisible();
    await expect(addToCartButton).toHaveText('Adicionar ao Carrinho');
  });

  test('deve ter botão de wishlist', async ({ page }) => {
    const wishlistButton = page.locator('[data-testid="wishlist-button"]').first();
    await expect(wishlistButton).toBeVisible();
  });

  test('deve ter botão "Ver Detalhes"', async ({ page }) => {
    const quickViewButton = page.locator('[data-testid="quick-view-button"]').first();
    await expect(quickViewButton).toBeVisible();
    await expect(quickViewButton).toHaveText('Ver Detalhes');
  });

  test('deve abrir modal de produto ao clicar em "Ver Detalhes"', async ({ page }) => {
    await page.click('[data-testid="quick-view-button"]');

    await expect(page.locator('.product-modal')).toBeVisible();
    await expect(page.locator('[data-testid="product-name"]')).toBeVisible();
  });

  test('deve exibir funcionalidade de ordenação', async ({ page }) => {
    const sortSelect = page.locator('[data-testid="sort-select"]');
    await expect(sortSelect).toBeVisible();

    // Verificar opções de ordenação
    await expect(sortSelect.locator('option[value="name"]')).toBeVisible();
    await expect(sortSelect.locator('option[value="price"]')).toBeVisible();
    await expect(sortSelect.locator('option[value="category"]')).toBeVisible();
  });

  test('deve ordenar produtos por nome', async ({ page }) => {
    const sortSelect = page.locator('[data-testid="sort-select"]');
    await sortSelect.selectOption('name');

    // Aguardar reordenação
    await page.waitForTimeout(1000);

    const productNames = page.locator('[data-testid="product-name"]');
    const firstProductName = await productNames.first().textContent();
    const secondProductName = await productNames.nth(1).textContent();

    expect(firstProductName <= secondProductName).toBeTruthy();
  });

  test('deve ordenar produtos por preço', async ({ page }) => {
    const sortSelect = page.locator('[data-testid="sort-select"]');
    await sortSelect.selectOption('price');

    // Aguardar reordenação
    await page.waitForTimeout(1000);

    const productPrices = page.locator('[data-testid="product-price"]');
    const firstPrice = await productPrices.first().textContent();
    const secondPrice = await productPrices.nth(1).textContent();

    // Extrair valores numéricos dos preços
    const firstValue = parseFloat(firstPrice?.replace(/[^\d,]/g, '').replace(',', '.') || '0');
    const secondValue = parseFloat(secondPrice?.replace(/[^\d,]/g, '').replace(',', '.') || '0');

    expect(firstValue <= secondValue).toBeTruthy();
  });

  test('deve exibir mensagem quando não há produtos', async ({ page }) => {
    // Este teste pode ser adaptado para cenários específicos
    // onde não há produtos disponíveis
    const noProductsMessage = page.locator('[data-testid="no-products"]');

    // Se não há produtos, deve exibir a mensagem
    if (await noProductsMessage.isVisible()) {
      await expect(noProductsMessage).toContainText('Nenhum produto encontrado');
    }
  });

  test('deve navegar para página de produtos', async ({ page }) => {
    await page.click('a[href="/produtos"]');

    await expect(page).toHaveURL(/.*produtos/);
  });

  test('deve exibir preços formatados corretamente', async ({ page }) => {
    const productPrices = page.locator('[data-testid="product-price"]');
    const firstPrice = await productPrices.first().textContent();

    // Verificar se o preço está no formato R$ X,XX
    expect(firstPrice).toMatch(/R\$\s*\d+,\d{2}/);
  });

  test('deve ter estrutura responsiva', async ({ page }) => {
    // Testar em diferentes tamanhos de tela
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile
    await expect(page.locator('[data-testid="products-grid"]')).toBeVisible();

    await page.setViewportSize({ width: 1024, height: 768 }); // Desktop
    await expect(page.locator('[data-testid="products-grid"]')).toBeVisible();
  });
});

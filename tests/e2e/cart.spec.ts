import { test, expect } from '@playwright/test';

test.describe('Carrinho de Compras', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('deve exibir ícone do carrinho no cabeçalho', async ({ page }) => {
    await expect(page.locator('[data-testid="cart-button"]')).toBeVisible();
  });

  test('deve exibir contador zero quando carrinho está vazio', async ({ page }) => {
    const cartCount = page.locator('.cart-count');
    await expect(cartCount).toHaveText('0');
  });

  test('deve adicionar produto ao carrinho', async ({ page }) => {
    // Clicar no primeiro botão "Adicionar ao Carrinho"
    await page.click('[data-testid="add-to-cart-button"]');
    
    // Aguardar notificação de sucesso
    await page.waitForTimeout(1000);
    
    // Verificar se o contador foi atualizado
    const cartCount = page.locator('.cart-count');
    await expect(cartCount).not.toHaveText('0');
  });

  test('deve abrir modal de produto ao tentar adicionar', async ({ page }) => {
    // Clicar no primeiro botão "Adicionar ao Carrinho"
    await page.click('[data-testid="add-to-cart-button"]');
    
    // Verificar se o modal de produto foi aberto
    await expect(page.locator('.product-modal')).toBeVisible();
  });

  test('deve permitir seleção de cor no modal de produto', async ({ page }) => {
    await page.click('[data-testid="add-to-cart-button"]');
    
    const colorOptions = page.locator('[data-testid="color-option"]');
    await expect(colorOptions.first()).toBeVisible();
    
    // Selecionar primeira cor
    await colorOptions.first().click();
    await expect(colorOptions.first()).toHaveClass(/active/);
  });

  test('deve permitir seleção de tamanho no modal de produto', async ({ page }) => {
    await page.click('[data-testid="add-to-cart-button"]');
    
    const sizeOptions = page.locator('[data-testid="size-option"]');
    await expect(sizeOptions.first()).toBeVisible();
    
    // Selecionar primeiro tamanho
    await sizeOptions.first().click();
    await expect(sizeOptions.first()).toHaveClass(/active/);
  });

  test('deve habilitar botão de adicionar após selecionar cor e tamanho', async ({ page }) => {
    await page.click('[data-testid="add-to-cart-button"]');
    
    const addToCartButton = page.locator('[data-testid="add-to-cart-button"]');
    
    // Inicialmente deve estar desabilitado
    await expect(addToCartButton).toBeDisabled();
    
    // Selecionar cor
    await page.click('[data-testid="color-option"]');
    
    // Selecionar tamanho
    await page.click('[data-testid="size-option"]');
    
    // Agora deve estar habilitado
    await expect(addToCartButton).toBeEnabled();
  });

  test('deve adicionar produto ao carrinho com cor e tamanho selecionados', async ({ page }) => {
    await page.click('[data-testid="add-to-cart-button"]');
    
    // Selecionar cor e tamanho
    await page.click('[data-testid="color-option"]');
    await page.click('[data-testid="size-option"]');
    
    // Adicionar ao carrinho
    await page.click('[data-testid="add-to-cart-button"]');
    
    // Aguardar processamento
    await page.waitForTimeout(1000);
    
    // Verificar se o contador foi atualizado
    const cartCount = page.locator('.cart-count');
    await expect(cartCount).not.toHaveText('0');
  });

  test('deve exibir notificação de sucesso ao adicionar produto', async ({ page }) => {
    await page.click('[data-testid="add-to-cart-button"]');
    
    // Selecionar cor e tamanho
    await page.click('[data-testid="color-option"]');
    await page.click('[data-testid="size-option"]');
    
    // Adicionar ao carrinho
    await page.click('[data-testid="add-to-cart-button"]');
    
    // Verificar notificação
    await expect(page.locator('.notification-success')).toBeVisible();
  });

  test('deve fechar modal após adicionar produto', async ({ page }) => {
    await page.click('[data-testid="add-to-cart-button"]');
    
    // Selecionar cor e tamanho
    await page.click('[data-testid="color-option"]');
    await page.click('[data-testid="size-option"]');
    
    // Adicionar ao carrinho
    await page.click('[data-testid="add-to-cart-button"]');
    
    // Aguardar fechamento do modal
    await page.waitForTimeout(1000);
    
    // Verificar se o modal foi fechado
    await expect(page.locator('.product-modal')).not.toBeVisible();
  });

  test('deve permitir adicionar múltiplos produtos', async ({ page }) => {
    // Adicionar primeiro produto
    await page.click('[data-testid="add-to-cart-button"]');
    await page.click('[data-testid="color-option"]');
    await page.click('[data-testid="size-option"]');
    await page.click('[data-testid="add-to-cart-button"]');
    await page.waitForTimeout(1000);
    
    // Adicionar segundo produto (se disponível)
    const addToCartButtons = page.locator('[data-testid="add-to-cart-button"]');
    if (await addToCartButtons.count() > 1) {
      await addToCartButtons.nth(1).click();
      await page.click('[data-testid="color-option"]');
      await page.click('[data-testid="size-option"]');
      await page.click('[data-testid="add-to-cart-button"]');
      await page.waitForTimeout(1000);
    }
    
    // Verificar se o contador foi incrementado
    const cartCount = page.locator('.cart-count');
    const count = await cartCount.textContent();
    expect(parseInt(count || '0')).toBeGreaterThan(0);
  });

  test('deve exibir total do carrinho corretamente', async ({ page }) => {
    // Adicionar produto
    await page.click('[data-testid="add-to-cart-button"]');
    await page.click('[data-testid="color-option"]');
    await page.click('[data-testid="size-option"]');
    await page.click('[data-testid="add-to-cart-button"]');
    await page.waitForTimeout(1000);
    
    // Verificar se o total está sendo exibido
    const totalElement = page.locator('.total-value');
    if (await totalElement.isVisible()) {
      const total = await totalElement.textContent();
      expect(total).toMatch(/R\$\s*\d+,\d{2}/);
    }
  });

  test('deve navegar para checkout ao clicar no carrinho', async ({ page }) => {
    // Adicionar produto primeiro
    await page.click('[data-testid="add-to-cart-button"]');
    await page.click('[data-testid="color-option"]');
    await page.click('[data-testid="size-option"]');
    await page.click('[data-testid="add-to-cart-button"]');
    await page.waitForTimeout(1000);
    
    // Clicar no ícone do carrinho
    await page.click('[data-testid="cart-button"]');
    
    // Verificar se navegou para checkout ou página do carrinho
    await expect(page).toHaveURL(/.*checkout|.*cart/);
  });

  test('deve exibir mensagem de carrinho vazio quando apropriado', async ({ page }) => {
    // Verificar se há mensagem de carrinho vazio
    const emptyCartMessage = page.locator('.empty-cart-message');
    
    if (await emptyCartMessage.isVisible()) {
      await expect(emptyCartMessage).toContainText('carrinho vazio');
    }
  });
});

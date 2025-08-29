import { test, expect } from '@playwright/test';
import { loginUser, registerUser, logoutUser, isUserLoggedIn } from './utils/auth-helpers';
import { testUsers } from './utils/test-data';

test.describe('Autenticação', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('deve exibir botão de login quando usuário não está logado', async ({ page }) => {
    await expect(page.locator('[data-testid="login-button"]')).toBeVisible();
    await expect(page.locator('[data-testid="user-menu"]')).not.toBeVisible();
  });

  test('deve abrir modal de login ao clicar no botão', async ({ page }) => {
    await page.click('[data-testid="login-button"]');
    
    await expect(page.locator('[data-testid="auth-form"]')).toBeVisible();
    await expect(page.locator('[data-testid="email-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="password-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="submit-button"]')).toBeVisible();
  });

  test('deve alternar entre login e registro', async ({ page }) => {
    await page.click('[data-testid="login-button"]');
    
    // Inicialmente em modo de login
    await expect(page.locator('h2')).toHaveText('Entrar');
    
    // Alternar para registro
    await page.click('[data-testid="toggle-mode-button"]');
    await expect(page.locator('h2')).toHaveText('Registrar');
    await expect(page.locator('[data-testid="confirm-password-input"]')).toBeVisible();
    
    // Alternar de volta para login
    await page.click('[data-testid="toggle-mode-button"]');
    await expect(page.locator('h2')).toHaveText('Entrar');
    await expect(page.locator('[data-testid="confirm-password-input"]')).not.toBeVisible();
  });

  test('deve exibir botão "Esqueci minha senha" apenas no modo login', async ({ page }) => {
    await page.click('[data-testid="login-button"]');
    
    // Em modo de login
    await expect(page.locator('[data-testid="forgot-password-button"]')).toBeVisible();
    
    // Alternar para registro
    await page.click('[data-testid="toggle-mode-button"]');
    await expect(page.locator('[data-testid="forgot-password-button"]')).not.toBeVisible();
  });

  test('deve validar campos obrigatórios no login', async ({ page }) => {
    await page.click('[data-testid="login-button"]');
    
    // Tentar submeter sem preencher
    await page.click('[data-testid="submit-button"]');
    
    // Verificar se os campos estão marcados como inválidos
    const emailInput = page.locator('[data-testid="email-input"]');
    const passwordInput = page.locator('[data-testid="password-input"]');
    
    await expect(emailInput).toHaveAttribute('required');
    await expect(passwordInput).toHaveAttribute('required');
  });

  test('deve validar campos obrigatórios no registro', async ({ page }) => {
    await page.click('[data-testid="login-button"]');
    await page.click('[data-testid="toggle-mode-button"]');
    
    // Tentar submeter sem preencher
    await page.click('[data-testid="submit-button"]');
    
    // Verificar se os campos estão marcados como inválidos
    const emailInput = page.locator('[data-testid="email-input"]');
    const passwordInput = page.locator('[data-testid="password-input"]');
    const confirmPasswordInput = page.locator('[data-testid="confirm-password-input"]');
    
    await expect(emailInput).toHaveAttribute('required');
    await expect(passwordInput).toHaveAttribute('required');
    await expect(confirmPasswordInput).toHaveAttribute('required');
  });

  test('deve fechar modal ao clicar no X', async ({ page }) => {
    await page.click('[data-testid="login-button"]');
    await expect(page.locator('[data-testid="auth-form"]')).toBeVisible();
    
    await page.click('[data-testid="close-button"]');
    await expect(page.locator('[data-testid="auth-form"]')).not.toBeVisible();
  });

  test('deve fechar modal ao clicar fora dele', async ({ page }) => {
    await page.click('[data-testid="login-button"]');
    await expect(page.locator('[data-testid="auth-form"]')).toBeVisible();
    
    // Clicar no overlay (fora do modal)
    await page.click('.modal-overlay');
    await expect(page.locator('[data-testid="auth-form"]')).not.toBeVisible();
  });

  test('deve aceitar email válido no campo de email', async ({ page }) => {
    await page.click('[data-testid="login-button"]');
    
    const emailInput = page.locator('[data-testid="email-input"]');
    await emailInput.fill('test@example.com');
    
    await expect(emailInput).toHaveValue('test@example.com');
  });

  test('deve aceitar senha no campo de senha', async ({ page }) => {
    await page.click('[data-testid="login-button"]');
    
    const passwordInput = page.locator('[data-testid="password-input"]');
    await passwordInput.fill('password123');
    
    await expect(passwordInput).toHaveValue('password123');
  });
});

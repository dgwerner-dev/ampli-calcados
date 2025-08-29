import { Page } from '@playwright/test';
import { testUsers } from './test-data';

export async function loginUser(page: Page, userType: 'admin' | 'user' = 'user') {
  const user = testUsers[userType];
  
  await page.goto('/');
  
  // Clicar no botão de login
  await page.click('[data-testid="login-button"]');
  
  // Aguardar modal de login aparecer
  await page.waitForSelector('[data-testid="auth-form"]');
  
  // Preencher formulário
  await page.fill('[data-testid="email-input"]', user.email);
  await page.fill('[data-testid="password-input"]', user.password);
  
  // Submeter formulário
  await page.click('[data-testid="submit-button"]');
  
  // Aguardar login ser processado
  await page.waitForTimeout(2000);
}

export async function registerUser(page: Page, user = testUsers.newUser) {
  await page.goto('/');
  
  // Clicar no botão de login
  await page.click('[data-testid="login-button"]');
  
  // Aguardar modal aparecer
  await page.waitForSelector('[data-testid="auth-form"]');
  
  // Alternar para modo de registro
  await page.click('[data-testid="toggle-mode-button"]');
  
  // Preencher formulário de registro
  await page.fill('[data-testid="email-input"]', user.email);
  await page.fill('[data-testid="password-input"]', user.password);
  await page.fill('[data-testid="confirm-password-input"]', user.password);
  
  // Submeter formulário
  await page.click('[data-testid="submit-button"]');
  
  // Aguardar registro ser processado
  await page.waitForTimeout(2000);
}

export async function logoutUser(page: Page) {
  // Verificar se está logado
  const isLoggedIn = await page.locator('[data-testid="user-menu"]').isVisible();
  
  if (isLoggedIn) {
    await page.click('[data-testid="user-menu"]');
    await page.click('[data-testid="logout-button"]');
    await page.waitForTimeout(1000);
  }
}

export async function isUserLoggedIn(page: Page): Promise<boolean> {
  try {
    return await page.locator('[data-testid="user-menu"]').isVisible();
  } catch {
    return false;
  }
}

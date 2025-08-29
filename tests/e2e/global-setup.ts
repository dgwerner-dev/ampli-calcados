import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;
  
  // Setup global state if needed
  console.log('🚀 Iniciando setup global dos testes E2E...');
  
  // You can add global setup logic here, such as:
  // - Creating test users
  // - Setting up test data
  // - Authentication setup
  
  console.log(`✅ Setup global concluído para: ${baseURL}`);
}

export default globalSetup;

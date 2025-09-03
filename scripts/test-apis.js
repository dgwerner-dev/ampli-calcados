#!/usr/bin/env node

/**
 * Script para testar todas as APIs do projeto
 * Execute com: node scripts/test-apis.js
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const APIs = [
  '/api/test-db',
  '/api/debug/tables',
  '/api/debug/table-structure',
  '/api/products/featured',
  '/api/categories',
  '/api/shipping-promotions/minimum-free-shipping',
];

async function testAPI(endpoint) {
  try {
    console.log(`\n🔍 Testando: ${endpoint}`);

    const response = await fetch(`${BASE_URL}${endpoint}`);
    const data = await response.json();

    if (response.ok) {
      console.log(`✅ ${endpoint} - Status: ${response.status}`);
      console.log(`   Resposta:`, JSON.stringify(data, null, 2));
    } else {
      console.log(`❌ ${endpoint} - Status: ${response.status}`);
      console.log(`   Erro:`, data);
    }
  } catch (error) {
    console.log(`❌ ${endpoint} - Erro de conexão:`, error.message);
  }
}

async function runTests() {
  console.log('🚀 Iniciando testes das APIs...');
  console.log(`📍 Base URL: ${BASE_URL}`);

  for (const api of APIs) {
    await testAPI(api);
    // Aguardar um pouco entre as requisições
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n✨ Testes concluídos!');
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export { runTests };

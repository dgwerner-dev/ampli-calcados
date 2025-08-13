import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

console.log('🔍 DIAGNÓSTICO DO SUPABASE\n');

// Verificar variáveis de ambiente
console.log('📋 VARIÁVEIS DE AMBIENTE:');
console.log(`SUPABASE_URL: ${process.env.SUPABASE_URL ? '✅ Definida' : '❌ Não definida'}`);
console.log(`SUPABASE_SERVICE_KEY: ${process.env.SUPABASE_SERVICE_KEY ? '✅ Definida' : '❌ Não definida'}`);
console.log(`SUPABASE_ANON_KEY: ${process.env.SUPABASE_ANON_KEY ? '✅ Definida' : '❌ Não definida'}`);

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  console.error('\n❌ Variáveis obrigatórias não encontradas!');
  process.exit(1);
}

// Criar cliente com service key
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function diagnoseSupabase() {
  console.log('\n🔧 TESTANDO CONEXÃO...\n');

  try {
    // 1. Testar conexão básica
    console.log('1️⃣ Testando conexão básica...');
    const { data: health, error: healthError } = await supabase.from('categories').select('count').limit(1);
    
    if (healthError) {
      console.log(`❌ Erro na conexão: ${healthError.message}`);
      console.log(`🔍 Código do erro: ${healthError.code}`);
      console.log(`📝 Detalhes: ${healthError.details}`);
      console.log(`💡 Dica: ${healthError.hint}`);
    } else {
      console.log('✅ Conexão básica funcionando');
    }

    // 2. Testar acesso às tabelas principais
    console.log('\n2️⃣ Testando acesso às tabelas...');
    
    const tables = ['users', 'categories', 'products', 'orders'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ ${table}: ${error.message} (${error.code})`);
        } else {
          console.log(`✅ ${table}: OK (${data?.length || 0} registros)`);
        }
      } catch (err) {
        console.log(`❌ ${table}: Erro inesperado - ${err.message}`);
      }
    }

    // 3. Verificar configurações do projeto
    console.log('\n3️⃣ Verificando configurações...');
    
    try {
      const { data: config, error: configError } = await supabase
        .from('information_schema.tables')
        .select('table_name, is_secure')
        .eq('table_schema', 'public')
        .eq('table_type', 'BASE TABLE');
      
      if (configError) {
        console.log(`❌ Não foi possível verificar configurações: ${configError.message}`);
      } else {
        console.log('📊 Status das tabelas:');
        config.forEach(table => {
          console.log(`   ${table.table_name}: RLS ${table.is_secure ? 'ATIVO' : 'INATIVO'}`);
        });
      }
    } catch (err) {
      console.log(`❌ Erro ao verificar configurações: ${err.message}`);
    }

    // 4. Testar com chave anônima
    if (process.env.SUPABASE_ANON_KEY) {
      console.log('\n4️⃣ Testando com chave anônima...');
      
      const anonClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
      
      try {
        const { data: anonTest, error: anonError } = await anonClient
          .from('categories')
          .select('*')
          .limit(1);
        
        if (anonError) {
          console.log(`❌ Chave anônima: ${anonError.message} (${anonError.code})`);
        } else {
          console.log(`✅ Chave anônima: OK (${anonTest?.length || 0} registros)`);
        }
      } catch (err) {
        console.log(`❌ Chave anônima: Erro inesperado - ${err.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Erro durante o diagnóstico:', error);
  }

  console.log('\n🎯 DIAGNÓSTICO CONCLUÍDO');
  console.log('\n💡 PRÓXIMOS PASSOS:');
  console.log('1. Se houver erro de conexão: verifique as variáveis de ambiente');
  console.log('2. Se houver erro 403: execute o script de emergência no Supabase');
  console.log('3. Se houver erro de tabela: execute o seed novamente');
}

// Executar diagnóstico
diagnoseSupabase();

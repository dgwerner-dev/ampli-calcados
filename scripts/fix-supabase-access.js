import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente SUPABASE_URL e SUPABASE_SERVICE_KEY são obrigatórias');
  process.exit(1);
}

// Criar cliente com service key (bypass RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixSupabaseAccess() {
  console.log('🔧 Iniciando correção do acesso ao Supabase...\n');

  try {
    // 1. Desabilitar RLS em todas as tabelas
    console.log('📋 Desabilitando RLS em todas as tabelas...');
    
    const tables = [
      'users', 'categories', 'products', 'orders', 
      'order_items', 'wishlist_items', 'reviews'
    ];

    for (const table of tables) {
      try {
        const { error } = await supabase.rpc('exec_sql', {
          sql: `ALTER TABLE public.${table} DISABLE ROW LEVEL SECURITY;`
        });
        
        if (error) {
          console.log(`⚠️  Não foi possível desabilitar RLS em ${table}: ${error.message}`);
        } else {
          console.log(`✅ RLS desabilitado em ${table}`);
        }
      } catch (err) {
        console.log(`⚠️  Erro ao desabilitar RLS em ${table}: ${err.message}`);
      }
    }

    // 2. Verificar status das tabelas
    console.log('\n🔍 Verificando status das tabelas...');
    
    const { data: tablesStatus, error: statusError } = await supabase
      .from('information_schema.tables')
      .select('table_name, is_secure')
      .eq('table_schema', 'public')
      .eq('table_type', 'BASE TABLE');

    if (statusError) {
      console.log('⚠️  Não foi possível verificar status das tabelas');
    } else {
      tablesStatus.forEach(table => {
        console.log(`📊 ${table.table_name}: RLS ${table.is_secure ? 'ATIVO' : 'INATIVO'}`);
      });
    }

    // 3. Testar acesso às tabelas principais
    console.log('\n🧪 Testando acesso às tabelas...');
    
    try {
      const { data: categories, error: catError } = await supabase
        .from('categories')
        .select('*')
        .limit(1);
      
      if (catError) {
        console.log(`❌ Erro ao acessar categories: ${catError.message}`);
      } else {
        console.log(`✅ Acesso a categories: OK (${categories?.length || 0} registros)`);
      }
    } catch (err) {
      console.log(`❌ Erro ao testar categories: ${err.message}`);
    }

    try {
      const { data: users, error: userError } = await supabase
        .from('users')
        .select('*')
        .limit(1);
      
      if (userError) {
        console.log(`❌ Erro ao acessar users: ${userError.message}`);
      } else {
        console.log(`✅ Acesso a users: OK (${users?.length || 0} registros)`);
      }
    } catch (err) {
      console.log(`❌ Erro ao testar users: ${err.message}`);
    }

    console.log('\n🎯 Correção concluída!');
    console.log('📝 Agora recarregue a aplicação para testar.');

  } catch (error) {
    console.error('❌ Erro durante a correção:', error);
  }
}

// Executar correção
fixSupabaseAccess();

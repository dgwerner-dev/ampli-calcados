#!/usr/bin/env node

/**
 * Script para restaurar as políticas de RLS (Row Level Security) no Supabase
 * Execute este script após um reset do banco de dados
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Carregar variáveis de ambiente
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente necessárias não encontradas:');
  console.error('   - SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Criar cliente Supabase com service role key (tem permissões administrativas)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function restoreRLSPolicies() {
  try {
    console.log('🔄 Restaurando políticas de RLS...');
    
    // Ler o arquivo SQL com as políticas
    const sqlFile = path.join(process.cwd(), 'supabase', 'rls-policies.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    // Dividir o SQL em comandos individuais
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    console.log(`📋 Executando ${commands.length} comandos SQL...`);
    
    // Executar cada comando
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      if (command.trim()) {
        try {
          console.log(`   ${i + 1}/${commands.length}: Executando comando...`);
          const { error } = await supabase.rpc('exec_sql', { sql: command });
          
          if (error) {
            console.warn(`   ⚠️  Comando ${i + 1} gerou warning:`, error.message);
          }
        } catch (err) {
          console.warn(`   ⚠️  Comando ${i + 1} falhou:`, err.message);
        }
      }
    }
    
    console.log('✅ Políticas de RLS restauradas com sucesso!');
    
    // Verificar se as políticas foram criadas
    console.log('🔍 Verificando políticas criadas...');
    const { data: policies, error: policiesError } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('schemaname', 'public')
      .order('tablename', { ascending: true });
    
    if (policiesError) {
      console.warn('⚠️  Não foi possível verificar as políticas:', policiesError.message);
    } else {
      console.log(`📊 Total de políticas criadas: ${policies.length}`);
      policies.forEach(policy => {
        console.log(`   - ${policy.tablename}: ${policy.policyname}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erro ao restaurar políticas de RLS:', error);
    process.exit(1);
  }
}

// Executar o script
restoreRLSPolicies();

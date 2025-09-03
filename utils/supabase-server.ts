import { createClient } from '@supabase/supabase-js';

export function createSupabaseServerClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Variáveis de ambiente Supabase não configuradas:');
    console.error('SUPABASE_URL:', !!process.env.SUPABASE_URL);
    console.error('SUPABASE_SERVICE_ROLE_KEY:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    throw new Error('Missing Supabase environment variables');
  }

  console.log('Criando cliente Supabase com chave de serviço');
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// Cliente alternativo com chave anônima (para casos onde a de serviço não funciona)
export function createSupabaseAnonClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase anon key');
  }

  console.log('Criando cliente Supabase com chave anônima');
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

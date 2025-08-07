import { createClient } from '@supabase/supabase-js'

// Configuração do Supabase usando variáveis de ambiente
const supabaseUrl = process.env.SUPABASE_URL || 'https://uatvzepupurboemimloe.supabase.co'
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key-here'

export const supabase = createClient(supabaseUrl, supabaseKey) 
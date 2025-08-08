import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase usando variáveis de ambiente
const supabaseUrl = 'https://uatvzepupurboemimloe.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhdHZ6ZXB1cHVyYm9lbWltbG9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MDIwOTEsImV4cCI6MjA3MDA3ODA5MX0.rBHq1ODSTrqTQVYiiRn2mi8TOGsRr4QOsMF-BAs9a0I';

export const supabase = createClient(supabaseUrl, supabaseKey);

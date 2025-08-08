import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase com Service Role Key (contorna RLS)
const supabaseUrl = 'https://uatvzepupurboemimloe.supabase.co';
const supabaseServiceKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhdHZ6ZXB1cHVyYm9lbWltbG9lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDUwMjA5MSwiZXhwIjoyMDcwMDc4MDkxfQ.cU25quoaK5XHbrLBUJ31wPL1zWZcAXHbeksivxxVGIA';

// Cliente Supabase com service role key (contorna RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser() {
  try {
    console.log('🔧 Criando usuário admin no Supabase Auth (com Service Role Key)...');

    // Verificar se o usuário já existe
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      console.error('❌ Erro ao listar usuários:', listError);
      console.log('');
      console.log('💡 Dica: Verifique se a Service Role Key está correta');
      console.log('   - Vá para Settings > API no Supabase Dashboard');
      console.log('   - Copie a "service_role" key (não a anon key)');
      return;
    }

    const adminExists = existingUsers.users.find(user => user.email === 'admin@amplicalcados.com');

    if (adminExists) {
      console.log('✅ Usuário admin já existe no Supabase Auth');
      console.log('📧 Email:', adminExists.email);
      console.log('🆔 ID:', adminExists.id);
      console.log('📅 Criado em:', adminExists.created_at);
      return;
    }

    // Criar usuário admin
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: 'admin@amplicalcados.com',
      password: 'admin123',
      email_confirm: true,
      user_metadata: {
        name: 'Administrador AMPLI',
      },
    });

    if (createError) {
      console.error('❌ Erro ao criar usuário admin:', createError);
      return;
    }

    console.log('✅ Usuário admin criado com sucesso!');
    console.log('📧 Email:', newUser.user.email);
    console.log('🆔 ID:', newUser.user.id);
    console.log('🔑 Senha temporária: admin123');
    console.log('');
    console.log('⚠️  IMPORTANTE:');
    console.log('   - Altere a senha no primeiro login');
    console.log('   - O usuário já está confirmado e pode fazer login imediatamente');
    console.log('');
    console.log('🎉 Agora você pode fazer login no site!');
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
    console.log('');
    console.log('💡 Possíveis soluções:');
    console.log('   1. Verifique se a Service Role Key está correta');
    console.log('   2. Verifique se o projeto está ativo');
    console.log('   3. Tente criar o usuário manualmente no Dashboard');
  }
}

// Executar o script
createAdminUser();

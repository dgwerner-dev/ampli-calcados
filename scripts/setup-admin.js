import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://uatvzepupurboemimloe.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtbmJpb2RteXRkc3ZveHNweGVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTEwODY1MSwiZXhwIjoyMDcwNjg0NjUxfQ.Zixp-aDn3IXx4Z-sKgnJJ_BIIVfx0AiIWkCfIYSpFKA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCurrentStatus() {
  try {
    console.log('🔍 Verificando status atual...');

    // Tentar acessar a tabela users para ver se há políticas ativas
    const { data, error } = await supabase.from('users').select('id').limit(1);

    if (error) {
      console.log('❌ Erro ao acessar tabela users:', error.message);
      console.log('   Isso indica que há políticas RLS bloqueando o acesso');
      return false;
    } else {
      console.log('✅ Tabela users acessível');
      return true;
    }
  } catch (error) {
    console.error('❌ Erro ao verificar status:', error);
    return false;
  }
}

async function createOrUpdateAdminUser() {
  try {
    console.log('🔧 Criando/Atualizando usuário admin...');

    const authUID = '01278291-2f3d-4371-bc5e-af46e61b170a';
    const adminEmail = 'admin@amplicalcados.com';

    console.log('📋 Configuração:');
    console.log(`   - UID da autenticação: ${authUID}`);
    console.log(`   - Email: ${adminEmail}`);
    console.log('');

    // Verificar se o usuário com o UID correto já existe
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUID)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Erro ao verificar usuário:', checkError);
      return false;
    }

    if (existingUser) {
      console.log('✅ Usuário admin já existe com ID correto:', existingUser);
      return true;
    }

    // Verificar se existe usuário com ID incorreto
    const { data: wrongIdUser, error: wrongIdError } = await supabase
      .from('users')
      .select('*')
      .eq('id', 'admin-user-id')
      .single();

    if (wrongIdUser) {
      console.log('📝 Usuário encontrado com ID incorreto, atualizando...');

      // Atualizar o ID do usuário existente
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({
          id: authUID,
          email: adminEmail,
          name: 'Administrador AMPLI',
          role: 'ADMIN',
          isActive: true,
        })
        .eq('id', 'admin-user-id')
        .select()
        .single();

      if (updateError) {
        console.error('❌ Erro ao atualizar usuário:', updateError);
        return false;
      } else {
        console.log('✅ Usuário atualizado com sucesso:', updatedUser);
        return true;
      }
    } else {
      console.log('📝 Criando novo usuário admin...');

      // Criar novo usuário admin
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          id: authUID,
          email: adminEmail,
          name: 'Administrador AMPLI',
          role: 'ADMIN',
          isActive: true,
        })
        .select()
        .single();

      if (createError) {
        console.error('❌ Erro ao criar usuário:', createError);
        return false;
      } else {
        console.log('✅ Usuário admin criado com sucesso:', newUser);
        return true;
      }
    }
  } catch (error) {
    console.error('❌ Erro geral:', error);
    return false;
  }
}

async function listUsers() {
  try {
    console.log('📋 Listando usuários na tabela users...');

    const { data: users, error } = await supabase.from('users').select('*');

    if (error) {
      console.error('❌ Erro ao listar usuários:', error);
    } else {
      console.log('👥 Usuários encontrados:', users.length);
      users.forEach(user => {
        console.log(`   - ID: ${user.id}`);
        console.log(`     Email: ${user.email}`);
        console.log(`     Nome: ${user.name}`);
        console.log(`     Role: ${user.role}`);
        console.log('');
      });
    }
  } catch (error) {
    console.error('❌ Erro ao listar usuários:', error);
  }
}

function showManualInstructions() {
  console.log('');
  console.log('📋 INSTRUÇÕES MANUAIS PARA CORRIGIR POLÍTICAS RLS');
  console.log('==================================================');
  console.log('');
  console.log('1. Acesse o Supabase Dashboard:');
  console.log('   https://supabase.com/dashboard');
  console.log('');
  console.log('2. Selecione seu projeto: uatvzepupurboemimloe');
  console.log('');
  console.log('3. Vá para SQL Editor (menu lateral)');
  console.log('');
  console.log('4. Execute este SQL para remover as políticas problemáticas:');
  console.log('');
  console.log('```sql');
  console.log('-- Remover todas as políticas existentes da tabela users');
  console.log('DROP POLICY IF EXISTS "Users can view own profile" ON "public"."users";');
  console.log('DROP POLICY IF EXISTS "Users can update own profile" ON "public"."users";');
  console.log('DROP POLICY IF EXISTS "Allow user registration" ON "public"."users";');
  console.log('DROP POLICY IF EXISTS "Admin can view all users" ON "public"."users";');
  console.log('DROP POLICY IF EXISTS "Admin can create users" ON "public"."users";');
  console.log('```');
  console.log('');
  console.log('5. Execute este SQL para criar as novas políticas:');
  console.log('');
  console.log('```sql');
  console.log('-- Política simplificada para visualização de usuários');
  console.log('CREATE POLICY "Users can view own profile" ON "public"."users"');
  console.log('FOR SELECT USING (auth.uid()::text = id);');
  console.log('');
  console.log('-- Política para atualização de perfil');
  console.log('CREATE POLICY "Users can update own profile" ON "public"."users"');
  console.log('FOR UPDATE USING (auth.uid()::text = id);');
  console.log('');
  console.log('-- Política para registro de usuários');
  console.log('CREATE POLICY "Allow user registration" ON "public"."users"');
  console.log('FOR INSERT WITH CHECK (auth.uid()::text = id);');
  console.log('');
  console.log('-- Política para admin (baseada apenas no ID, sem consultas recursivas)');
  console.log('CREATE POLICY "Admin can view all users" ON "public"."users"');
  console.log('FOR SELECT USING (');
  console.log("  auth.uid()::text = '01278291-2f3d-4371-bc5e-af46e61b170a' OR");
  console.log('  auth.uid()::text = id');
  console.log(');');
  console.log('');
  console.log('-- Política para admin criar usuários');
  console.log('CREATE POLICY "Admin can create users" ON "public"."users"');
  console.log('FOR INSERT WITH CHECK (');
  console.log("  auth.uid()::text = '01278291-2f3d-4371-bc5e-af46e61b170a' OR");
  console.log('  auth.uid()::text = id');
  console.log(');');
  console.log('```');
  console.log('');
  console.log('6. Após aplicar as políticas, execute novamente:');
  console.log('   node scripts/setup-admin.js');
}

async function main() {
  console.log('🔧 Setup completo do usuário admin...');

  // Verificar status atual
  const isAccessible = await checkCurrentStatus();

  if (!isAccessible) {
    console.log('');
    console.log('⚠️  Políticas RLS estão bloqueando o acesso');
    console.log('   Aplique as correções manuais primeiro');
    showManualInstructions();
    return;
  }

  // Criar/atualizar usuário admin
  const success = await createOrUpdateAdminUser();

  if (success) {
    console.log('');
    await listUsers();

    console.log('');
    console.log('🎉 Setup concluído com sucesso!');
    console.log('');
    console.log('🎯 PRÓXIMOS PASSOS:');
    console.log('1. Tente fazer login novamente');
    console.log('2. O erro PGRST116 deve estar resolvido');
    console.log('3. O usuário admin deve conseguir acessar o sistema');
  } else {
    console.log('');
    console.log('❌ Falha ao criar/atualizar usuário');
    console.log('   Verifique as políticas RLS primeiro');
    showManualInstructions();
  }
}

// Executar o script
main();

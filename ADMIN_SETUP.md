# 🔐 Configuração do Administrador

## 📋 Pré-requisitos

O admin já foi criado no banco de dados com as seguintes credenciais:

- **Email**: `admin@amplicalcados.com`
- **Nome**: `Administrador AMPLI`
- **Role**: `ADMIN`

## ⚙️ Configuração Manual no Supabase

### 1. Acesse o Supabase Dashboard
- Vá para [supabase.com](https://supabase.com)
- Faça login na sua conta
- Acesse o projeto `bartezen-site`

### 2. Crie o Usuário de Autenticação
1. No painel do Supabase, vá para **Authentication** > **Users**
2. Clique em **"Add User"**
3. Preencha os dados:
   - **Email**: `admin@amplicalcados.com`
   - **Password**: Defina uma senha segura (mínimo 6 caracteres)
   - **Email Confirm**: ✅ Marque como confirmado
4. Clique em **"Create User"**

### 3. Verifique a Configuração
- O usuário deve aparecer na lista de usuários
- O status deve ser "Confirmed"
- O ID do usuário deve corresponder ao ID no banco de dados

## 🔑 Primeiro Login

1. Acesse o site
2. Clique em "Entrar" no header
3. Use as credenciais:
   - **Email**: `admin@amplicalcados.com`
   - **Senha**: A senha que você definiu no Supabase

## 👥 Criando Novos Usuários

Após fazer login como admin:

1. Clique no ícone do usuário no header
2. Clique em "Criar Usuário"
3. Preencha os dados do novo usuário
4. O usuário será criado com role `USER`

## 🔒 Segurança

- ✅ Apenas o admin pode criar novos usuários
- ✅ Usuários normais não podem se registrar pelo site
- ✅ Apenas um admin existe no sistema
- ✅ Reset de senha disponível para todos os usuários

## 🚨 Importante

- **NUNCA** compartilhe as credenciais do admin
- **SEMPRE** use senhas fortes
- **MANTENHA** o email do admin atualizado
- **MONITORE** os logs de autenticação no Supabase

## 📞 Suporte

Se houver problemas com a autenticação:
1. Verifique os logs no Supabase Dashboard
2. Confirme se o email está verificado
3. Teste o reset de senha se necessário 
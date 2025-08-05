# 🔐 Configuração do Supabase para AMPLI CALÇADOS

## 📋 Passos para Configurar o Supabase

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Preencha as informações:
   - **Name**: `ampli-calçados`
   - **Database Password**: (escolha uma senha forte)
   - **Region**: (escolha a mais próxima)

### 2. Obter Credenciais

Após criar o projeto:

1. Vá para **Settings** > **API**
2. Copie as seguintes informações:
   - **Project URL** (ex: `https://your-project.supabase.co`)
   - **anon public** key

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Configurar Autenticação

No painel do Supabase:

1. Vá para **Authentication** > **Settings**
2. Configure as URLs permitidas:
   - **Site URL**: `http://localhost:3000`
   - **Redirect URLs**: `http://localhost:3000/auth/callback`

### 5. Configurar Email (Opcional)

Para envio de emails de confirmação:

1. Vá para **Authentication** > **Settings**
2. Configure seu provedor de email (Gmail, SendGrid, etc.)

## 🚀 Funcionalidades Implementadas

### ✅ **Autenticação Completa**
- Login com email/senha
- Registro de novos usuários
- Recuperação de senha
- Logout

### ✅ **Interface Moderna**
- Modal responsivo
- Validação de formulários
- Mensagens de erro/sucesso
- Loading states

### ✅ **Integração com Header**
- Botão de login/logout dinâmico
- Menu do usuário logado
- Exibição do email do usuário

## 🔧 Estrutura dos Arquivos

```
├── composables/
│   └── useAuth.ts          # Lógica de autenticação
├── components/
│   └── AuthModal.vue       # Modal de login/registro
├── utils/
│   └── supabase.ts         # Configuração do cliente
└── .env                    # Variáveis de ambiente
```

## 🎯 Próximos Passos

1. **Configurar banco de dados** para perfis de usuário
2. **Implementar carrinho** persistente por usuário
3. **Adicionar histórico** de pedidos
4. **Configurar permissões** de acesso
5. **Implementar notificações** push

## 🛠️ Comandos Úteis

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📞 Suporte

Para dúvidas sobre a configuração do Supabase, consulte:
- [Documentação oficial](https://supabase.com/docs)
- [Guia de autenticação](https://supabase.com/docs/guides/auth) 
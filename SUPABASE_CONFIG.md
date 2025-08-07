# 🔧 Configuração do .env

## Crie um arquivo `.env` na raiz do projeto com:

```bash
# Supabase Configuration
SUPABASE_URL=https://uatvzepupurboemimloe.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Database URL (Prisma) - Connection Pooling
DATABASE_URL="postgresql://postgres.uatvzepupurboemimloe:rGfrlLABwFZQyREy@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection to the database. Used for migrations
DIRECT_URL="postgresql://postgres.uatvzepupurboemimloe:rGfrlLABwFZQyREy@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

## 📋 Passos para obter as credenciais:

1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto ou use um existente
3. Vá em **Settings** > **API**
4. Copie:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY`
5. Vá em **Settings** > **Database**
6. Copie a **Connection string** → `DATABASE_URL`

## 🔐 Configurar Autenticação:

1. No painel do Supabase, vá em **Authentication** > **Settings**
2. Configure:
   - **Site URL**: `http://localhost:3000`
   - **Redirect URLs**: `http://localhost:3000/auth/callback`

## 🗄️ Configurar Banco de Dados (Prisma):

1. Após configurar o `.env`, execute:
```bash
npx prisma generate
npx prisma db push
```

2. Para visualizar o banco:
```bash
npx prisma studio
```

## ✅ Após configurar tudo:

```bash
npm run dev
```

O login e o banco de dados estarão funcionando! 
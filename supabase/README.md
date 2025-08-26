# Supabase - Restauração de Políticas de Segurança

## 🚨 Problema Após Reset do Banco

Quando você executa `npx prisma db push --force-reset`, todas as políticas de segurança (RLS - Row Level Security) são removidas, causando erros de permissão como:

```
permission denied for schema public
```

## 🔧 Solução

### Opção 1: Executar SQL Manualmente (Recomendado)

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard)
2. Vá para o seu projeto
3. Clique em **SQL Editor**
4. Copie e cole o conteúdo do arquivo `supabase/rls-policies.sql`
5. Execute o SQL

### Opção 2: Usar o Script Automático

1. **Certifique-se de que você tem a `SUPABASE_SERVICE_ROLE_KEY` no seu `.env`**
2. Execute o script:

```bash
node scripts/restore-rls-policies.js
```

## 🔑 Variáveis de Ambiente Necessárias

Adicione estas variáveis ao seu arquivo `.env`:

```env
# URL do seu projeto Supabase
SUPABASE_URL=https://seu-projeto.supabase.co

# Service Role Key (chave administrativa)
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
```

### 📍 Onde encontrar a Service Role Key:

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard)
2. Vá para o seu projeto
3. Clique em **Settings** → **API**
4. Copie a **Service Role Key** (não a anon key!)

## ⚠️ Importante

- A `SUPABASE_SERVICE_ROLE_KEY` tem permissões administrativas
- **NUNCA** exponha essa chave no frontend
- Use apenas para scripts administrativos como este
- Mantenha essa chave segura e não a compartilhe

## 📋 Políticas Restauradas

O script restaura as seguintes políticas:

- **users**: Usuários podem ver/editar apenas seu próprio perfil
- **categories**: Acesso público para leitura, apenas admins para gerenciar
- **products**: Acesso público para leitura, apenas admins para gerenciar
- **orders**: Usuários podem gerenciar apenas seus próprios pedidos
- **order_items**: Usuários podem gerenciar itens de seus próprios pedidos
- **wishlist_items**: Usuários podem gerenciar apenas sua própria lista
- **reviews**: Públicos para leitura, usuários podem gerenciar seus próprios
- **payments**: Usuários podem ver/criar apenas seus próprios pagamentos

## 🧪 Verificação

Após executar as políticas, você pode verificar se foram criadas corretamente executando:

```sql
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

## 🚀 Execução Rápida

Se você já tem as variáveis no `.env`, execute:

```bash
# Restaurar políticas automaticamente
node scripts/restore-rls-policies.js

# Ou executar manualmente no SQL Editor do Supabase
# (copie o conteúdo de supabase/rls-policies.sql)
```

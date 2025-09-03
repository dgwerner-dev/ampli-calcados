# Configuração do Deploy na Vercel

## Variáveis de Ambiente Necessárias

Para que o projeto funcione corretamente na Vercel, você precisa configurar as seguintes variáveis de ambiente:

### 1. Acesse o Dashboard da Vercel

- Vá para [vercel.com/dashboard](https://vercel.com/dashboard)
- Selecione seu projeto

### 2. Configure as Variáveis de Ambiente

Na seção "Settings" > "Environment Variables", adicione:

```
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anonima
SUPABASE_SERVICE_ROLE_KEY=sua-chave-de-servico
```

### 3. Chaves do Supabase

Para obter essas chaves:

1. Acesse [supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá para "Settings" > "API"
4. Copie as chaves necessárias

### 4. Redeploy

Após configurar as variáveis:

1. Vá para "Deployments"
2. Clique em "Redeploy" no último deploy
3. Ou faça um novo commit para trigger automático

## Problemas Comuns

### Erro 500 nas APIs

- Verifique se as variáveis de ambiente estão configuradas
- Confirme se o banco Supabase está ativo
- Verifique os logs da Vercel para mais detalhes

### Problemas de Conexão

- O projeto agora usa o cliente Supabase direto em vez do Prisma
- Todas as APIs foram migradas para Supabase
- Verifique se as políticas RLS estão configuradas corretamente

## Estrutura das Tabelas

Certifique-se de que as seguintes tabelas existem no Supabase:

- `categories`
- `products`
- `shipping_promotions`
- `users`
- `orders`
- `wishlist_items`

## Políticas RLS

Execute o arquivo `supabase/rls-policies-complete.sql` no SQL Editor do Supabase para configurar as políticas de segurança.

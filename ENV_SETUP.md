# Configuração das Variáveis de Ambiente

## Para Desenvolvimento Local

Crie um arquivo `.env` na raiz do projeto com:

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Gemini API (opcional)
GEMINI_API_KEY=your-gemini-api-key

# PagBank Configuration (opcional)
PAGBANK_ACCESS_TOKEN=your-pagbank-access-token
PAGBANK_ENVIRONMENT=sandbox
PAGBANK_WEBHOOK_SECRET=your-webhook-secret

# Correios API (opcional)
CORREIOS_ACCESS_CODE=your-correios-access-code
```

## Para Produção (Vercel)

Configure as mesmas variáveis no dashboard da Vercel:

1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecione seu projeto
3. Vá para "Settings" > "Environment Variables"
4. Adicione cada variável

## Como Obter as Chaves do Supabase

1. Acesse [supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá para "Settings" > "API"
4. Copie:
   - Project URL → `SUPABASE_URL`
   - anon public → `SUPABASE_ANON_KEY`
   - service_role secret → `SUPABASE_SERVICE_ROLE_KEY`

## Teste Local

Após configurar as variáveis:

1. Reinicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Teste as APIs:
   - `/api/test-db` - Teste de conexão
   - `/api/debug/tables` - Lista de tabelas
   - `/api/products/featured` - Produtos em destaque
   - `/api/categories` - Categorias
   - `/api/shipping-promotions/minimum-free-shipping` - Promoções de frete

## Estrutura das Tabelas

Certifique-se de que as seguintes tabelas existem no Supabase:
- `categories`
- `products`
- `shipping_promotions`
- `users`
- `orders`
- `wishlist_items`

Execute o arquivo `supabase/rls-policies-complete.sql` no SQL Editor do Supabase.

# 🔧 RESOLVENDO PROBLEMAS DE ACESSO AO SUPABASE

## 🚨 **PROBLEMA ATUAL:**

- Categorias não carregam no header
- Login não funciona corretamente
- Erro 403 (Forbidden) ao acessar tabelas
- Mensagem: "permission denied for schema public"

## ✅ **SOLUÇÃO RÁPIDA:**

### **Opção 1: Desabilitar RLS (Recomendado para teste)**

1. Acesse o [Painel do Supabase](https://supabase.com/dashboard)
2. Selecione seu projeto
3. No menu lateral, clique em **"SQL Editor"**
4. Clique em **"New query"**
5. Cole o seguinte código:

```sql
-- Desabilitar RLS temporariamente
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;
```

6. Clique em **"RUN"**

### **Opção 2: Políticas mais permissivas (Para manter segurança)**

Se preferir manter o RLS ativo, execute este código no SQL Editor:

```sql
-- Habilitar RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Políticas permissivas para usuários autenticados
CREATE POLICY "Authenticated users can view all users" ON public.users
FOR SELECT USING (auth.role() = 'authenticated');

-- Políticas públicas para categorias e produtos
CREATE POLICY "Categories are viewable by everyone" ON public.categories
FOR SELECT USING (true);

CREATE POLICY "Products are viewable by everyone" ON public.products
FOR SELECT USING (true);
```

## 🔍 **VERIFICAÇÃO:**

Após executar uma das opções:

1. **Recarregue a página** da aplicação
2. **Verifique se as categorias** aparecem no header
3. **Teste o login** de um usuário
4. **Verifique o console** do navegador para erros

## 📝 **NOTAS:**

- **Opção 1** é mais simples e resolve o problema imediatamente
- **Opção 2** mantém a segurança mas requer configuração mais cuidadosa
- Após resolver, você pode ajustar as políticas gradualmente

## 🆘 **SE AINDA NÃO FUNCIONAR:**

1. Verifique se o usuário tem permissões de admin no Supabase
2. Confirme se as variáveis de ambiente estão corretas
3. Verifique se as tabelas existem no banco de dados
4. Execute o seed novamente se necessário: `npx prisma db seed`

-- =================================================================
-- POLÍTICAS SIMPLIFICADAS PARA RESOLVER PROBLEMAS DE ACESSO
-- =================================================================

-- 1. Desabilitar RLS temporariamente para permitir acesso básico
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;

-- 2. Ou, se preferir manter RLS, criar políticas mais permissivas:
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Políticas para users - permitir acesso autenticado
-- DROP POLICY IF EXISTS "Authenticated users can view all users" ON public.users;
-- CREATE POLICY "Authenticated users can view all users" ON public.users
-- FOR SELECT USING (auth.role() = 'authenticated');

-- Políticas para categories - permitir acesso público
-- DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
-- CREATE POLICY "Categories are viewable by everyone" ON public.categories
-- FOR SELECT USING (true);

-- Políticas para products - permitir acesso público
-- DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
-- CREATE POLICY "Products are viewable by everyone" ON public.products
-- FOR SELECT USING (true);

-- =================================================================
-- INSTRUÇÕES DE USO:
-- =================================================================
-- 1. Vá para o painel do Supabase
-- 2. Clique em "SQL Editor" no menu lateral
-- 3. Clique em "New query"
-- 4. Cole este conteúdo
-- 5. Clique em "RUN"
-- 
-- RECOMENDAÇÃO: Execute primeiro a opção 1 (desabilitar RLS)
-- para testar se a aplicação funciona. Depois pode reabilitar
-- com políticas mais permissivas se desejar.
-- =================================================================

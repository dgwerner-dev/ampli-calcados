-- =================================================================
-- SOLUÇÃO DE EMERGÊNCIA - EXECUTAR NO SUPABASE SQL EDITOR
-- =================================================================

-- PASSO 1: Desabilitar RLS em todas as tabelas
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;

-- PASSO 2: Remover todas as políticas existentes
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
DROP POLICY IF EXISTS "Admins can create products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update any order" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can manage their own wishlist" ON public.wishlist_items;
DROP POLICY IF EXISTS "Reviews are public" ON public.reviews;
DROP POLICY IF EXISTS "Users can manage their own reviews" ON public.reviews;

-- PASSO 3: Remover função is_admin se existir
DROP FUNCTION IF EXISTS is_admin();

-- PASSO 4: Verificar se as tabelas existem e têm dados
SELECT 'users' as table_name, COUNT(*) as record_count FROM public.users
UNION ALL
SELECT 'categories' as table_name, COUNT(*) as record_count FROM public.categories
UNION ALL
SELECT 'products' as table_name, COUNT(*) as record_count FROM public.products
UNION ALL
SELECT 'orders' as table_name, COUNT(*) as record_count FROM public.orders
UNION ALL
SELECT 'order_items' as table_name, COUNT(*) as record_count FROM public.order_items
UNION ALL
SELECT 'wishlist_items' as table_name, COUNT(*) as record_count FROM public.wishlist_items
UNION ALL
SELECT 'reviews' as table_name, COUNT(*) as record_count FROM public.reviews;

-- PASSO 5: Verificar status do RLS
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

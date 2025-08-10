-- =================================================================
-- Script de Políticas de Segurança (RLS) para AMPLI CALÇADOS
--
-- INSTRUÇÕES:
-- Este script é idempotente, o que significa que pode ser executado
-- várias vezes sem causar erros. Ele primeiro remove as políticas
-- existentes e depois as recria.
--
-- Como usar:
-- 1. Vá para o seu painel do Supabase.
-- 2. No menu lateral, clique em "SQL Editor".
-- 3. Clique em "New query".
-- 4. Copie e cole todo o conteúdo deste arquivo no editor.
-- 5. Clique em "RUN" para executar os comandos.
-- =================================================================

-- Habilitar RLS (caso ainda não esteja)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 1. Políticas para a tabela 'users'
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users
FOR SELECT USING (auth.uid()::text = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
FOR UPDATE USING (auth.uid()::text = id) WITH CHECK (auth.uid()::text = id);

-- 2. Políticas para a tabela 'categories'
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
CREATE POLICY "Categories are viewable by everyone" ON public.categories
FOR SELECT USING (true);

-- 3. Políticas para a tabela 'products'
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
CREATE POLICY "Products are viewable by everyone" ON public.products
FOR SELECT USING (true);

-- Funcao auxiliar para checar se o usuario eh admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (SELECT role FROM public.users WHERE id = auth.uid()::text) = 'ADMIN';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP POLICY IF EXISTS "Admins can create products" ON public.products;
CREATE POLICY "Admins can create products" ON public.products
FOR INSERT WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can update products" ON public.products;
CREATE POLICY "Admins can update products" ON public.products
FOR UPDATE USING (is_admin());

DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
CREATE POLICY "Admins can delete products" ON public.products
FOR DELETE USING (is_admin());


-- 4. Políticas para a tabela 'orders'
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
CREATE POLICY "Users can view their own orders" ON public.orders
FOR SELECT USING (auth.uid()::text = "userId" OR is_admin());

DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
CREATE POLICY "Users can create their own orders" ON public.orders
FOR INSERT WITH CHECK (auth.uid()::text = "userId");

DROP POLICY IF EXISTS "Admins can update any order" ON public.orders;
CREATE POLICY "Admins can update any order" ON public.orders
FOR UPDATE USING (is_admin());


-- 5. Políticas para a tabela 'order_items'
DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
CREATE POLICY "Users can view their own order items" ON public.order_items
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_items."orderId" AND (orders."userId" = auth.uid()::text OR is_admin())
  )
);

-- 6. Políticas para a tabela 'wishlist_items'
DROP POLICY IF EXISTS "Users can manage their own wishlist" ON public.wishlist_items;
CREATE POLICY "Users can manage their own wishlist" ON public.wishlist_items
FOR ALL USING (auth.uid()::text = "userId");


-- 7. Políticas para a tabela 'reviews'
DROP POLICY IF EXISTS "Reviews are public" ON public.reviews;
CREATE POLICY "Reviews are public" ON public.reviews
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage their own reviews" ON public.reviews;
CREATE POLICY "Users can manage their own reviews" ON public.reviews
FOR ALL USING (auth.uid()::text = "userId"); 
-- ========================================
-- RLS COMPLETO PARA E-COMMERCE
-- ========================================
-- 
-- INSTRUÇÕES:
-- 1. Acesse: https://supabase.com/dashboard
-- 2. Vá para seu projeto
-- 3. Clique em "SQL Editor"
-- 4. Cole este SQL e execute
-- 5. Este script é seguro e pode ser executado múltiplas vezes
-- 
-- ========================================
-- 1. HABILITAR RLS EM TODAS AS TABELAS
-- ========================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 2. TABELAS PÚBLICAS (Leitura pública, escrita admin)
-- ========================================

-- CATEGORIES
DROP POLICY IF EXISTS "Categorias são públicas para leitura" ON categories;
DROP POLICY IF EXISTS "Apenas admins podem gerenciar categorias" ON categories;

CREATE POLICY "Categorias são públicas para leitura" ON categories
FOR SELECT USING (true);

CREATE POLICY "Apenas admins podem gerenciar categorias" ON categories
FOR ALL USING (auth.role() = 'authenticated' AND EXISTS (
  SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'ADMIN'
));

-- PRODUCTS
DROP POLICY IF EXISTS "Produtos são públicos para leitura" ON products;
DROP POLICY IF EXISTS "Apenas admins podem gerenciar produtos" ON products;

CREATE POLICY "Produtos são públicos para leitura" ON products
FOR SELECT USING (true);

CREATE POLICY "Apenas admins podem gerenciar produtos" ON products
FOR ALL USING (auth.role() = 'authenticated' AND EXISTS (
  SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'ADMIN'
));

-- ========================================
-- 3. TABELAS DE USUÁRIO (Isoladas por usuário)
-- ========================================

-- USERS
DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON users;
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON users;

CREATE POLICY "Usuários podem ver seu próprio perfil" ON users
FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil" ON users
FOR UPDATE USING (auth.uid()::text = id);

-- ORDERS
DROP POLICY IF EXISTS "Usuários podem ver seus próprios pedidos" ON orders;
DROP POLICY IF EXISTS "Usuários podem criar seus próprios pedidos" ON orders;

CREATE POLICY "Usuários podem ver seus próprios pedidos" ON orders
FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Usuários podem criar seus próprios pedidos" ON orders
FOR INSERT WITH CHECK (auth.uid()::text = "userId");

-- ORDER_ITEMS
DROP POLICY IF EXISTS "Usuários podem ver itens de seus próprios pedidos" ON order_items;
DROP POLICY IF EXISTS "Usuários podem criar itens em seus próprios pedidos" ON order_items;

CREATE POLICY "Usuários podem ver itens de seus próprios pedidos" ON order_items
FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE id = "orderId" AND "userId" = auth.uid()::text)
);

CREATE POLICY "Usuários podem criar itens em seus próprios pedidos" ON order_items
FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE id = "orderId" AND "userId" = auth.uid()::text)
);

-- WISHLIST_ITEMS
DROP POLICY IF EXISTS "Usuários podem ver seus próprios itens da lista de desejos" ON wishlist_items;
DROP POLICY IF EXISTS "Usuários podem gerenciar seus próprios itens da lista de desejos" ON wishlist_items;

CREATE POLICY "Usuários podem ver seus próprios itens da lista de desejos" ON wishlist_items
FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Usuários podem gerenciar seus próprios itens da lista de desejos" ON wishlist_items
FOR ALL USING (auth.uid()::text = "userId");

-- REVIEWS
DROP POLICY IF EXISTS "Reviews são públicos para leitura" ON reviews;
DROP POLICY IF EXISTS "Usuários podem criar reviews para produtos" ON reviews;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios reviews" ON reviews;
DROP POLICY IF EXISTS "Usuários podem deletar seus próprios reviews" ON reviews;

CREATE POLICY "Reviews são públicos para leitura" ON reviews
FOR SELECT USING (true);

CREATE POLICY "Usuários podem criar reviews para produtos" ON reviews
FOR INSERT WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Usuários podem atualizar seus próprios reviews" ON reviews
FOR UPDATE USING (auth.uid()::text = "userId");

CREATE POLICY "Usuários podem deletar seus próprios reviews" ON reviews
FOR DELETE USING (auth.uid()::text = "userId");

-- PAYMENTS
DROP POLICY IF EXISTS "Usuários podem ver seus próprios pagamentos" ON payments;
DROP POLICY IF EXISTS "Usuários podem criar seus próprios pagamentos" ON payments;

CREATE POLICY "Usuários podem ver seus próprios pagamentos" ON payments
FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Usuários podem criar seus próprios pagamentos" ON payments
FOR INSERT WITH CHECK (auth.uid()::text = "userId");

-- ADDRESSES
DROP POLICY IF EXISTS "Usuários podem ver seus próprios endereços" ON addresses;
DROP POLICY IF EXISTS "Usuários podem gerenciar seus próprios endereços" ON addresses;

CREATE POLICY "Usuários podem ver seus próprios endereços" ON addresses
FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Usuários podem gerenciar seus próprios endereços" ON addresses
FOR ALL USING (auth.uid()::text = "userId");

-- ========================================
-- 4. TABELAS ADMIN (Apenas admins)
-- ========================================

-- COUPONS
DROP POLICY IF EXISTS "Apenas admins podem gerenciar cupons" ON coupons;

CREATE POLICY "Apenas admins podem gerenciar cupons" ON coupons
FOR ALL USING (auth.role() = 'authenticated' AND EXISTS (
  SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'ADMIN'
));

-- SHIPPING_PROMOTIONS
DROP POLICY IF EXISTS "Apenas admins podem gerenciar promoções de frete" ON shipping_promotions;

CREATE POLICY "Apenas admins podem gerenciar promoções de frete" ON shipping_promotions
FOR ALL USING (auth.role() = 'authenticated' AND EXISTS (
  SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'ADMIN'
));

-- SHIPPING_REGIONS
DROP POLICY IF EXISTS "Apenas admins podem gerenciar regiões de frete" ON shipping_regions;

CREATE POLICY "Apenas admins podem gerenciar regiões de frete" ON shipping_regions
FOR ALL USING (auth.role() = 'authenticated' AND EXISTS (
  SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'ADMIN'
));

-- SHIPPING_PRODUCTS
DROP POLICY IF EXISTS "Apenas admins podem gerenciar produtos de frete" ON shipping_products;

CREATE POLICY "Apenas admins podem gerenciar produtos de frete" ON shipping_products
FOR ALL USING (auth.role() = 'authenticated' AND EXISTS (
  SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'ADMIN'
));

-- SHIPPING_CATEGORIES
DROP POLICY IF EXISTS "Apenas admins podem gerenciar categorias de frete" ON shipping_categories;

CREATE POLICY "Apenas admins podem gerenciar categorias de frete" ON shipping_categories
FOR ALL USING (auth.role() = 'authenticated' AND EXISTS (
  SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'ADMIN'
));

-- ========================================
-- 5. VERIFICAÇÃO
-- ========================================

-- Verificar se as políticas foram criadas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Verificar se RLS está habilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
  'users', 'categories', 'products', 'orders', 'order_items', 
  'wishlist_items', 'reviews', 'payments', 'coupons', 
  'shipping_promotions', 'shipping_regions', 'shipping_products', 'shipping_categories'
)
ORDER BY tablename;

-- ========================================
-- NOTAS IMPORTANTES:
-- ========================================
-- 
-- 1. Este SQL é SEGURO e pode ser executado múltiplas vezes
-- 2. Ele remove políticas existentes antes de criar novas
-- 3. Execute NO Supabase Dashboard, NÃO via Prisma
-- 4. As políticas RLS precisam do contexto de autenticação do Supabase
-- 5. Após executar, teste a aplicação novamente
-- 6. CORRIGIDO: auth.uid()::text para compatibilidade com campos text
-- 7. SEGURANÇA: Todas as tabelas sensíveis protegidas
-- 
-- ========================================

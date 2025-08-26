-- Políticas de RLS (Row Level Security) para as tabelas principais
-- Execute este SQL no SQL Editor do Supabase após o reset do banco

-- ========================================
-- 1. CONFIGURAÇÃO DE STORAGE
-- ========================================

-- Criar bucket para imagens de produtos se não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Habilitar RLS na tabela storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Políticas para storage.objects
CREATE POLICY "Permitir upload de imagens para usuários autenticados" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'product-images' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Permitir visualização pública de imagens" ON storage.objects
FOR SELECT USING (
  bucket_id = 'product-images'
);

CREATE POLICY "Permitir atualização de imagens para usuários autenticados" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'product-images' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Permitir exclusão de imagens para usuários autenticados" ON storage.objects
FOR DELETE USING (
  bucket_id = 'product-images' AND 
  auth.role() = 'authenticated'
);

-- ========================================
-- 2. CONFIGURAÇÃO DAS TABELAS PRINCIPAIS
-- ========================================

-- Habilitar RLS em todas as tabelas principais
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 3. POLÍTICAS PARA TABELA USERS
-- ========================================

CREATE POLICY "Usuários podem ver seu próprio perfil" ON users
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil" ON users
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seu próprio perfil" ON users
FOR INSERT WITH CHECK (auth.uid() = id);

-- ========================================
-- 4. POLÍTICAS PARA TABELA CATEGORIES
-- ========================================

CREATE POLICY "Categorias são públicas para leitura" ON categories
FOR SELECT USING (true);

CREATE POLICY "Apenas admins podem gerenciar categorias" ON categories
FOR ALL USING (auth.role() = 'authenticated' AND EXISTS (
  SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN'
));

-- ========================================
-- 5. POLÍTICAS PARA TABELA PRODUCTS
-- ========================================

CREATE POLICY "Produtos são públicos para leitura" ON products
FOR SELECT USING (true);

CREATE POLICY "Apenas admins podem gerenciar produtos" ON products
FOR ALL USING (auth.role() = 'authenticated' AND EXISTS (
  SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN'
));

-- ========================================
-- 6. POLÍTICAS PARA TABELA ORDERS
-- ========================================

CREATE POLICY "Usuários podem ver seus próprios pedidos" ON orders
FOR SELECT USING (auth.uid() = userId);

CREATE POLICY "Usuários podem criar seus próprios pedidos" ON orders
FOR INSERT WITH CHECK (auth.uid() = userId);

CREATE POLICY "Usuários podem atualizar seus próprios pedidos" ON orders
FOR UPDATE USING (auth.uid() = userId);

-- ========================================
-- 7. POLÍTICAS PARA TABELA ORDER_ITEMS
-- ========================================

CREATE POLICY "Usuários podem ver itens de seus próprios pedidos" ON order_items
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders WHERE id = orderId AND userId = auth.uid()
  )
);

CREATE POLICY "Usuários podem criar itens em seus próprios pedidos" ON order_items
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders WHERE id = orderId AND userId = auth.uid()
  )
);

-- ========================================
-- 8. POLÍTICAS PARA TABELA WISHLIST_ITEMS
-- ========================================

CREATE POLICY "Usuários podem ver seus próprios itens da lista de desejos" ON wishlist_items
FOR SELECT USING (auth.uid() = userId);

CREATE POLICY "Usuários podem gerenciar seus próprios itens da lista de desejos" ON wishlist_items
FOR ALL USING (auth.uid() = userId);

-- ========================================
-- 9. POLÍTICAS PARA TABELA REVIEWS
-- ========================================

CREATE POLICY "Reviews são públicos para leitura" ON reviews
FOR SELECT USING (true);

CREATE POLICY "Usuários podem criar reviews para produtos" ON reviews
FOR INSERT WITH CHECK (auth.uid() = userId);

CREATE POLICY "Usuários podem atualizar seus próprios reviews" ON reviews
FOR UPDATE USING (auth.uid() = userId);

CREATE POLICY "Usuários podem deletar seus próprios reviews" ON reviews
FOR DELETE USING (auth.uid() = userId);

-- ========================================
-- 10. POLÍTICAS PARA TABELA PAYMENTS
-- ========================================

CREATE POLICY "Usuários podem ver seus próprios pagamentos" ON payments
FOR SELECT USING (auth.uid() = userId);

CREATE POLICY "Usuários podem criar seus próprios pagamentos" ON payments
FOR INSERT WITH CHECK (auth.uid() = userId);

-- ========================================
-- 11. VERIFICAÇÃO DAS POLÍTICAS CRIADAS
-- ========================================

-- Verificar políticas das tabelas principais
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

-- Verificar políticas de storage
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
WHERE tablename = 'objects' AND schemaname = 'storage';

-- Verificar buckets criados
SELECT * FROM storage.buckets;

-- Políticas de RLS (Row Level Security) para as tabelas principais
-- Execute este SQL no SQL Editor do Supabase após o reset do banco

-- 1. Habilitar RLS em todas as tabelas principais
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- 2. Políticas para tabela users
CREATE POLICY "Usuários podem ver seu próprio perfil" ON users
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil" ON users
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seu próprio perfil" ON users
FOR INSERT WITH CHECK (auth.uid() = id);

-- 3. Políticas para tabela categories (acesso público)
CREATE POLICY "Categorias são públicas para leitura" ON categories
FOR SELECT USING (true);

CREATE POLICY "Apenas admins podem gerenciar categorias" ON categories
FOR ALL USING (auth.role() = 'authenticated' AND EXISTS (
  SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN'
));

-- 4. Políticas para tabela products (acesso público para leitura)
CREATE POLICY "Produtos são públicos para leitura" ON products
FOR SELECT USING (true);

CREATE POLICY "Apenas admins podem gerenciar produtos" ON products
FOR ALL USING (auth.role() = 'authenticated' AND EXISTS (
  SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN'
));

-- 5. Políticas para tabela orders
CREATE POLICY "Usuários podem ver seus próprios pedidos" ON orders
FOR SELECT USING (auth.uid() = userId);

CREATE POLICY "Usuários podem criar seus próprios pedidos" ON orders
FOR INSERT WITH CHECK (auth.uid() = userId);

CREATE POLICY "Usuários podem atualizar seus próprios pedidos" ON orders
FOR UPDATE USING (auth.uid() = userId);

-- 6. Políticas para tabela order_items
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

-- 7. Políticas para tabela wishlist_items
CREATE POLICY "Usuários podem ver seus próprios itens da lista de desejos" ON wishlist_items
FOR SELECT USING (auth.uid() = userId);

CREATE POLICY "Usuários podem gerenciar seus próprios itens da lista de desejos" ON wishlist_items
FOR ALL USING (auth.uid() = userId);

-- 8. Políticas para tabela reviews
CREATE POLICY "Reviews são públicos para leitura" ON reviews
FOR SELECT USING (true);

CREATE POLICY "Usuários podem criar reviews para produtos" ON reviews
FOR INSERT WITH CHECK (auth.uid() = userId);

CREATE POLICY "Usuários podem atualizar seus próprios reviews" ON reviews
FOR UPDATE USING (auth.uid() = userId);

CREATE POLICY "Usuários podem deletar seus próprios reviews" ON reviews
FOR DELETE USING (auth.uid() = userId);

-- 9. Políticas para tabela payments
CREATE POLICY "Usuários podem ver seus próprios pagamentos" ON payments
FOR SELECT USING (auth.uid() = userId);

CREATE POLICY "Usuários podem criar seus próprios pagamentos" ON payments
FOR INSERT WITH CHECK (auth.uid() = userId);

-- 10. Verificar se as políticas foram criadas
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

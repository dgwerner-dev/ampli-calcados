-- Políticas RLS para o sistema AMPLI CALÇADOS

-- 1. Política para a tabela 'users'
-- Permitir que usuários vejam apenas seus próprios dados
CREATE POLICY "Users can view own profile" ON "public"."users"
FOR SELECT USING (auth.uid()::text = id);

-- Permitir que usuários atualizem apenas seus próprios dados
CREATE POLICY "Users can update own profile" ON "public"."users"
FOR UPDATE USING (auth.uid()::text = id);

-- Permitir inserção de novos usuários (para o processo de registro)
CREATE POLICY "Allow user registration" ON "public"."users"
FOR INSERT WITH CHECK (auth.uid()::text = id);

-- 2. Política para a tabela 'categories'
-- Permitir leitura pública de categorias
CREATE POLICY "Categories are viewable by everyone" ON "public"."categories"
FOR SELECT USING (true);

-- 3. Política para a tabela 'products'
-- Permitir leitura pública de produtos
CREATE POLICY "Products are viewable by everyone" ON "public"."products"
FOR SELECT USING (true);

-- 4. Política para a tabela 'orders'
-- Usuários podem ver apenas seus próprios pedidos
CREATE POLICY "Users can view own orders" ON "public"."orders"
FOR SELECT USING (auth.uid()::text = "userId");

-- Usuários podem criar seus próprios pedidos
CREATE POLICY "Users can create own orders" ON "public"."orders"
FOR INSERT WITH CHECK (auth.uid()::text = "userId");

-- Usuários podem atualizar seus próprios pedidos
CREATE POLICY "Users can update own orders" ON "public"."orders"
FOR UPDATE USING (auth.uid()::text = "userId");

-- 5. Política para a tabela 'order_items'
-- Usuários podem ver itens de seus próprios pedidos
CREATE POLICY "Users can view own order items" ON "public"."order_items"
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM "public"."orders"
    WHERE orders.id = order_items."orderId"
    AND orders."userId" = auth.uid()::text
  )
);

-- Usuários podem criar itens em seus próprios pedidos
CREATE POLICY "Users can create own order items" ON "public"."order_items"
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM "public"."orders"
    WHERE orders.id = order_items."orderId"
    AND orders."userId" = auth.uid()::text
  )
);

-- 6. Política para a tabela 'wishlist_items'
-- Usuários podem ver apenas seus próprios itens da lista de desejos
CREATE POLICY "Users can view own wishlist items" ON "public"."wishlist_items"
FOR SELECT USING (auth.uid()::text = "userId");

-- Usuários podem adicionar itens à sua própria lista de desejos
CREATE POLICY "Users can add own wishlist items" ON "public"."wishlist_items"
FOR INSERT WITH CHECK (auth.uid()::text = "userId");

-- Usuários podem remover itens de sua própria lista de desejos
CREATE POLICY "Users can remove own wishlist items" ON "public"."wishlist_items"
FOR DELETE USING (auth.uid()::text = "userId");

-- 7. Política para a tabela 'reviews'
-- Usuários podem ver todas as avaliações
CREATE POLICY "Reviews are viewable by everyone" ON "public"."reviews"
FOR SELECT USING (true);

-- Usuários podem criar suas próprias avaliações
CREATE POLICY "Users can create own reviews" ON "public"."reviews"
FOR INSERT WITH CHECK (auth.uid()::text = "userId");

-- Usuários podem atualizar suas próprias avaliações
CREATE POLICY "Users can update own reviews" ON "public"."reviews"
FOR UPDATE USING (auth.uid()::text = "userId");

-- Usuários podem deletar suas próprias avaliações
CREATE POLICY "Users can delete own reviews" ON "public"."reviews"
FOR DELETE USING (auth.uid()::text = "userId");

-- 8. Políticas especiais para admin (simplificadas para evitar recursão)
-- Admin pode ver todos os usuários (baseado no ID do admin)
CREATE POLICY "Admin can view all users" ON "public"."users"
FOR SELECT USING (
  auth.uid()::text = '01278291-2f3d-4371-bc5e-af46e61b170a' OR
  auth.uid()::text = id
);

-- Admin pode criar novos usuários (baseado no ID do admin)
CREATE POLICY "Admin can create users" ON "public"."users"
FOR INSERT WITH CHECK (
  auth.uid()::text = '01278291-2f3d-4371-bc5e-af46e61b170a' OR
  auth.uid()::text = id
);

-- Admin pode ver todos os pedidos (baseado no ID do admin)
CREATE POLICY "Admin can view all orders" ON "public"."orders"
FOR SELECT USING (
  auth.uid()::text = '01278291-2f3d-4371-bc5e-af46e61b170a' OR
  auth.uid()::text = "userId"
);

-- Admin pode atualizar todos os pedidos (baseado no ID do admin)
CREATE POLICY "Admin can update all orders" ON "public"."orders"
FOR UPDATE USING (
  auth.uid()::text = '01278291-2f3d-4371-bc5e-af46e61b170a' OR
  auth.uid()::text = "userId"
); 
-- Políticas de Storage para upload de imagens de produtos
-- Execute este SQL no SQL Editor do Supabase

-- 1. Habilitar RLS na tabela storage.objects (se não estiver habilitado)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 2. Política para permitir upload de imagens para usuários autenticados
CREATE POLICY "Permitir upload de imagens para usuários autenticados" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'product-images' AND 
  auth.role() = 'authenticated'
);

-- 3. Política para permitir visualização pública de imagens
CREATE POLICY "Permitir visualização pública de imagens" ON storage.objects
FOR SELECT USING (
  bucket_id = 'product-images'
);

-- 4. Política para permitir atualização de imagens para usuários autenticados
CREATE POLICY "Permitir atualização de imagens para usuários autenticados" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'product-images' AND 
  auth.role() = 'authenticated'
);

-- 5. Política para permitir exclusão de imagens para usuários autenticados
CREATE POLICY "Permitir exclusão de imagens para usuários autenticados" ON storage.objects
FOR DELETE USING (
  bucket_id = 'product-images' AND 
  auth.role() = 'authenticated'
);

-- 6. Verificar se as políticas foram criadas
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

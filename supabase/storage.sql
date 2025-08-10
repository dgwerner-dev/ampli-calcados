-- 1. Cria o bucket para imagens de produtos
-- Este bucket será público para que as imagens possam ser exibidas no site.
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 2. Define as políticas de acesso para o bucket 'product-images'

-- Permite que qualquer pessoa (anônima) veja as imagens.
-- Isso é necessário para que as imagens dos produtos sejam exibidas no seu site.
CREATE POLICY "Public read access for product images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );

-- Permite que usuários autenticados façam upload de imagens.
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'product-images' );

-- Permite que usuários autenticados atualizem suas próprias imagens.
-- A verificação (uid() = owner) garante que um usuário só pode alterar os arquivos que ele mesmo enviou.
CREATE POLICY "Authenticated users can update their own images"
ON storage.objects FOR UPDATE
TO authenticated
USING ( auth.uid() = owner );

-- Permite que usuários autenticados deletem suas próprias imagens.
CREATE POLICY "Authenticated users can delete their own images"
ON storage.objects FOR DELETE
TO authenticated
USING ( auth.uid() = owner );

-- COMO USAR:
-- 1. Vá para o seu painel do Supabase.
-- 2. No menu lateral, clique em "SQL Editor".
-- 3. Clique em "New query".
-- 4. Copie e cole todo o conteúdo deste arquivo no editor.
-- 5. Clique em "RUN" para executar os comandos.

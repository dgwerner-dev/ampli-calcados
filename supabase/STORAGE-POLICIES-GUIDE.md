# 🔧 Guia para Configurar Políticas de Storage no Supabase

## 🚨 Problema Atual
O bucket `product-images` tem apenas políticas para usuários anônimos (`anon uploads`), mas precisamos de políticas para usuários autenticados.

## 📋 Passos para Resolver

### 1. Acessar o Painel do Supabase
1. Vá para [supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Selecione o projeto `bartezen`

### 2. Navegar para Storage Policies
1. No menu lateral, clique em **"Storage"**
2. Clique na aba **"Policies"**

### 3. Remover Políticas Existentes
1. Na seção **"Buckets"**, encontre o bucket **"PRODUCT-IMAGES"**
2. Você verá duas políticas existentes:
   - `INSERT Allow anon uploads 16wiy3a_0`
   - `UPDATE Allow anon uploads 16wiy3a_1`
3. **Clique nos três pontos (⋮)** ao lado de cada política
4. Selecione **"Delete"** para remover ambas

### 4. Adicionar Novas Políticas
Clique no botão **"New policy"** ao lado do bucket **"PRODUCT-IMAGES"**

#### Política 1: INSERT (Upload)
- **Name**: `Permitir upload de imagens para usuários autenticados`
- **Allowed operation**: `INSERT`
- **Target roles**: `authenticated`
- **Using expression**: `bucket_id = 'product-images' AND auth.role() = 'authenticated'`
- Clique **"Review"** e depois **"Save policy"**

#### Política 2: SELECT (Visualização)
- **Name**: `Permitir visualização pública de imagens`
- **Allowed operation**: `SELECT`
- **Target roles**: `public`
- **Using expression**: `bucket_id = 'product-images'`
- Clique **"Review"** e depois **"Save policy"**

#### Política 3: UPDATE (Atualização)
- **Name**: `Permitir atualização de imagens para usuários autenticados`
- **Allowed operation**: `UPDATE`
- **Target roles**: `authenticated`
- **Using expression**: `bucket_id = 'product-images' AND auth.role() = 'authenticated'`
- Clique **"Review"** e depois **"Save policy"**

#### Política 4: DELETE (Exclusão)
- **Name**: `Permitir exclusão de imagens para usuários autenticados`
- **Allowed operation**: `DELETE`
- **Target roles**: `authenticated`
- **Using expression**: `bucket_id = 'product-images' AND auth.role() = 'authenticated'`
- Clique **"Review"** e depois **"Save policy"**

## ✅ Resultado Esperado
Após aplicar as políticas, você deve ver:

```
PRODUCT-IMAGES (Public)
├── INSERT Permitir upload de imagens para usuários autenticados
├── SELECT Permitir visualização pública de imagens
├── UPDATE Permitir atualização de imagens para usuários autenticados
└── DELETE Permitir exclusão de imagens para usuários autenticados
```

## 🧪 Teste
Após aplicar as políticas:
1. Volte para o painel administrativo
2. Tente editar um produto
3. Adicione uma nova imagem
4. O upload deve funcionar sem erros

## 🔍 Verificação
Se ainda houver problemas:
1. Verifique se todas as 4 políticas foram criadas
2. Confirme que as expressões estão corretas
3. Teste o upload novamente

## 📞 Suporte
Se precisar de ajuda adicional, verifique:
- Logs do console do navegador
- Logs do Supabase (Database > Logs)
- Status das políticas (Storage > Policies)

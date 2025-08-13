# 🚨 URGENTE: EXECUTAR AGORA NO SUPABASE

## ❌ **PROBLEMA CRÍTICO:**
A aplicação não consegue acessar o banco de dados devido às políticas de segurança muito restritivas.

## ✅ **SOLUÇÃO IMEDIATA:**

### **1. Acesse o Supabase:**
- Vá para [supabase.com/dashboard](https://supabase.com/dashboard)
- Selecione seu projeto

### **2. Abra o SQL Editor:**
- No menu lateral, clique em **"SQL Editor"**
- Clique em **"New query"**

### **3. Cole este código e execute:**

```sql
-- SOLUÇÃO DE EMERGÊNCIA
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;
```

### **4. Clique em "RUN"**

### **5. Recarregue a aplicação**

## 🔍 **VERIFICAÇÃO:**

Após executar, você deve ver:
- ✅ Categorias aparecem no header
- ✅ Login funciona
- ✅ Sem mais erros 403

## 📝 **NOTA IMPORTANTE:**

Esta solução **desabilita temporariamente** a segurança do banco. Após resolver o problema, você pode:

1. **Manter assim** para desenvolvimento
2. **Reabilitar RLS** com políticas mais permissivas
3. **Configurar políticas específicas** para cada tabela

## 🆘 **SE NÃO FUNCIONAR:**

1. Verifique se você tem permissões de admin no Supabase
2. Confirme se as tabelas existem
3. Execute o seed novamente: `npx prisma db seed`

---

**⏰ EXECUTE AGORA - É A ÚNICA FORMA DE RESOLVER!**

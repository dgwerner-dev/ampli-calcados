# AMPLI CALÇADOS - E-commerce

> **Status**: APIs corrigidas e funcionando - Deploy em andamento 🚀

E-commerce desenvolvido com Nuxt 3, Supabase e Tailwind CSS.

## 🚀 Deploy Status

- ✅ **Local**: Funcionando perfeitamente
- 🚧 **Vercel**: Deploy em andamento (commit 60f92f6)
- 🔧 **Correções**: APIs migradas do Prisma para Supabase

## 📋 Principais Funcionalidades

- Autenticação de usuários
- Catálogo de produtos
- Carrinho de compras
- Sistema de pedidos
- Gestão de usuários
- Painel administrativo

## 🛠️ Tecnologias

- **Frontend**: Nuxt 3, Vue 3, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Deploy**: Vercel
- **Testes**: Vitest, Playwright

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📚 Documentação

- [Configuração de Ambiente](ENV_SETUP.md)
- [Deploy na Vercel](VERCEL_DEPLOY.md)
- [Testes das APIs](scripts/test-apis.js)

## 🔧 APIs Disponíveis

- `/api/test-db` - Teste de conexão
- `/api/products/featured` - Produtos em destaque
- `/api/categories` - Categorias
- `/api/shipping-promotions/minimum-free-shipping` - Promoções de frete

## 📝 Changelog

### v1.1.0 - Correção das APIs
- ✅ Migração do Prisma para Supabase
- ✅ Correção dos nomes das colunas
- ✅ Melhoria no tratamento de erros
- ✅ Cliente Supabase robusto
- ✅ APIs de debug e teste

### v1.0.0 - Versão inicial
- ✅ Sistema de autenticação
- ✅ Catálogo de produtos
- ✅ Carrinho de compras
- ✅ Sistema de pedidos

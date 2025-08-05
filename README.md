# AMPLI CALÇADOS - E-commerce Nuxt.js

E-commerce da AMPLI CALÇADOS desenvolvido com **Nuxt.js** e Tailwind CSS, inspirado no estilo Nine West.

## 🚀 Migração Completa para Nuxt.js

Este projeto foi **completamente migrado** de Vue.js para Nuxt.js, oferecendo melhor SEO, performance e developer experience.

## 🔐 Sistema de Autenticação com Supabase

### ✅ **Funcionalidades de Login Implementadas**
- **Login/Registro** com email e senha
- **Recuperação de senha** por email
- **Sessões persistentes** com Supabase
- **Interface moderna** com modal responsivo
- **Validação de formulários** em tempo real
- **Mensagens de feedback** para o usuário

### 🛠️ **Configuração do Supabase**
1. Crie um projeto no [Supabase](https://supabase.com)
2. Configure as variáveis de ambiente (veja `SUPABASE_SETUP.md`)
3. Configure autenticação no painel do Supabase
4. Execute o projeto

## 📋 Estrutura do Projeto

```
site/
├── components/
│   ├── AppHeader.vue          # Header com navegação e login
│   ├── AuthModal.vue          # Modal de autenticação
│   ├── HeroCarousel.vue       # Carrossel de produtos
│   └── ProductsGrid.vue       # Grid de produtos
├── composables/
│   └── useAuth.ts             # Lógica de autenticação
├── utils/
│   └── supabase.ts            # Configuração do Supabase
├── plugins/
│   └── auth.client.ts         # Plugin de autenticação
├── middleware/
│   └── auth.ts                # Middleware de proteção
├── assets/
│   └── css/
│       └── main.css           # Estilos globais
├── app.vue                    # Página principal
├── nuxt.config.ts             # Configuração Nuxt
├── tailwind.config.js         # Configuração Tailwind
├── package.json               # Dependências
├── SUPABASE_SETUP.md          # Guia de configuração
└── README.md                  # Documentação
```

## 🎯 Benefícios da Migração

### ✅ **SEO Otimizado**
- **SSR (Server-Side Rendering)** nativo
- **Meta tags** dinâmicas
- **Sitemap** automático
- **Robots.txt** configurável

### ✅ **Performance Melhorada**
- **Code splitting** automático
- **Lazy loading** nativo
- **Image optimization** integrado
- **Bundle optimization**

### ✅ **Developer Experience**
- **Auto-imports** de componentes
- **Hot reload** mais rápido
- **DevTools** integradas
- **TypeScript** nativo

### ✅ **Autenticação Robusta**
- **Supabase Auth** integrado
- **Sessões persistentes**
- **Recuperação de senha**
- **Interface responsiva**

### ✅ **Deploy Simplificado**
- **Vercel** otimizado
- **Netlify** compatível
- **Static generation** (SSG)
- **Edge functions** suporte

## 🛠️ Instalação e Execução

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Supabase
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Configure suas credenciais do Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

### 3. Executar em Desenvolvimento
```bash
npm run dev
```

### 4. Build para Produção
```bash
npm run build
```

### 5. Preview da Build
```bash
npm run preview
```

## 🔧 Configurações

### **Nuxt.js (nuxt.config.ts)**
- **Tailwind CSS** integrado
- **Supabase** para autenticação
- **Fonts** otimizadas (Nunito)
- **Meta tags** configuradas

### **Tailwind CSS (tailwind.config.js)**
- **Cores personalizadas** (coral, neutral)
- **Fonte Nunito** configurada
- **Animações** customizadas
- **Componentes** utilitários

### **CSS (assets/css/main.css)**
- **Reset CSS** global
- **Componentes** estilizados
- **Utilitários** Tailwind
- **Animações** suaves

## 📱 Componentes

### **AppHeader.vue**
- Header fixo com navegação
- **Sistema de login integrado**
- Menu responsivo
- Campo de busca
- Ícones de carrinho e wishlist

### **AuthModal.vue**
- **Modal de autenticação responsivo**
- **Login e registro** em um componente
- **Recuperação de senha**
- **Validação de formulários**
- **Mensagens de feedback**

### **HeroCarousel.vue**
- Carrossel automático
- Navegação com setas e dots
- Layout responsivo
- Imagens otimizadas

### **ProductsGrid.vue**
- Grid responsivo (4/2/1 colunas)
- Efeitos hover
- Botões de ação
- Imagens lazy loading

## 🎨 Design System

### **Cores**
- **Coral Soft**: `#f47763` (botões primários)
- **Coral Dark**: `#d95b4e` (hover states)
- **Neutral**: Tons de cinza para layout
- **Preto**: Textos principais

### **Tipografia**
- **Fonte**: Nunito (Google Fonts)
- **Pesos**: 300, 400, 500, 600, 700, 800
- **Responsiva**: Escala automática

### **Layout**
- **Container**: max-w-7xl
- **Espaçamento**: Sistema consistente
- **Breakpoints**: Mobile-first

## 🔐 Autenticação

### **Funcionalidades**
- ✅ **Login** com email/senha
- ✅ **Registro** de novos usuários
- ✅ **Recuperação** de senha
- ✅ **Logout** seguro
- ✅ **Sessões** persistentes
- ✅ **Interface** responsiva

### **Segurança**
- ✅ **Validação** de formulários
- ✅ **Mensagens** de erro claras
- ✅ **Loading states** informativos
- ✅ **Proteção** de rotas (middleware)

## 🚀 Deploy

### **Vercel (Recomendado)**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### **Netlify**
```bash
# Build
npm run build

# Deploy
netlify deploy --prod --dir=.output/public
```

## 📈 Melhorias Implementadas

### **SEO**
- ✅ Meta tags dinâmicas
- ✅ Structured data
- ✅ Sitemap automático
- ✅ Robots.txt

### **Performance**
- ✅ Code splitting
- ✅ Image optimization
- ✅ Lazy loading
- ✅ Bundle optimization

### **UX/UI**
- ✅ Responsividade completa
- ✅ Animações suaves
- ✅ Acessibilidade
- ✅ Loading states

### **Autenticação**
- ✅ Supabase integrado
- ✅ Interface moderna
- ✅ Validação robusta
- ✅ Feedback visual

## 🔄 Próximos Passos

1. **Configurar banco de dados** para perfis de usuário
2. **Implementar carrinho** persistente por usuário
3. **Adicionar histórico** de pedidos
4. **Configurar permissões** de acesso
5. **Implementar notificações** push
6. **Adicionar PWA** capabilities

## 📄 Licença

Este projeto foi desenvolvido para a AMPLI CALÇADOS como demonstração de e-commerce moderno com Nuxt.js e Supabase.

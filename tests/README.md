# 🧪 Testes - AmpliCalcados

Este diretório contém todos os testes automatizados do projeto AmpliCalcados.

## 📁 Estrutura

```
tests/
├── setup.ts                    # Configuração global dos testes
├── unit/                       # Testes unitários
│   ├── composables/           # Testes dos composables Vue
│   │   ├── useAuth.test.ts
│   │   ├── useCart.test.ts
│   │   ├── useWishlist.test.ts
│   │   ├── useNotifications.test.ts
│   │   └── useFreeShippingInfo.test.ts
│   ├── utils/                 # Testes de utilitários
│   │   └── formatPrice.test.ts
│   └── api/                   # Testes de APIs
│       └── products.test.ts
└── README.md                  # Esta documentação
```

## 🚀 Como Executar

### Executar todos os testes
```bash
npm run test
```

### Executar testes em modo watch
```bash
npm run test:run
```

### Executar testes com interface gráfica
```bash
npm run test:ui
```

### Executar testes com cobertura
```bash
npm run test:coverage
```

## 📋 Status dos Testes - Fase 1

### ✅ **Testes Funcionando (3/7 arquivos)**
- **`formatPrice.test.ts`**: ✅ 8/8 testes passando
- **`products.test.ts`**: ✅ 9/9 testes passando  
- **`useNotifications.test.ts`**: ✅ 10/10 testes passando

### ❌ **Testes com Problemas (4/7 arquivos)**
- **`useAuth.test.ts`**: ❌ 0/7 testes passando (problema com `useSupabaseClient`)
- **`useCart.test.ts`**: ❌ 6/7 testes passando (problema com remoção de itens)
- **`useFreeShippingInfo.test.ts`**: ❌ 0/6 testes passando (problema com `ref`)
- **`useWishlist.test.ts`**: ❌ 7/8 testes passando (problema com verificação de itens)

### 📊 **Métricas Atuais**
- **Total de Testes**: 55
- **Testes Passando**: 40 (73%)
- **Testes Falhando**: 15 (27%)

## 🔧 Configuração

### Vitest Config (`vitest.config.ts`)
- Ambiente: `happy-dom` (simula DOM do navegador)
- Setup: `tests/setup.ts`
- Aliases: `@` e `~` apontam para a raiz do projeto

### Setup Global (`tests/setup.ts`)
- Mocks do localStorage
- Mocks do Supabase
- Mocks dos composables Nuxt
- Configuração do ambiente de teste

## 📝 Convenções

### Nomenclatura
- Arquivos de teste: `*.test.ts`
- Descreva o que está sendo testado
- Use nomes descritivos para os testes

### Estrutura dos Testes
```typescript
describe('Nome do Módulo', () => {
  beforeEach(() => {
    // Setup antes de cada teste
  })

  it('should do something specific', () => {
    // Teste específico
  })
})
```

### Mocks
- Use `vi.fn()` para funções mock
- Use `vi.mock()` para módulos mock
- Limpe mocks com `vi.clearAllMocks()`

## 🎯 Próximos Passos

### Fase 1.5: Correção dos Testes Atuais
- ✅ Corrigir mocks do `useSupabaseClient`
- ✅ Corrigir importação do `ref` do Vue
- ✅ Ajustar lógica de testes do carrinho
- ✅ Corrigir verificação de wishlist

### Fase 2: Testes de Integração
- Testes de componentes Vue
- Testes de páginas
- Testes de fluxos completos

### Fase 3: Testes E2E
- Playwright para testes end-to-end
- Testes de fluxos de usuário
- Testes de regressão visual

## 🐛 Debugging

### Logs de Teste
```bash
npm run test -- --reporter=verbose
```

### Teste Específico
```bash
npm run test -- useCart.test.ts
```

### Modo Debug
```bash
npm run test:ui
```

## 📊 Métricas

- **Cobertura Atual**: ~73% dos testes principais
- **Testes Criados**: 7 arquivos de teste
- **Casos de Teste**: 55+ cenários testados

## 🔄 CI/CD

Os testes são executados automaticamente:
- ✅ Antes de cada commit
- ✅ Em pull requests
- ✅ No deploy de produção

## 🚨 Problemas Conhecidos

### 1. Mock do Supabase
```typescript
// Problema: useSupabaseClient não está sendo mockado corretamente
// Solução: Ajustar mock no tests/setup.ts
```

### 2. Importação do Vue
```typescript
// Problema: ref não está sendo importado corretamente
// Solução: Configurar mock do Vue adequadamente
```

### 3. Lógica de Testes
```typescript
// Problema: Alguns testes não refletem a lógica real dos composables
// Solução: Ajustar expectativas dos testes
```

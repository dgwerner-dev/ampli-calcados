# 📝 Formatação de Código

Este projeto usa **Prettier** e **ESLint** para manter a consistência do código.

## 🎯 Configurações

- **Limite de colunas**: 100 caracteres por linha
- **Indentação**: 2 espaços
- **Aspas**: Simples
- **Ponto e vírgula**: Obrigatório
- **Vírgula final**: ES5

## 🚀 Comandos Disponíveis

```bash
# Formatar todos os arquivos
npm run format

# Verificar se todos os arquivos estão formatados
npm run format:check

# Executar ESLint
npm run lint

# Corrigir problemas do ESLint automaticamente
npm run lint:fix
```

## ⚙️ Configuração do VS Code

### Extensões Recomendadas

Instale as seguintes extensões no VS Code:

1. **Prettier - Code formatter** (`esbenp.prettier-vscode`)
2. **ESLint** (`dbaeumer.vscode-eslint`)
3. **Vue Language Features (Volar)** (`Vue.volar`)
4. **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)

### Configurações Automáticas

O projeto já inclui configurações do VS Code que:

- ✅ Formata automaticamente ao salvar
- ✅ Executa ESLint ao salvar
- ✅ Usa Prettier como formatador padrão
- ✅ Valida arquivos Vue, TypeScript e JavaScript

## 📋 Regras de Formatação

### Linhas Longas

```javascript
// ❌ Ruim - Linha muito longa
const veryLongVariableName =
  'This is a very long string that exceeds the 100 character limit and should be broken into multiple lines';

// ✅ Bom - Quebrado em múltiplas linhas
const veryLongVariableName =
  'This is a very long string that exceeds the 100 character limit ' +
  'and should be broken into multiple lines';
```

### Classes CSS Longas

```vue
<!-- ❌ Ruim - Classes muito longas -->
<div
  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-soft focus:border-transparent text-sm"
></div>
```

### Strings Longas

```javascript
// ❌ Ruim
const longUrl =
  'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=600&fit=crop&crop=center';

// ✅ Bom
const longUrl =
  'https://images.unsplash.com/photo-1543163521-1bf539c55dd2' + '?w=800&h=600&fit=crop&crop=center';
```

## 🔧 Arquivos de Configuração

- `.prettierrc` - Configuração do Prettier
- `.eslintrc.json` - Configuração do ESLint
- `.prettierignore` - Arquivos ignorados pelo Prettier
- `.vscode/settings.json` - Configurações do VS Code
- `.vscode/extensions.json` - Extensões recomendadas

## 💡 Dicas

1. **Salve frequentemente** - O VS Code formatará automaticamente
2. **Use os comandos npm** - Para formatação manual
3. **Verifique antes de commitar** - Execute `npm run format:check`
4. **Configure seu editor** - Instale as extensões recomendadas

---

**Status**: ✅ Configurado e funcionando
**Última atualização**: $(date)

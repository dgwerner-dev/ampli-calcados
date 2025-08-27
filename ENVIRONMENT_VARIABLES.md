# Variáveis de Ambiente

Este projeto utiliza as seguintes variáveis de ambiente:

## Supabase Configuration

- `SUPABASE_URL` - URL do seu projeto Supabase
- `SUPABASE_ANON_KEY` - Chave anônima do Supabase

## PagBank Configuration

- `PAGBANK_ACCESS_TOKEN` - Token de acesso do PagBank
- `PAGBANK_ENVIRONMENT` - Ambiente do PagBank (sandbox/production)
- `PAGBANK_WEBHOOK_SECRET` - Segredo do webhook do PagBank

## Gemini API Configuration

- `GEMINI_API_KEY` - Chave da API do Gemini

## Correios API Configuration

- `CORREIOS_ACCESS_CODE` - Código de acesso da API dos Correios (opcional, fallback para ViaCEP)

## Como configurar

1. Crie um arquivo `.env` na raiz do projeto
2. Adicione as variáveis necessárias:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# PagBank Configuration
PAGBANK_ACCESS_TOKEN=your_pagbank_access_token_here
PAGBANK_ENVIRONMENT=sandbox
PAGBANK_WEBHOOK_SECRET=your_pagbank_webhook_secret_here

# Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Correios API Configuration (opcional)
CORREIOS_ACCESS_CODE=MHZ6TG1R8ahpl6GSpqGGnbSF3eqJHhGMWkzWOyWn
```

## Sistema de Busca de CEP

O sistema utiliza uma abordagem de **fallback** para garantir máxima confiabilidade:

1. **Primeira tentativa**: API oficial dos Correios
2. **Fallback**: API ViaCEP (gratuita e confiável)

### Endpoint Local

- **URL**: `/api/cep/{cep}`
- **Método**: GET
- **Exemplo**: `/api/cep/92310114`

### Resposta Padronizada

```json
{
  "logradouro": "Rua Araçá",
  "bairro": "Centro",
  "localidade": "Canoas",
  "uf": "RS",
  "cep": "92310-114"
}
```

### Vantagens

- **✅ Sem CORS** - Requisições via servidor
- **✅ Alta confiabilidade** - Fallback automático
- **✅ Dados padronizados** - Formato consistente
- **✅ Gratuito** - ViaCEP como backup

## Sistema de Cálculo de Frete

O sistema calcula automaticamente o frete baseado no CEP de destino.

### Endpoint de Cálculo

- **URL**: `/api/shipping/calculate`
- **Método**: POST
- **CEP de Origem**: 93800-446 (fixo)

### Parâmetros

```json
{
  "destinationCep": "92310114",
  "weight": 1.0
}
```

### Resposta

```json
{
  "success": true,
  "shipping": {
    "originCep": "93800446",
    "destinationCep": "92310114",
    "weight": 1,
    "options": [
      {
        "id": "pac",
        "name": "PAC",
        "description": "Entrega econômica",
        "cost": 17.5,
        "estimatedDays": 3,
        "icon": "📦"
      },
      {
        "id": "sedex",
        name": "SEDEX",
        "description": "Entrega rápida",
        "cost": 32.5,
        "estimatedDays": 2,
        "icon": "🚚"
      },
      {
        "id": "express",
        "name": "Expresso",
        "description": "Entrega urgente",
        "cost": 48,
        "estimatedDays": 1,
        "icon": "⚡"
      }
    ]
  }
}
```

### Opções de Frete

#### 📦 PAC (Econômico)

- **Base**: R$ 8,00
- **Peso**: R$ 1,50 por kg
- **Prazo**: 2-8 dias úteis
- **Ideal para**: Encomendas não urgentes

#### 🚚 SEDEX (Rápido)

- **Base**: R$ 15,00
- **Peso**: R$ 2,50 por kg
- **Prazo**: 1-5 dias úteis
- **Ideal para**: Encomendas urgentes

#### ⚡ Expresso (Urgente)

- **Base**: R$ 25,00
- **Peso**: R$ 3,00 por kg
- **Prazo**: 1-3 dias úteis
- **Ideal para**: Encomendas muito urgentes

### Adicionais por Distância

- **Local (≤100km)**: +R$ 3-12
- **Regional (≤500km)**: +R$ 8-20
- **Interestadual próximo (≤1000km)**: +R$ 12-30
- **Interestadual distante (>1000km)**: +R$ 20-45

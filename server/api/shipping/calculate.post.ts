export default defineEventHandler(async event => {
  try {
    const body = await readBody(event);
    const { destinationCep, weight = 0.5 } = body;

    if (!destinationCep) {
      throw createError({
        statusCode: 400,
        statusMessage: 'CEP de destino é obrigatório',
      });
    }

    // CEP de origem fixo
    const originCep = '93800446';

    // Limpar CEPs (apenas números)
    const cleanOriginCep = originCep.replace(/\D/g, '');
    const cleanDestinationCep = destinationCep.replace(/\D/g, '');

    // Validar CEPs
    if (cleanOriginCep.length !== 8 || cleanDestinationCep.length !== 8) {
      throw createError({
        statusCode: 400,
        statusMessage: 'CEP deve ter 8 dígitos',
      });
    }

    // Calcular opções de frete
    const shippingOptions = calculateShippingOptions(cleanOriginCep, cleanDestinationCep, weight);

    return {
      success: true,
      shipping: {
        originCep: originCep,
        destinationCep: destinationCep,
        weight: weight,
        options: shippingOptions,
      },
    };
  } catch (error: any) {
    console.error('Erro ao calcular frete:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erro ao calcular frete',
    });
  }
});

// Função para calcular opções de frete
function calculateShippingOptions(originCep: string, destinationCep: string, weight: number) {
  const distance = calculateDistance(originCep, destinationCep);

  // Opção 1: PAC (mais barato, mais lento)
  const pacCost = calculatePacCost(distance, weight);
  const pacDays = calculatePacDays(distance);

  // Opção 2: SEDEX (mais caro, mais rápido)
  const sedexCost = calculateSedexCost(distance, weight);
  const sedexDays = calculateSedexDays(distance);

  // Opção 3: Expresso (mais caro, mais rápido ainda)
  const expressCost = calculateExpressCost(distance, weight);
  const expressDays = calculateExpressDays(distance);

  return [
    {
      id: 'pac',
      name: 'PAC',
      description: 'Entrega econômica',
      cost: pacCost,
      estimatedDays: pacDays,
      icon: '📦',
    },
    {
      id: 'sedex',
      name: 'SEDEX',
      description: 'Entrega rápida',
      cost: sedexCost,
      estimatedDays: sedexDays,
      icon: '🚚',
    },
    {
      id: 'express',
      name: 'Expresso',
      description: 'Entrega urgente',
      cost: expressCost,
      estimatedDays: expressDays,
      icon: '⚡',
    },
  ];
}

// Função para calcular custo do PAC
function calculatePacCost(distance: number, weight: number): number {
  let baseCost = 8.0; // Base mais barata
  baseCost += weight * 1.5; // Custo por peso menor

  if (distance <= 100) {
    baseCost += 3.0;
  } else if (distance <= 500) {
    baseCost += 8.0;
  } else if (distance <= 1000) {
    baseCost += 12.0;
  } else {
    baseCost += 20.0;
  }

  return Math.round(baseCost * 100) / 100;
}

// Função para calcular custo do SEDEX
function calculateSedexCost(distance: number, weight: number): number {
  let baseCost = 15.0; // Base mais cara
  baseCost += weight * 2.5; // Custo por peso maior

  if (distance <= 100) {
    baseCost += 8.0;
  } else if (distance <= 500) {
    baseCost += 15.0;
  } else if (distance <= 1000) {
    baseCost += 22.0;
  } else {
    baseCost += 35.0;
  }

  return Math.round(baseCost * 100) / 100;
}

// Função para calcular custo do Expresso
function calculateExpressCost(distance: number, weight: number): number {
  let baseCost = 25.0; // Base mais cara
  baseCost += weight * 3.0; // Custo por peso maior

  if (distance <= 100) {
    baseCost += 12.0;
  } else if (distance <= 500) {
    baseCost += 20.0;
  } else if (distance <= 1000) {
    baseCost += 30.0;
  } else {
    baseCost += 45.0;
  }

  return Math.round(baseCost * 100) / 100;
}

// Função para calcular dias do PAC
function calculatePacDays(distance: number): number {
  if (distance <= 100) {
    return 2;
  } else if (distance <= 500) {
    return 3;
  } else if (distance <= 1000) {
    return 5;
  } else {
    return 8;
  }
}

// Função para calcular dias do SEDEX
function calculateSedexDays(distance: number): number {
  if (distance <= 100) {
    return 1;
  } else if (distance <= 500) {
    return 2;
  } else if (distance <= 1000) {
    return 3;
  } else {
    return 5;
  }
}

// Função para calcular dias do Expresso
function calculateExpressDays(distance: number): number {
  if (distance <= 100) {
    return 1;
  } else if (distance <= 500) {
    return 1;
  } else if (distance <= 1000) {
    return 2;
  } else {
    return 3;
  }
}

// Função para calcular distância (simulação baseada nos CEPs)
function calculateDistance(originCep: string, destinationCep: string): number {
  // Simulação de distância baseada nos primeiros dígitos do CEP
  const originRegion = parseInt(originCep.substring(0, 2));
  const destinationRegion = parseInt(destinationCep.substring(0, 2));

  const regionDiff = Math.abs(originRegion - destinationRegion);

  if (regionDiff === 0) {
    return 50; // Mesma região
  } else if (regionDiff <= 5) {
    return 200; // Região próxima
  } else if (regionDiff <= 15) {
    return 500; // Região média
  } else {
    return 1000; // Região distante
  }
}

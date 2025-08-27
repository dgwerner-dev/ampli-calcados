export default defineEventHandler(async event => {
  try {
    const cep = getRouterParam(event, 'code');

    if (!cep) {
      throw createError({
        statusCode: 400,
        statusMessage: 'CEP é obrigatório',
      });
    }

    // Validar formato do CEP (apenas números)
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      throw createError({
        statusCode: 400,
        statusMessage: 'CEP deve ter 8 dígitos',
      });
    }

    // Configuração da API dos Correios
    const config = useRuntimeConfig();
    const correiosAccessCode = config.correiosAccessCode;

    if (!correiosAccessCode) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Configuração da API dos Correios não encontrada',
      });
    }

    // Tentar primeiro a API dos Correios
    let response;
    try {
      response = await $fetch(
        `https://apihom.correios.com.br/cep/v1/endereços/${cleanCep}?codigoAcesso=${correiosAccessCode}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // API dos Correios retorna dados no formato correto
      return response;
    } catch (error: any) {
      console.log('API dos Correios falhou, tentando ViaCEP...');

      // Fallback para ViaCEP
      response = await $fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);

      if (response.erro) {
        throw createError({
          statusCode: 404,
          statusMessage: 'CEP não encontrado',
        });
      }

      // Converter formato da ViaCEP para o formato esperado
      return {
        logradouro: response.logradouro,
        bairro: response.bairro,
        localidade: response.localidade,
        uf: response.uf,
        cep: response.cep,
      };
    }
  } catch (error: any) {
    console.error('Erro ao buscar CEP:', error);

    if (error.statusCode) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Erro ao buscar CEP',
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor',
    });
  }
});

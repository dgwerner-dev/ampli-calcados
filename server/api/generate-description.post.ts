import { GoogleGenerativeAI } from '@google/generative-ai';

export default defineEventHandler(async event => {
  const config = useRuntimeConfig();
  const genAI = new GoogleGenerativeAI(config.geminiApiKey);

  try {
    const { productName, rawDescription, categoryName } = await readBody(event);

    if (!productName || !rawDescription || !categoryName) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Faltam informações do produto para gerar a descrição.',
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      Crie uma descrição de venda otimizada e amigável para um e-commerce de calçados femininos.
      O tom deve ser casual, feminino e focado nos benefícios e no estilo de vida.
      Evite listas e características técnicas. Crie um texto fluido e vendedor em um único parágrafo.

      Produto: ${productName}
      Categoria: ${categoryName}
      Características principais: ${rawDescription}

      Descrição Gerada:
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text();

    if (!generatedText) {
      throw new Error('A IA não conseguiu gerar uma descrição.');
    }

    return { description: generatedText };
  } catch (error: any) {
    console.error('Erro ao gerar descrição com IA:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Erro interno do servidor ao gerar descrição.',
    });
  }
});

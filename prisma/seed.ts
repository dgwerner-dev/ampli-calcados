import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Dados extraídos do site
const siteData = {
  Birken: [
    { name: 'Birken Olívia Off White', price: 299.9 },
    { name: 'Birken Olívia Croco Caramelo', price: 299.9 },
    { name: 'Birken Joana Caramelo Com Fivela', price: 299.9 },
  ],
  Botas: [
    { name: 'Bota Cano Médio Café / Salto 6', price: 499.9 },
    { name: 'Bota Fernanda em Couro Preto', price: 499.9 },
    { name: 'Bota Coturno Cano Médio Preta', price: 499.9 },
  ],
  Scarpins: [
    { name: 'Scarpin New Caramelo', price: 309.9 },
    { name: 'Scarpin Boneca (Ginger)', price: 309.9 },
    { name: 'Scarpin Boneca (Nude)', price: 309.9 },
    { name: 'Scarpin Boneca (Preto)', price: 309.9 },
    { name: 'Scarpin Whisky com detalhes em Caramelo', price: 309.9 },
    { name: 'Scarpin Preto com detalhes em Verniz Preto', price: 309.9 },
    { name: 'Scarpin Clássico Baixo Pinhão', price: 309.9 },
    { name: 'Scarpin Clássico Baixo Caramelo', price: 309.9 },
  ],
  Sandálias: [
    { name: 'Sandália Angélica ( Laranja)', price: 319.9 },
    { name: 'Sandália Angélica ( Ouro Light)', price: 319.9 },
    { name: 'Sandália em Couro Caramelo', price: 319.9 },
    { name: 'Sandália Caramelo com debrum Off White', price: 319.9 },
    { name: 'Sandália Angélica ( Azul Claro)', price: 319.9 },
  ],
};

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

async function main() {
  console.log('Iniciando o processo de seeding...');

  // 1. Limpar dados existentes
  console.log('Limpando tabelas de produtos e categorias...');
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  console.log('Tabelas limpas.');

  // 2. Criar categorias e produtos
  for (const categoryName of Object.keys(siteData)) {
    console.log(`Criando categoria: ${categoryName}`);
    const category = await prisma.category.create({
      data: {
        name: categoryName,
        slug: generateSlug(categoryName),
        description: `Categoria para ${categoryName}`,
      },
    });
    console.log(`Categoria ${categoryName} criada com id: ${category.id}`);

    const productsToCreate = siteData[categoryName];
    for (const productData of productsToCreate) {
      console.log(`  - Criando produto: ${productData.name}`);
      await prisma.product.create({
        data: {
          name: productData.name,
          slug: generateSlug(productData.name),
          description: `Descrição para ${productData.name}`,
          price: productData.price,
          images: [],
          sizes: ['35', '36', '37', '38', '39', '40'],
          colors: ['default'],
          inStock: true,
          featured: false,
          categoryId: category.id,
        },
      });
    }
    console.log(`${productsToCreate.length} produtos criados para a categoria ${categoryName}.`);
  }

  console.log('Seeding concluído com sucesso!');
}

main()
  .catch(e => {
    console.error('Ocorreu um erro durante o seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

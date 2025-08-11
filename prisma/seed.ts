import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Dados extraídos do site
const siteData = {
  Birken: [
    {
      name: 'Birken Olívia Off White',
      price: 299.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/300202296/whatsapp-image-2024-09-02-at-21-10-19-vdh5rkiibk.jpeg',
      ],
    },
    {
      name: 'Birken Olívia Croco Caramelo',
      price: 299.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/300196536/whatsapp-image-2024-09-02-at-21-10-18-psaw33x2jm.jpeg',
      ],
    },
    {
      name: 'Birken Joana Caramelo Com Fivela',
      price: 299.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/300193980/whatsapp-image-2024-09-02-at-20-32-35-m8mc07w29s.jpeg',
      ],
    },
  ],
  Botas: [
    {
      name: 'Bota Cano Médio Café / Salto 6',
      price: 499.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/274786079/whatsapp-image-2024-06-16-at-11-26-40-iz0j1694w3.jpeg',
      ],
    },
    {
      name: 'Bota Fernanda em Couro Preto',
      price: 499.9,
      images: ['https://cdn.awsli.com.br/600x450/1036/1036448/produto/95085431/212d87edb4.jpg'],
    },
    { name: 'Bota Coturno Cano Médio Preta', price: 499.9, images: [] }, // Imagem não fornecida
  ],
  Scarpins: [
    {
      name: 'Scarpin New Caramelo',
      price: 309.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/236858431/whatsapp-image-2023-10-10-at-20-53-18-zrj1e9x7fb.jpeg',
      ],
    },
    {
      name: 'Scarpin Boneca (Ginger)',
      price: 309.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/236192226/whatsapp-image-2023-10-04-at-16-17-41-t99pce3whp.jpeg',
      ],
    },
    {
      name: 'Scarpin Boneca (Nude)',
      price: 309.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/236192135/whatsapp-image-2023-10-04-at-16-40-04-wx755h6tbq.jpeg',
      ],
    },
    {
      name: 'Scarpin Boneca (Preto)',
      price: 309.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/236191899/whatsapp-image-2023-10-04-at-16-24-38-87wkr2fo2y.jpeg',
      ],
    },
    {
      name: 'Scarpin Whisky com detalhes em Caramelo',
      price: 309.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/206648839/scarpin-caramelo-wtsywy.jpg',
      ],
    },
    {
      name: 'Scarpin Preto com detalhes em Verniz Preto',
      price: 309.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/206648095/scarpin-verniz-syhkof.jpg',
      ],
    },
    {
      name: 'Scarpin Clássico Baixo Pinhão',
      price: 309.9,
      images: ['https://cdn.awsli.com.br/600x450/1036/1036448/produto/55819810/ad55d7e93a.jpg'],
    },
    {
      name: 'Scarpin Clássico Baixo Caramelo',
      price: 309.9,
      images: ['https://cdn.awsli.com.br/600x450/1036/1036448/produto/55817100/d393225876.jpg'],
    },
    {
      name: 'Scarpin Clássico Baixo Preto',
      price: 309.9,
      images: ['https://cdn.awsli.com.br/600x450/1036/1036448/produto/55124419/1289bd537b.jpg'],
    },
  ],
  Sandálias: [
    {
      name: 'Sandália Angélica ( Laranja)',
      price: 319.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/301056960/laranja-2-ufnllucu39.jpeg',
      ],
    },
    {
      name: 'Sandália Angélica ( Ouro Light)',
      price: 319.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/301053349/whatsapp-image-2024-09-06-at-12-52-41--1--xwvqqr47fe.jpeg',
      ],
    },
    {
      name: 'Sandália em Couro Caramelo',
      price: 319.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/208211520/sandalia-cb-190-ivvrsg.jpg',
      ],
    },
    {
      name: 'Sandália Caramelo com debrum Off White',
      price: 319.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/206772005/sandalia-caramelo-e-off-ogqroa.jpg',
      ],
    },
    {
      name: 'Sandália Angélica ( Azul Claro)',
      price: 319.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/124451691/whatsapp-image-2024-09-06-at-12-52-46-arz2a0ild3.jpeg',
      ],
    },
  ],
  'Linha Oxford': [
    {
      name: 'Oxford em Couro Azul',
      price: 299.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/206496154/oxford-azul-suvrvm.jpg',
      ],
    },
    {
      name: 'Oxford em Couro Vermelho',
      price: 299.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/206496262/oxford-red-2-mnpgrf.jpg',
      ],
    },
    {
      name: 'Oxford em Couro Preto',
      price: 299.9,
      images: ['https://cdn.awsli.com.br/600x450/1036/1036448/produto/41671812/19ba2cf0a8.jpg'],
    },
    {
      name: 'Oxford em Couro Vinho',
      price: 299.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/206497067/oxford-vinho-2-sjfybg.jpg',
      ],
    },
  ],
  'Linha Mocassim': [
    {
      name: 'Mocassim Nude',
      price: 289.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/145687937/7896d928-7cde-44f0-9425-204ebf800225-55t58ggym5.jpg',
      ],
    },
    {
      name: 'Mocassim em Couro Preto',
      price: 289.9,
      images: ['https://cdn.awsli.com.br/600x450/1036/1036448/produto/142065689/ecc7ea255d.jpg'],
    },
  ],
  Sapatilhas: [
    {
      name: 'Sapatilha Basic Whisky',
      price: 259.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/112340797/whatsapp-image-2023-10-03-at-20-19-09-fcbj3dl9rw.jpeg',
      ],
    },
    {
      name: 'Sapatilha Basic Ouro Light',
      price: 259.9,
      images: ['https://cdn.awsli.com.br/600x450/1036/1036448/produto/112341227/9b15305b5c.jpg'],
    },
    {
      name: 'Sapatilha Basic Prata Velha',
      price: 259.9,
      images: ['https://cdn.awsli.com.br/600x450/1036/1036448/produto/112340834/4c8b5bd6e8.jpg'],
    },
    {
      name: 'Sapatilha Bailarina Off White',
      price: 259.9,
      images: ['https://cdn.awsli.com.br/600x450/1036/1036448/produto/165794805/35abdf1bf5.jpg'],
    },
    {
      name: 'Sapatilha Bailarina Mostarda',
      price: 259.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/165793829/whatsapp-image-2023-10-03-at-19-29-47-t01inr32ts.jpeg',
      ],
    },
    {
      name: 'Sapatilha Bailarina Preta',
      price: 259.9,
      images: ['https://cdn.awsli.com.br/600x450/1036/1036448/produto/41668845/37eae169f5.jpg'],
    },
    {
      name: 'Sapatilha Bailarina Nude',
      price: 259.9,
      images: ['https://cdn.awsli.com.br/600x450/1036/1036448/produto/43942761/a1775abb04.jpg'],
    },
    {
      name: 'Sapatilha Bailarina Plume Vermelho',
      price: 259.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/43940149/whatsapp-image-2023-10-03-at-19-36-05-bqy3u1zokr.jpeg',
      ],
    },
    {
      name: 'Sapatilha Bailarina Onça',
      price: 259.9,
      images: ['https://cdn.awsli.com.br/600x450/1036/1036448/produto/58933201/705e27b16e.jpg'],
    },
    {
      name: 'Sapatilha Bailarina Plume Rosa Claro',
      price: 259.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/58934458/sapatilha-rosa-20d87cfqbu.jpeg',
      ],
    },
    {
      name: 'Sapatilha Basic Preta',
      price: 259.9,
      images: ['https://cdn.awsli.com.br/600x450/1036/1036448/produto/78974239/68199e538d.jpg'],
    },
  ],
  Rasteiras: [
    {
      name: 'Rasteira H Preta',
      price: 229.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/187031270/whatsapp-image-2024-09-10-at-11-17-29-suk5jgw79s.jpeg',
      ],
    },
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
          images: productData.images,
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

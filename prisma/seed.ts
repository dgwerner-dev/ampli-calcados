import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

// Usar a conexão direta para operações de seed
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL,
    },
  },
});

// Configuração do Supabase para criar usuário admin
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Dados extraídos do site com códigos dos produtos
const siteData = {
  Birken: [
    {
      name: 'Birken Olívia Off White',
      code: '9WMPFCUM4',
      price: 299.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/300202296/whatsapp-image-2024-09-02-at-21-10-19-vdh5rkiibk.jpeg',
      ],
    },
    {
      name: 'Birken Olívia Croco Caramelo',
      code: 'JCDR4GJGT',
      price: 299.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/300196536/whatsapp-image-2024-09-02-at-21-10-18-psaw33x2jm.jpeg',
      ],
    },
    {
      name: 'Birken Joana Caramelo Com Fivela',
      code: 'HERZ4F4AA',
      price: 299.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/300193980/whatsapp-image-2024-09-02-at-20-32-35-m8mc07w29s.jpeg',
      ],
    },
  ],
  Botas: [
    {
      name: 'Bota Cano Médio Café / Salto 6',
      code: 'HRBUVLULX-IVEFV24LA',
      price: 499.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/274786079/whatsapp-image-2024-06-16-at-11-26-40-iz0j1694w3.jpeg',
      ],
    },
    {
      name: 'Bota Fernanda em Couro Preto',
      code: 'KB464RPNT',
      price: 499.9,
      images: ['https://cdn.awsli.com.br/600x450/1036/1036448/produto/95085431/212d87edb4.jpg'],
    },
    {
      name: 'Bota Coturno Cano Médio Preta',
      code: 'COTURNO-PRETA-001',
      price: 499.9,
      images: [],
    }, // Imagem não fornecida
  ],
  Scarpins: [
    {
      name: 'Scarpin New Caramelo',
      code: 'EVPWVFKCJ',
      price: 309.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/236858431/whatsapp-image-2023-10-10-at-20-53-18-zrj1e9x7fb.jpeg',
      ],
    },
    {
      name: 'Scarpin Boneca (Ginger)',
      code: 'HYFTD2AT5',
      price: 309.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/236192226/whatsapp-image-2023-10-04-at-16-17-41-t99pce3whp.jpeg',
      ],
    },
    {
      name: 'Scarpin Boneca (Nude)',
      code: 'YTMSVKYE3',
      price: 309.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/236192135/whatsapp-image-2023-10-04-at-16-40-04-wx755h6tbq.jpeg',
      ],
    },
    {
      name: 'Scarpin Boneca (Preto)',
      code: 'NL2G6L3CT',
      price: 309.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/236191899/whatsapp-image-2023-10-04-at-16-24-38-87wkr2fo2y.jpeg',
      ],
    },
    {
      name: 'Scarpin Whisky com detalhes em Caramelo',
      code: 'Q83QEJJ7Q-TXKNYYP75',
      price: 309.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/206648839/scarpin-caramelo-wtsywy.jpg',
      ],
    },
    {
      name: 'Scarpin Preto com detalhes em Verniz Preto',
      code: 'Q83QEJJ7Q',
      price: 309.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/206648095/scarpin-verniz-syhkof.jpg',
      ],
    },
    {
      name: 'Scarpin Clássico Baixo Pinhão',
      code: 'FBZEMQGPJ',
      price: 309.9,
      images: ['https://cdn.awsli.com.br/600x450/1036/1036448/produto/55819810/ad55d7e93a.jpg'],
    },
    {
      name: 'Scarpin Clássico Baixo Caramelo',
      code: 'WUPFSKS2L',
      price: 309.9,
      images: ['https://cdn.awsli.com.br/600x450/1036/1036448/produto/55817100/d393225876.jpg'],
    },
    {
      name: 'Scarpin Clássico Baixo Preto',
      code: 'NWAX889EE',
      price: 309.9,
      images: ['https://cdn.awsli.com.br/600x450/1036/1036448/produto/55124419/1289bd537b.jpg'],
    },
  ],
  Sandálias: [
    {
      name: 'Sandália Angélica ( Laranja)',
      code: 'GXABEDQTW',
      price: 319.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/301056960/laranja-2-ufnllucu39.jpeg',
      ],
    },
    {
      name: 'Sandália Angélica ( Ouro Light)',
      code: 'EJMY2T7T2',
      price: 319.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/301053349/whatsapp-image-2024-09-06-at-12-52-41--1--xwvqqr47fe.jpeg',
      ],
    },
    {
      name: 'Sandália em Couro Caramelo',
      code: 'H73MTNNCV-RYO9U645N-3BKR44ZSV',
      price: 319.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/208211520/sandalia-cb-190-ivvrsg.jpg',
      ],
    },
    {
      name: 'Sandália Caramelo com debrum Off White',
      code: 'H73MTNNCV-AAZAIWR2N',
      price: 319.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/206772005/sandalia-caramelo-e-off-ogqroa.jpg',
      ],
    },
    {
      name: 'Sandália Angélica ( Azul Claro)',
      code: 'ACSARRGN4',
      price: 319.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/124451691/whatsapp-image-2024-09-06-at-12-52-46-arz2a0ild3.jpeg',
      ],
    },
  ],
  'Linha Oxford': [
    {
      name: 'Oxford em Couro Azul',
      code: '25JM2HYSB-1BDF1ZNNY',
      price: 299.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/206496154/oxford-azul-suvrvm.jpg',
      ],
    },
    {
      name: 'Oxford em Couro Vermelho',
      code: '25JM2HYSB-1BDF1ZNNY-49PB0NV8V',
      price: 299.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/206496262/oxford-red-2-mnpgrf.jpg',
      ],
    },
    {
      name: 'Oxford em Couro Preto',
      code: 'MWTZYKQQP',
      price: 299.9,
      images: ['https://cdn.awsli.com.br/600x450/1036/1036448/produto/41671812/19ba2cf0a8.jpg'],
    },
    {
      name: 'Oxford em Couro Vinho',
      code: '25JM2HYSB-1BDF1ZNNY-49PB0NV8V-U00DHBZ4R',
      price: 299.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/206497067/oxford-vinho-2-sjfybg.jpg',
      ],
    },
  ],
  'Linha Mocassim': [
    {
      name: 'Mocassim Nude',
      code: 'FYSAHSD7E',
      price: 289.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/145687937/7896d928-7cde-44f0-9425-204ebf800225-55t58ggym5.jpg',
      ],
    },
    {
      name: 'Mocassim em Couro Preto',
      code: '5SHTRP5AK',
      price: 289.9,
      images: ['https://cdn.awsli.com.br/600x450/1036/1036448/produto/142065689/ecc7ea255d.jpg'],
    },
  ],
  Sapatilhas: [
    {
      name: 'Sapatilha Basic Whisky',
      code: 'UHWTPGSJF',
      price: 259.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/112340797/whatsapp-image-2023-10-03-at-20-19-09-fcbj3dl9rw.jpeg',
      ],
    },
    {
      name: 'Sapatilha Basic Ouro Light',
      code: '5UZWDD7VK',
      price: 259.9,
      images: ['https://cdn.awsli.com.br/600x450/1036/1036448/produto/112341227/9b15305b5c.jpg'],
    },
    {
      name: 'Sapatilha Basic Prata Velha',
      code: '3U64F3TYG',
      price: 259.9,
      images: ['https://cdn.awsli.com.br/600x450/1036/1036448/produto/112340834/4c8b5bd6e8.jpg'],
    },
    {
      name: 'Sapatilha Bailarina Off White',
      code: 'DJUWKZ8R2',
      price: 259.9,
      images: ['https://cdn.awsli.com.br/600x450/1036/1036448/produto/165794805/35abdf1bf5.jpg'],
    },
    {
      name: 'Sapatilha Bailarina Mostarda',
      code: 'D2RFNJNYB',
      price: 259.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/165793829/whatsapp-image-2023-10-03-at-19-29-47-t01inr32ts.jpeg',
      ],
    },
    {
      name: 'Sapatilha Bailarina Preta',
      code: 'EK4KXQ9HS',
      price: 259.9,
      images: ['https://cdn.awsli.com.br/600x450/1036/1036448/produto/41668845/37eae169f5.jpg'],
    },
    {
      name: 'Sapatilha Bailarina Nude',
      code: 'CG68QMHKN',
      price: 259.9,
      images: ['https://cdn.awsli.com.br/600x450/1036/1036448/produto/43942761/a1775abb04.jpg'],
    },
    {
      name: 'Sapatilha Bailarina Plume Vermelho',
      code: 'CLRKM532V',
      price: 259.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/43940149/whatsapp-image-2023-10-03-at-19-36-05-bqy3u1zokr.jpeg',
      ],
    },
    {
      name: 'Sapatilha Bailarina Onça',
      code: 'WNHTP4DFY',
      price: 259.9,
      images: ['https://cdn.awsli.com.br/600x450/1036/1036448/produto/58933201/705e27b16e.jpg'],
    },
    {
      name: 'Sapatilha Bailarina Plume Rosa Claro',
      code: '7X67EUBMY',
      price: 259.9,
      images: [
        'https://cdn.awsli.com.br/600x450/1036/1036448/produto/58934458/sapatilha-rosa-20d87cfqbu.jpeg',
      ],
    },
    {
      name: 'Sapatilha Basic Preta',
      code: 'ALZ7Z98YD',
      price: 259.9,
      images: ['https://cdn.awsli.com.br/600x450/1036/1036448/produto/78974239/68199e538d.jpg'],
    },
  ],
  Rasteiras: [
    {
      name: 'Rasteira H Preta',
      code: 'ZP7A7SKL',
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
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s]+/g, '') // Remove caracteres especiais, mantém espaços
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/(^-|-$)+/g, ''); // Remove hífens no início e fim
}

async function createAdminUser() {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.log(
      '⚠️  Variáveis de ambiente do Supabase não encontradas, pulando criação do usuário admin'
    );
    return null;
  }

  try {
    console.log('🔧 Criando usuário admin no Supabase...');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verificar se o usuário admin já existe
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      console.log('⚠️  Erro ao verificar usuários existentes:', listError.message);
      return null;
    }

    const adminExists = existingUsers.users.find(user => user.email === 'admin@amplicalcados.com');

    if (adminExists) {
      console.log('✅ Usuário admin já existe no Supabase Auth');
      return adminExists.id;
    }

    // Criar usuário admin
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: 'admin@amplicalcados.com',
      password: 'admin123',
      email_confirm: true,
      user_metadata: {
        name: 'Administrador AMPLI',
      },
    });

    if (createError) {
      console.log('⚠️  Erro ao criar usuário admin:', createError.message);
      return null;
    }

    console.log('✅ Usuário admin criado no Supabase Auth');
    console.log(`📧 Email: ${newUser.user.email}`);
    console.log(`🆔 ID: ${newUser.user.id}`);
    console.log('🔑 Senha: admin123');

    return newUser.user.id;
  } catch (error) {
    console.log('⚠️  Erro ao criar usuário admin:', error);
    return null;
  }
}

async function main() {
  console.log('Iniciando o processo de seeding...');

  // 1. Criar usuário admin no Supabase
  const adminUserId = await createAdminUser();

  // 2. Limpar dados existentes
  console.log('Limpando tabelas de produtos e categorias...');
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  console.log('Tabelas limpas.');

  // 3. Criar categorias e produtos
  for (const categoryName of Object.keys(siteData)) {
    console.log(`Criando categoria: ${categoryName}`);
    const category = await prisma.category.create({
      data: {
        name: categoryName,
        slug: generateSlug(categoryName),
        description: null,
      },
    });
    console.log(`Categoria ${categoryName} criada com id: ${category.id}`);

    const productsToCreate = (siteData as any)[categoryName];
    for (const productData of productsToCreate) {
      console.log(`  - Criando produto: ${productData.name} (Código: ${productData.code})`);
      await prisma.product.create({
        data: {
          code: productData.code,
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

  // 4. Criar usuário admin na tabela users se o ID foi obtido
  if (adminUserId) {
    try {
      console.log('Criando usuário admin na tabela users...');

      await prisma.user.create({
        data: {
          id: adminUserId,
          email: 'admin@amplicalcados.com',
          name: 'Administrador AMPLI',
          role: 'ADMIN',
          isActive: true,
        },
      });

      console.log('✅ Usuário admin criado na tabela users');
    } catch (error) {
      console.log('⚠️  Erro ao criar usuário admin na tabela users:', error);
    }
  }

  console.log('Seeding concluído com sucesso!');

  if (adminUserId) {
    console.log('');
    console.log('🎯 USUÁRIO ADMIN CRIADO:');
    console.log('   - Email: admin@amplicalcados.com');
    console.log('   - Senha: admin123');
    console.log('   - Role: ADMIN');
    console.log('');
    console.log('⚠️  IMPORTANTE: Altere a senha no primeiro login!');
  }
}

main()
  .catch(e => {
    console.error('Ocorreu um erro durante o seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

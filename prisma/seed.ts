import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar categorias básicas
  console.log('📂 Criando categorias básicas...');
  
  const categories = [
    {
      name: 'Birken',
      slug: 'birken',
      description: 'Sandálias Birkenstock - Conforto e qualidade alemã',
      image: null,
    },
    {
      name: 'Botas',
      slug: 'botas',
      description: 'Botas elegantes e confortáveis para todas as ocasiões',
      image: null,
    },
    {
      name: 'Linhas Flat',
      slug: 'linhas-flat',
      description: 'Calçados com solado baixo para máximo conforto',
      image: null,
    },
    {
      name: 'Sandálias',
      slug: 'sandalias',
      description: 'Sandálias confortáveis para o dia a dia',
      image: null,
    },
    {
      name: 'Tênis',
      slug: 'tenis',
      description: 'Tênis esportivos e casuais',
      image: null,
    },
    {
      name: 'Sapatos',
      slug: 'sapatos',
      description: 'Sapatos elegantes para ocasiões especiais',
      image: null,
    },
    {
      name: 'Rasteiras',
      slug: 'rasteiras',
      description: 'Rasteiras confortáveis e estilosas',
      image: null,
    },
    {
      name: 'Mocassins',
      slug: 'mocassins',
      description: 'Mocassins clássicos e versáteis',
      image: null,
    },
  ];

  for (const category of categories) {
    const existingCategory = await prisma.category.findUnique({
      where: { slug: category.slug },
    });

    if (!existingCategory) {
      await prisma.category.create({
        data: category,
      });
      console.log(`✅ Categoria "${category.name}" criada`);
    } else {
      console.log(`⏭️  Categoria "${category.name}" já existe`);
    }
  }

  console.log('✅ Categorias básicas criadas com sucesso!');
  console.log('');

  // Verificar se já existe um admin
  const existingAdmin = await prisma.user.findFirst({
    where: {
      role: 'ADMIN',
    },
  });

  if (existingAdmin) {
    console.log('✅ Admin já existe no sistema');
    return;
  }

  // Criar admin padrão
  const admin = await prisma.user.create({
    data: {
      id: 'admin-user-id', // ID fixo para o admin
      email: 'admin@amplicalcados.com',
      name: 'Administrador AMPLI',
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log('✅ Admin criado com sucesso:', admin.email);
  console.log('📝 Credenciais do admin:');
  console.log('   Email: admin@amplicalcados.com');
  console.log('   Senha: admin123 (deve ser alterada no primeiro login)');
  console.log('');
  console.log('⚠️  IMPORTANTE:');
  console.log('   1. Acesse o Supabase e crie o usuário de auth manualmente');
  console.log('   2. Use o email: admin@amplicalcados.com');
  console.log('   3. Defina uma senha segura');
  console.log('   4. Confirme o email do usuário');
}

main()
  .catch(e => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

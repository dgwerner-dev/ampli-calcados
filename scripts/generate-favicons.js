import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logoPath = path.join(__dirname, '../assets/images/logo.png');
const publicDir = path.join(__dirname, '../public');

async function generateFavicons() {
  try {
    console.log('🎨 Gerando favicons...');
    
    // Favicon padrão (32x32)
    await sharp(logoPath)
      .resize(32, 32)
      .png()
      .toFile(path.join(publicDir, 'logo-32x32.png'));
    console.log('✅ logo-32x32.png criado');

    // Favicon pequeno (16x16)
    await sharp(logoPath)
      .resize(16, 16)
      .png()
      .toFile(path.join(publicDir, 'logo-16x16.png'));
    console.log('✅ logo-16x16.png criado');

    // Apple touch icon (180x180)
    await sharp(logoPath)
      .resize(180, 180)
      .png()
      .toFile(path.join(publicDir, 'logo-180x180.png'));
    console.log('✅ logo-180x180.png criado');

    // Favicon ICO (32x32)
    await sharp(logoPath)
      .resize(32, 32)
      .png()
      .toFile(path.join(publicDir, 'favicon.ico'));
    console.log('✅ favicon.ico criado');

    console.log('🎉 Todos os favicons foram gerados com sucesso!');
    console.log('📁 Arquivos criados na pasta public/');
    
  } catch (error) {
    console.error('❌ Erro ao gerar favicons:', error.message);
    process.exit(1);
  }
}

generateFavicons();

export const testUsers = {
  admin: {
    email: 'admin@amplicalcados.com',
    password: 'admin123',
    name: 'Administrador Teste'
  },
  user: {
    email: 'user@amplicalcados.com',
    password: 'user123',
    name: 'Usuário Teste'
  },
  newUser: {
    email: 'newuser@amplicalcados.com',
    password: 'newuser123',
    name: 'Novo Usuário'
  }
};

export const testProducts = [
  {
    name: 'Sapato Elegante Teste',
    price: 299.99,
    category: 'Sapatos',
    color: 'preto',
    size: '38'
  },
  {
    name: 'Tênis Esportivo Teste',
    price: 199.99,
    category: 'Tênis',
    color: 'branco',
    size: '40'
  },
  {
    name: 'Sandália Feminina Teste',
    price: 159.99,
    category: 'Sandálias',
    color: 'dourado',
    size: '36'
  }
];

export const testAddress = {
  name: 'João Silva',
  phone: '11999999999',
  cep: '01310-100',
  street: 'Avenida Paulista',
  number: '1000',
  neighborhood: 'Bela Vista',
  city: 'São Paulo',
  state: 'SP'
};

export const testShippingPromotion = {
  name: 'Frete Grátis Teste',
  minOrderValue: 599.99,
  discountPercentage: 100,
  validFrom: new Date().toISOString(),
  validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 dias
};
